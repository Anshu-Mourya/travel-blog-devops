const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
require("dotenv").config();

const Destination = require("./models/Destination");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Connect to MongoDB ──────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Routes ──────────────────────────────────────────────

// GET all destinations
app.get("/api/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new destination
app.post("/api/destinations", async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Start Server ────────────────────────────────────────
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);