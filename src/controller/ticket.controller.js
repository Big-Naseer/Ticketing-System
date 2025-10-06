import prisma from "../config/prisma.js";
import { v4 as uuidv4 } from "uuid";

// Create ticket
export const createTicket = async (req, res) => {
  try {
    const { ownerName } = req.body;
    const adminId = req.user.id; // 👈 coming from JWT middleware

    const ticket = await prisma.ticket.create({
      data: {
        code: uuidv4(),
        ownerName,
        adminId,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get ticket details
export const getTicket = async (req, res) => {
  try {
    const { code } = req.params;
    const adminId = req.user.id; // From token middleware

    const ticket = await prisma.ticket.findUnique({
      where: { code },
      include: { logs: true },
    });

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    // Check ownership
    if (ticket.adminId !== adminId) {
      return res.status(403).json({ error: "Unauthorized access to this ticket" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all tickets by logged-in Admin
export const getMyTickets = async (req, res) => {
  try {
    const adminId = req.user.id;

    const tickets = await prisma.ticket.findMany({
      where: { adminId },
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Check-in
export const checkIn = async (req, res) => {
  const { code } = req.body;
  const ticket = await prisma.ticket.findUnique({ where: { code } });

  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (ticket.status === "inside")
    return res.status(400).json({ error: "Already inside" });

  const updated = await prisma.ticket.update({
    where: { code },
    data: { status: "inside", logs: { create: { action: "checkin" } } },
    include: { logs: true },
  });

  res.json({ message: "Entry granted", ticket: updated });
};

// Check-out
export const checkOut = async (req, res) => {
  const { code } = req.body;
  const ticket = await prisma.ticket.findUnique({ where: { code } });

  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (ticket.status === "outside")
    return res.status(400).json({ error: "Already outside" });

  const updated = await prisma.ticket.update({
    where: { code },
    data: { status: "outside", logs: { create: { action: "checkout" } } },
    include: { logs: true },
  });

  res.json({ message: "Exit recorded", ticket: updated });
};
