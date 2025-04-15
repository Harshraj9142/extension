const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function getMockRating(title, userRating) {
  const score = userRating || Math.floor(Math.random() * 5) + 1;

  let rating, co2, color;
  if (score >= 4) {
    rating = "A";
    co2 = "1.2kg";
    color = "green";
  } else if (score >= 3) {
    rating = "B";
    co2 = "2.5kg";
    color = "orange";
  } else {
    rating = "D";
    co2 = "4.8kg";
    color = "red";
  }

  const alternatives = [
    { name: "EcoSteel Bottle", price: "$15.99", rating: "A", co2: "1.0kg" },
    { name: "Recycled Glass Bottle", price: "$12.99", rating: "B", co2: "1.8kg" },
  ];

  const certifications = ["Fair Trade", "Organic", "B Corp", "Carbon Neutral"];

  return { rating, co2, color, alternatives, certifications };
}

app.post("/rate", (req, res) => {
  const { title, userRating } = req.body;
  const data = getMockRating(title || "Unknown Product", userRating);
  data.product = title;
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Eco-rating server running on http://localhost:${PORT}`);
});
