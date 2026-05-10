const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5001;

app.get("/api/destinations", (req, res) => {
  res.json([
    {
      name: "Maldives",
      image:
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd"
    },
    {
      name: "Switzerland",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    },
    {
      name: "Paris",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
