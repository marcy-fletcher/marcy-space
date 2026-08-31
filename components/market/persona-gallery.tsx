"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { PersonaMedia } from "@/lib/digital-personas"

export function PersonaGallery({
  gallery,
  name,
}: {
  gallery: readonly PersonaMedia[]
  name: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    if (!api) return

    const updateCurrent = () => setCurrent(api.selectedScrollSnap() + 1)

    const frame = requestAnimationFrame(updateCurrent)
    api.on("select", updateCurrent)

    return () => {
      cancelAnimationFrame(frame)
      api.off("select", updateCurrent)
    }
  }, [api])

  return (
    <Carousel setApi={setApi} opts={{ loop: gallery.length > 1 }}>
      <CarouselContent className="ml-0">
        {gallery.map((item, index) => (
          <CarouselItem
            key={`${item.type}-${item.src}`}
            className="relative aspect-[4/5] pl-0"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={`${name}, preview ${index + 1}`}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : current === index + 1 ? (
              <video
                src={item.src}
                poster={item.poster}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                aria-label={`${name}, video preview ${index + 1}`}
                className="pointer-events-none block size-full object-cover"
              />
            ) : (
              <Image
                src={item.poster}
                alt={`${name}, video preview ${index + 1}`}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>

      {gallery.length > 1 && (
        <>
          <span className="absolute top-3 right-3 z-10 rounded-full bg-black/55 px-2 py-1 text-[0.65rem] font-medium text-white backdrop-blur-sm">
            {current} / {gallery.length}
          </span>
          <CarouselPrevious
            variant="secondary"
            className="left-3 z-10 size-8 border-0 bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background"
          />
          <CarouselNext
            variant="secondary"
            className="right-3 z-10 size-8 border-0 bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background"
          />
        </>
      )}
    </Carousel>
  )
}
