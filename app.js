import express from "express";
import dotenv from "dotenv";
import ticketRoutes from "./src/routes/ticket.route.js";
import authroutes from "./src/routes/auth.route.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/tickets", ticketRoutes);
app.use("/auth",authroutes)

app.listen(1177, () => console.log("API running at 1177"));
