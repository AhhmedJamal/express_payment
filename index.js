/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Oa7BfHIYZ0Ho4vpxjDD2XmRNXFEgSZiTOkHdy98pMVTCDZsef8Vx1fIfA3x3O2OOo2fXksyhXAq8TeTWgWHiyDc00SNO7TMAE"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello ZOTTO");
});

app.post("/payment", async (req, res) => {
  const { totalPrice, email } = req.body; // Extract total price and email from request body

  // Validate input
  if (!totalPrice || !email) {
    return res.status(400).json({ error: "Missing totalPrice or email" });
  }

  console.log(
    `Received payment request: totalPrice=${totalPrice}, email=${email}`
  );

  try {
    const product = await stripe.products.create({
      name: "T-Shirt",
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: totalPrice * 100, // Convert to smallest currency unit
      currency: "EGP",
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://zotto.vercel.app/",
      cancel_url: "https://zotto.vercel.app/",
      customer_email: email, // Use the email provided in the request
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
