const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);
const express = require("express");
const app = express();
app.use(express.static("public"));

// const YOUR_DOMAIN = 'http://localhost:3000';

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: false, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const itemList = req.body.data;
  let line_items = itemList.map((item) => ({
    price: item.price,
    quantity: parseInt(item.quantity),
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_DOMAIN}/success`,
    cancel_url: `${process.env.FRONTEND_DOMAIN}/cancel`,
  });
  res.json({ url: session.url });
});

app.listen(4242, () => console.log("Running on port 4242"));
