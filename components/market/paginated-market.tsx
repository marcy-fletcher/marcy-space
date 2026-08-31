"use client"

import { useSearchParams } from "next/navigation"

import { MarketListingGrid } from "@/components/market/market-listing-grid"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { MarketListing } from "@/lib/market-listings"
import { paginate } from "@/lib/paginate"

export function PaginatedMarket({
  listings,
  pageSize,
}: {
  listings: readonly MarketListing[]
  pageSize: number
}) {
  const searchParams = useSearchParams()
  const { items, page, totalPages } = paginate(
    listings,
    searchParams.get("page"),
    pageSize
  )

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(targetPage))
    return `?${params}`
  }

  return (
    <section className="space-y-8" aria-label="Market listings">
      <MarketListingGrid listings={items} />

      {totalPages > 1 && (
        <Pagination aria-label="Market pages">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? pageHref(page - 1) : undefined}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : undefined}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={pageHref(pageNumber)}
                    isActive={pageNumber === page}
                    aria-label={`Go to page ${pageNumber}`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? pageHref(page + 1) : undefined}
                aria-disabled={page === totalPages}
                tabIndex={page === totalPages ? -1 : undefined}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  )
}
