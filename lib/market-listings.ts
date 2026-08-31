import type { DigitalPersona } from "./digital-personas"
import type { Money } from "./money"

export type MarketListing = Readonly<{
  id: number
  personaId: number
  owner: string
  price: Money<"USDC">
}>

export type MarketListingItem = Readonly<{
  listing: MarketListing
  persona: DigitalPersona
}>

export const marketListings = [
  {
    id: 1,
    personaId: 4821,
    owner: "@nightarchive",
    price: { amount: 4_800, currency: "USDC" },
  },
  {
    id: 2,
    personaId: 9317,
    owner: "@formandfunction",
    price: { amount: 6_250, currency: "USDC" },
  },
  {
    id: 3,
    personaId: 11204,
    owner: "@commonthread",
    price: { amount: 5_100, currency: "USDC" },
  },
] as const satisfies readonly MarketListing[]

export function joinMarketListings(
  listings: readonly MarketListing[],
  personas: readonly DigitalPersona[]
) {
  const personasById = new Map(personas.map((persona) => [persona.id, persona]))

  return listings.map((listing): MarketListingItem => {
    const persona = personasById.get(listing.personaId)

    if (!persona) {
      throw new Error(
        `Missing Digital Persona ${listing.personaId} for Market Listing ${listing.id}`
      )
    }

    return { listing, persona }
  })
}
