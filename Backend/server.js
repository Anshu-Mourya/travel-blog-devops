const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const client    = require("prom-client");
require("dotenv").config();

const Destination = require("./models/Destination");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Prometheus Metrics Setup ────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route"],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const activeConnections = new client.Gauge({
  name: "active_connections",
  help: "Number of active connections",
  registers: [register],
});

// Middleware to track every request
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.path,
  });
  activeConnections.inc();

  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
    activeConnections.dec();
    end();
  });

  next();
});

// ── Connect to MongoDB ──────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Routes ──────────────────────────────────────────────

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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

// DELETE a destination
app.delete("/api/destinations/:id", async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Destination deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ────────────────────────────────────────
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);