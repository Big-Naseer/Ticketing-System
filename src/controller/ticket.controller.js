import prisma from "../config/prisma.js";
import { v4 as uuidv4 } from "uuid";

// Create ticket
export const createTicket = async (req, res) => {
  const { ownerName } = req.body;
  try {
    const ticket = await prisma.ticket.create({
      data: {
        code: uuidv4(),   // generate unique ticket code
        ownerName,
      },
    });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// Get ticket details
export const getTicket = async (req, res) => {
  const { code } = req.params;
  const ticket = await prisma.ticket.findUnique({
    where: { code },
    include: { logs: true },
  });
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
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
