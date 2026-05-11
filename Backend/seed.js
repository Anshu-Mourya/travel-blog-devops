require("dotenv").config();
const mongoose    = require("mongoose");
const Destination = require("./models/Destination");

const data = [
  { name: "Bali",      country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
  { name: "Paris",     country: "France",    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
  { name: "Maldives",  country: "Maldives",  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
  { name: "Tokyo",     country: "Japan",     image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
  { name: "Santorini", country: "Greece",    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400" },
  { name: "New York",  country: "USA",       image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400" },
  { name: "Dubai",     country: "UAE",       image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400" },
  { name: "London",    country: "UK",        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Destination.deleteMany();
  await Destination.insertMany(data);
  console.log("✅ Database seeded with", data.length, "destinations!");
  process.exit();
}).catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});