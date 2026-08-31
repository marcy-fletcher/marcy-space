import { describe, expect, it } from "vitest"

import { digitalPersonas } from "./digital-personas"
import {
  joinMarketListings,
  marketListings,
  type MarketListing,
} from "./market-listings"

describe("market listing joins", () => {
  it("resolves personas and rejects broken references", () => {
    const items = joinMarketListings(marketListings, digitalPersonas)

    expect(items.map(({ persona }) => persona.id)).toEqual([4821, 9317, 11204])

    const brokenListing: MarketListing = {
      id: 99,
      personaId: 404,
      owner: "@missing",
      price: { amount: 1, currency: "USDC" },
    }

    expect(() => joinMarketListings([brokenListing], digitalPersonas)).toThrow(
      "Missing Digital Persona 404 for Market Listing 99"
    )
  })
})
