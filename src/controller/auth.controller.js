import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma  from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Register new admin
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });

    res.json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
