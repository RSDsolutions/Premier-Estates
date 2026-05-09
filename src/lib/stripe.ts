import { loadStripe } from '@stripe/stripe-js'

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined

export const stripePromise = pk ? loadStripe(pk) : null
