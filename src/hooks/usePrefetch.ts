import { useEffect, useRef } from 'react';
import FastImage, { Source } from '@d11/react-native-fast-image';
import { PageLayout, GalleryItem } from '../types/gallery';
import { getPreviewUrl, getVideoPosterPreviewUrl } from '../constants/config';

const getPrefetchUrl = (item: GalleryItem): string =>
    item.type === 'video'
        ? getVideoPosterPreviewUrl(item.src)
        : getPreviewUrl(item.src);

const prefetchPage = (page: PageLayout): void => {
    const sources: Source[] = [
        { uri: getPrefetchUrl(page.left) },
        { uri: getPrefetchUrl(page.rightTop) },
        { uri: getPrefetchUrl(page.rightBottom) },
    ];

    FastImage.preload(sources);
};

export function usePrefetch(
    pages: PageLayout[],
    currentPage: number,
): void {
    const prefetchedRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        const pagesToPrefetch = [currentPage + 1, currentPage + 2];

        pagesToPrefetch.forEach(pageIdx => {
            if (
                pageIdx < pages.length &&
                !prefetchedRef.current.has(pageIdx)
            ) {
                prefetchPage(pages[pageIdx]);
                prefetchedRef.current.add(pageIdx);
            }
        });
    }, [currentPage, pages]);
}
