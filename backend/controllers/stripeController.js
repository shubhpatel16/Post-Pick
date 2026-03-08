import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    let { amount } = req.body;

    // convert to paise
    let stripeAmount = Math.round(Number(amount) * 100);

    // Stripe minimum safety
    if (stripeAmount < 50) {
      stripeAmount = 50;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { createPaymentIntent };