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

app.post("/payment", async (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
