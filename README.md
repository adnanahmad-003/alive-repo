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
