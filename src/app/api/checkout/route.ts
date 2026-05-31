import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use the latest version
});

export async function POST(req: Request) {
  try {
    const { orderNumber, amount, userEmail } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Bespoke Order: ${orderNumber}`,
              description: "Final Balance Settlement - Oguchi Boutique",
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?payment=cancelled`,
      metadata: { orderNumber },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}