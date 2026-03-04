export const CDN_BASE = 'https://cdn.iamalive.app';
export const PROCESSED_MOBILE_PREFIX = '/processed/mobile/';
export const PREVIEW_PREFIX = '/processed/preview/';

export const API_BASE = 'https://dev.iamalive.app/api';
export const GALLERY_ENDPOINT =
    '/destinations/experience/learn-horse-riding-and-trot-down-a-private-forest-trail?fields=gallery';


export const TARGET_ASPECT_RATIO = 9 / 16; // 0.5625
export const PAGE_GAP = 4;
export const ITEMS_PER_PAGE = 3;


/**
 * Primary image URL – direct CDN path (verified working).
 * Spaces in filenames are encoded via encodeURIComponent.
 */
export const getImageUrl = (src: string): string =>
    `${CDN_BASE}/${encodeURIComponent(src)}`;

export const getImageProcessedUrl = (src: string): string =>
    `${CDN_BASE}${PROCESSED_MOBILE_PREFIX}${encodeURIComponent(src)}`;

export const getPreviewUrl = (src: string): string =>
    `${CDN_BASE}${PREVIEW_PREFIX}${encodeURIComponent(src)}`;

export const getVideoUrl = (src: string): string =>
    `${CDN_BASE}/${encodeURIComponent(src)}`;

export const getVideoProcessedUrl = (src: string): string =>
    `${CDN_BASE}${PROCESSED_MOBILE_PREFIX}${encodeURIComponent(src)}`;

export const getVideoPosterUrl = (src: string): string =>
    `${CDN_BASE}/${encodeURIComponent(src)}.webp`;

export const getVideoPosterProcessedUrl = (src: string): string =>
    `${CDN_BASE}${PROCESSED_MOBILE_PREFIX}${encodeURIComponent(src)}.webp`;

export const getVideoPosterPreviewUrl = (src: string): string =>
    `${CDN_BASE}${PREVIEW_PREFIX}${encodeURIComponent(src)}.webp`;
