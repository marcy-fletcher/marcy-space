import { Suspense } from "react"

import { MarketListingGrid } from "@/components/market/market-listing-grid"
import { PaginatedMarket } from "@/components/market/paginated-market"
import { digitalPersonas } from "@/lib/digital-personas"
import { joinMarketListings, marketListings } from "@/lib/market-listings"

const pageSize = 12
const listingItems = joinMarketListings(marketListings, digitalPersonas)

export default function Home() {
  return (
    <Suspense
      fallback={
        <section aria-label="Market listings">
          <MarketListingGrid listings={listingItems.slice(0, pageSize)} />
        </section>
      }
    >
      <PaginatedMarket listings={listingItems} pageSize={pageSize} />
    </Suspense>
  )
}
