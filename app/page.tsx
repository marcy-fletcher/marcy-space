import Link from "next/link"
import { ArrowUpRightIcon, BriefcaseBusinessIcon, UserRoundIcon } from "lucide-react"

import { ProductGallery } from "@/components/market/product-gallery"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { marketListings } from "@/lib/market-listings"

export default function Home() {
  return (
    <section>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {marketListings.map((listing) => (
          <Card
            key={listing.id}
            className="h-full gap-0 overflow-hidden py-0"
          >
            <ProductGallery media={listing.media} name={listing.name} />

            <CardHeader className="gap-3 py-4">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg">{listing.name}</CardTitle>
                <span className="shrink-0 rounded-full bg-muted px-2 py-1 font-mono text-[0.65rem] leading-none text-muted-foreground">
                  {listing.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>{listing.age} years</span>
                <span className="h-3 w-px bg-border" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusinessIcon className="size-3.5" aria-hidden="true" />
                  {listing.occupation}
                </span>
              </div>
              <CardDescription className="line-clamp-3 min-h-15 leading-5">
                {listing.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto px-4 pb-4">
              <dl className="grid grid-cols-[1fr_auto] items-end gap-4 border-t pt-4">
                <div className="min-w-0">
                  <dt className="mb-1 text-[0.65rem] font-medium tracking-wider text-muted-foreground uppercase">
                    Current owner
                  </dt>
                  <dd className="flex min-w-0 items-center gap-1.5 font-medium">
                    <UserRoundIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="truncate">{listing.owner}</span>
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="mb-1 text-[0.65rem] font-medium tracking-wider text-muted-foreground uppercase">
                    Price
                  </dt>
                  <dd className="font-mono text-base font-semibold tracking-tight">
                    {listing.price}
                  </dd>
                </div>
              </dl>
            </CardContent>

            <CardFooter className="border-t-0 bg-transparent p-4 pt-0">
              <Button
                className="w-full justify-between"
                nativeButton={false}
                render={<Link href={`/product?id=${listing.id}`} />}
              >
                View details
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
