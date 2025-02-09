import dotenv from "dotenv"

dotenv.config()
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECTRET_KEY)