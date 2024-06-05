const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const stripe = Stripe(
  "sk_test_51Oa7BfHIYZ0Ho4vpxjDD2XmRNXFEgSZiTOkHdy98pMVTCDZsef8Vx1fIfA3x3O2OOo2fXksyhXAq8TeTWgWHiyDc00SNO7TMAE"
);

app.use(bodyParser.json());
app.use(cors());

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.error("Error creating payment intent:", e);
    res.status(500).send({ error: e.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
