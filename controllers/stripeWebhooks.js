{
  /*import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle stripe webhooks

export const stripewebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY,
    );
  } catch (err) {
    //response.status(400).send(`Webhook Error: ${err.message}`);
    console.log("Stripe webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    // payment_intent.succeeded
    // checkout.session.completed
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;

    // Mark Payment as Paid
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });
  } else {
    console.log("Unhandled event type : ", event.type);
  }
  response.json({ received: true });
};
*/
}

import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripewebhooks = async (request, response) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY,
    );
  } catch (err) {
    console.log("Stripe webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log("Webhook hit");
    console.log("Event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      console.log("Booking ID from metadata:", bookingId);

      if (!bookingId) {
        return response.status(400).json({
          success: false,
          message: "bookingId not found in session metadata",
        });
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          isPaid: true,
          paymentMethod: "Stripe",
        },
        { new: true },
      );

      console.log("Updated booking:", updatedBooking);
    } else {
      console.log("Unhandled event type:", event.type);
    }

    return response.json({ received: true });
  } catch (error) {
    console.log("Webhook processing error:", error.message);
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
