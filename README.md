# Alive React Native App

This is a React Native project showcasing a fluid and highly optimized Hero Gallery experience.

## Getting Started

1. **Install dependencies**: `npm install` or `yarn`
2. **iOS Setup**: `cd ios && pod install && cd ..`
3. **Run Metro**: `npm start`
4. **Run iOS/Android**: `npm run ios` or `npm run android`

## Tech Stack & Core Libraries

- **React Native**: Core framework.
- **react-native-video**: For powerful video playback with caching.
- **react-native-reanimated**: For fluid 60fps animations.
- **react-native-reanimated-skeleton**: Used to construct high-performant skeleton shimmer placeholders.

### Performance specific libraries:

- **FlatList / FlashList**
  The gallery relies on optimized list structures. For handling many media-heavy items effectively, proper tuning is heavily utilized (e.g. `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews`).
  [FlatList Docs](https://reactnative.dev/docs/flatlist)
  [FlashList Docs](https://shopify.github.io/flash-list/)

- **@d11/react-native-fast-image**
  A high-performance React Native image component that aggressively caches images and significantly boosts loading times.
  [React Native Fast Image Docs](https://github.com/DylanVann/react-native-fast-image)

## Troubleshooting

- Note: The app relies on CocoaPods, be sure to `pod install` periodically when adding/updating native modules.
- If you face cache issues, try running Metro with `npm start -- --reset-cache`.

## Architecture & Implementation Details

### Page-Building Logic
Every page adheres to a 3-slot layout (Left, Right-Top, Right-Bottom). To assemble pages smoothly while adhering to design requirements:
- **Order Preservation**: We sequentially bucket images and videos, retaining the API's original narrative chronologically.
- **Aspect-Ratio Video Selection**: For the prominent Left slot, the algorithm scans the available videos and calculates which one is mathematically closest to the ideal `9:16` vertical ratio.
- **Composition Rules**: Depending on what's available in the queue, we formulate layouts dynamically:
  - *1 Video + 2 Images*: Video on the Left, two images stacked on the Right.
  - *2 Videos + 1 Image*: Best video (9:16) on Left, secondary video Top-Right.
  - *3 Videos*: All slots filled by video.
  - *0 Videos / only Images*: Safely fall back to a 3-image grid.

### CDN Fallback Approach
To ensure the UX is never interrupted by stalled media, we use an aggressive multi-tiered URL fallback cascade:
- **Preview**: Ultra low-res `webp`/thumbnails intended for microsecond loads and predictive prefetching.
- **Processed Mobile**: Middle-weight media files tailored for stable, cellular speeds.
- **Original**: Full-fidelity URLs used once the core components have successfully hydrated.

Using `onError` callbacks, assets visually start with high-performance Shimmer Skeletons, secretly loading from lowest to highest fidelity beneath the layout, only locking in their URIs and dismissing the skeleton once the payload loads via `onLoad` or `onReadyForDisplay`.

### Performance Notes
The core goal of this experience was fluid, unspiked CPU limits.
- **Strict List Virtualization**: The Gallery prevents memory bloat by tightly capping active items using `FlatList` optimizations (`windowSize={5}`, `maxToRenderPerBatch={2}`, `initialNumToRender={1}`, `removeClippedSubviews={true}`).
- **Aggressive Memoization**: Every node (`HeroGallery`, `GalleryPage`, `GalleryTile`) utilizes strict React object persistence (`React.memo`, `useCallback`, `useMemo`) preventing wasteful reconciliation diffs on idle list scrolls.
- **Viewport Video Suspend**: Using React Native's `VIEWABILITY_CONFIG` APIs, video streams are frozen, paused, and completely muted until they organically cross a `>60%` visibility threshold.
- **Look-Ahead Prefetching**: Custom prefetching logic `usePrefetch` preemptively fetches raw bytes for pages `N+1` and `N+2` directly into disk-cache so swiping feels entirely instant.

### What I Would Improve With More Time
- FlatList to FlashList: Migrating the core gallery from React Native's default FlatList to Shopify's FlashList to handle memory pooling and recycling of complex video tiles much more efficiently natively.
- Cursor based pagination: Implementing opaque cursor-based fetching for the API to gracefully handle live insertions/deletions in the backend without shifting the client's current index or showing duplicate media pages during infinite scroll.
- Disk-Level Video Proxy Caching: Currently images heavily benefit from Fast Image `immutable` OS caches. Videos, however, rely on native player buffer retention. I would introduce an aggressive file-system proxy downloader for raw `mp4` chunks to guarantee zero-latency loops on heavy videos.
- Server-Driven Pagination: Moving the algorithmic UI sorting (like assessing distances from 9:16 per tile) directly to the backend. Delivering purely deterministic, paginated views array saves the client from mathematical data sorting.

---

### Demo Video

https://github.com/user-attachments/assets/45fdc8f5-ba94-495b-8308-65dee2cb9a2c
