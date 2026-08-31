import { Suspense } from "react"

import { MarketListingGrid } from "@/components/market/market-listing-grid"
import { PaginatedMarket } from "@/components/market/paginated-market"
import { marketListings } from "@/lib/market-listings"

const pageSize = 12

export default function Home() {
  return (
    <Suspense
      fallback={
        <section aria-label="Market listings">
          <MarketListingGrid listings={marketListings.slice(0, pageSize)} />
        </section>
      }
    >
      <PaginatedMarket listings={marketListings} pageSize={pageSize} />
    </Suspense>
  )
}
