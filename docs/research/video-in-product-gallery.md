# Video in the product gallery

## Context

The current `ProductGallery` is a client-side Embla v8 carousel whose slides contain `next/image`. Embla does not constrain slide content: it treats the container's direct children as slides, so an HTML `<video>` can replace an image inside any `CarouselItem` without changing the carousel library ([Embla v8 options](https://www.embla-carousel.com/docs/v8/api/options)).

## Options

| Option | Best for | Benefits | Costs and caveats |
| --- | --- | --- | --- |
| Native `<video>` as a slide | Short, self-hosted product clips | Smallest change; native controls, poster, inline playback, captions, and multiple source formats are platform features. `preload="none"` prevents eager video transfer until playback, while `poster` preserves the card image ([MDN `<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video)). | Each visible card still creates a media element. Pause it when its slide is deselected; Embla's `select` event fires after drag or previous/next navigation ([Embla events](https://www.embla-carousel.com/docs/v8/api/events)). Dragging over native controls may need a narrow `watchDrag` callback that skips Embla dragging for events originating inside the video; Embla officially supports this callback ([Embla `watchDrag`](https://www.embla-carousel.com/docs/v8/api/options#watchdrag)). |
| Poster in carousel, playback in a modal | Longer clips, sound-first media, or dense result grids | Card stays lightweight and visually stable. Mounting the player only after the poster is activated avoids loading video before user intent. shadcn already defines a standard accessible `Dialog` composition for trigger and modal content ([shadcn Dialog](https://ui.shadcn.com/docs/components/radix/dialog)). | One extra interaction; playback is no longer spatially inside the carousel. The player must pause or unmount when the dialog closes. |
| Muted hover autoplay preview | Very short, silent teaser loops | Fast visual preview on pointer devices. Browser autoplay generally works only for inaudible media; use `muted`, `playsInline`, and a click/tap fallback ([MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)). | Poor fit for a four-card grid: several previews can consume bandwidth and create motion. Hover is unavailable or inconvenient on many touch devices, which can be detected with `@media (hover: hover)` ([MDN `hover`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/hover)). Pause on pointer leave, slide change, and when the card leaves view. |
| YouTube/Vimeo iframe | Existing externally hosted videos | Hosting, transcoding, player UI, and playback APIs are delegated to the provider. Next.js distinguishes direct files via `<video>` from platform embeds via `<iframe>` ([Next.js video guide](https://nextjs.org/docs/15/app/guides/videos)); YouTube and Vimeo expose official iframe player APIs ([YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference), [Vimeo Player SDK](https://developer.vimeo.com/player/sdk/basics)). | Heavier third-party player and less visual control. Defer iframe creation until click or modal open. Cross-origin autoplay can still be blocked; YouTube exposes an `onAutoplayBlocked` event. |
| Adaptive streaming (HLS) | Long or HD video, many network conditions, or streaming at scale | HLS can switch between bitrate variants as bandwidth changes ([Apple HLS](https://developer.apple.com/documentation/HTTP-Live-Streaming)). Safari can play HLS directly; other supported browsers can use hls.js over Media Source Extensions ([hls.js](https://github.com/video-dev/hls.js/)). | Requires transcoding, playlists, segmented storage/CDN delivery, feature detection, and another client dependency. Unjustified for short product-card clips unless measured startup or buffering problems appear. |

## Recommendation

Start with **native `<video>` slides** for short product clips:

- Change gallery data from `images: string[]` to a discriminated media list such as `{ type: "image" | "video", src, poster?, alt }[]`.
- Render video with `controls`, `playsInline`, `preload="none"`, a portrait `poster`, and the existing `aspect-[4/5] object-cover` treatment.
- Keep autoplay off. User-initiated playback avoids browser autoplay policy differences and prevents four cards from starting simultaneously.
- On Embla `select`, pause every video that is not in the selected slide. Also pause on component unmount.
- If controls and drag compete, use Embla's `watchDrag` callback only to ignore pointer starts inside `<video>`; keep swipe elsewhere.
- Add WebVTT captions with `<track kind="captions">` when audio carries information. The platform supports timed text tracks natively, and MDN recommends captions and transcripts for accessible video ([MDN `<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track), [MDN video accessibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#accessibility)).

Choose **poster plus modal** instead if clips are long, sound is central, or grid performance becomes more important than inline playback. Do not add HLS, a custom player, or a provider SDK until the media source or measured performance requires it.

## Hosting note

Local files can be served from Next.js `public`, but Next.js gives that folder `Cache-Control: public, max-age=0` because files may change ([Next.js `public` folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)). For production video volume, prefer object storage/CDN URLs with explicit cache policy and versioned filenames rather than treating `public` as the long-term media pipeline.
