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
