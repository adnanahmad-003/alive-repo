/*
 * CASES
 *     a) 1 video  + 2 images  → video left, images right
 *     b) 2 videos + 1 image   → best video left, 2nd video rightTop, image rightBottom
 *     c) 3 videos + 0 images  → all video
 *     d) 0 videos + ≥3 images → all image
 */
import { GalleryItem, PageLayout } from '../types/gallery';
import { TARGET_ASPECT_RATIO } from '../constants/config';


const videoScore = (item: GalleryItem): number =>
    item.aspectRatio != null
        ? Math.abs(item.aspectRatio - TARGET_ASPECT_RATIO)
        : Infinity;

const pickBestVideoIndex = (videos: GalleryItem[]): number => {
    if (videos.length === 0) {
        return -1;
    }

    let bestIdx = 0;
    let bestScore = videoScore(videos[0]);

    for (let i = 1; i < videos.length; i++) {
        const s = videoScore(videos[i]);
        if (s < bestScore) {
            bestScore = s;
            bestIdx = i;
        }
    }

    return bestIdx;
};


export function buildPages(items: GalleryItem[]): PageLayout[] {
    if (!items || items.length < 3) {
        return [];
    }

    const pages: PageLayout[] = [];
    // Not mutuating the original input
    const remaining = [...items];

    while (remaining.length >= 3) {
        const videoIndices: number[] = [];
        const imageIndices: number[] = [];

        for (let i = 0; i < remaining.length; i++) {
            if (remaining[i].type === 'video') {
                videoIndices.push(i);
            } else {
                imageIndices.push(i);
            }
        }

        const videoCount = videoIndices.length;
        const imageCount = imageIndices.length;

        let left: GalleryItem;
        let rightTop: GalleryItem;
        let rightBottom: GalleryItem;
        const toRemove: Set<number> = new Set();

        if (videoCount >= 1 && imageCount >= 2) {
            const videosAvailable = videoIndices.map(i => remaining[i]);
            const bestLocalIdx = pickBestVideoIndex(videosAvailable);
            const bestGlobalIdx = videoIndices[bestLocalIdx];

            left = remaining[bestGlobalIdx];
            rightTop = remaining[imageIndices[0]];
            rightBottom = remaining[imageIndices[1]];

            toRemove.add(bestGlobalIdx);
            toRemove.add(imageIndices[0]);
            toRemove.add(imageIndices[1]);
        } else if (videoCount >= 2 && imageCount >= 1) {
            const videosAvailable = videoIndices.map(i => remaining[i]);
            const bestLocalIdx = pickBestVideoIndex(videosAvailable);
            const bestGlobalIdx = videoIndices[bestLocalIdx];

            const secondVideoGlobalIdx = videoIndices.find(
                (_, localIdx) => localIdx !== bestLocalIdx,
            )!;

            left = remaining[bestGlobalIdx];
            rightTop = remaining[secondVideoGlobalIdx];
            rightBottom = remaining[imageIndices[0]];

            toRemove.add(bestGlobalIdx);
            toRemove.add(secondVideoGlobalIdx);
            toRemove.add(imageIndices[0]);
        } else if (videoCount >= 3) {
            const videosAvailable = videoIndices.map(i => remaining[i]);
            const bestLocalIdx = pickBestVideoIndex(videosAvailable);
            const bestGlobalIdx = videoIndices[bestLocalIdx];

            const otherVideoIndices = videoIndices.filter(
                (_, localIdx) => localIdx !== bestLocalIdx,
            );

            left = remaining[bestGlobalIdx];
            rightTop = remaining[otherVideoIndices[0]];
            rightBottom = remaining[otherVideoIndices[1]];

            toRemove.add(bestGlobalIdx);
            toRemove.add(otherVideoIndices[0]);
            toRemove.add(otherVideoIndices[1]);
        } else {
            left = remaining[0];
            rightTop = remaining[1];
            rightBottom = remaining[2];

            toRemove.add(0);
            toRemove.add(1);
            toRemove.add(2);
        }

        pages.push({ left, rightTop, rightBottom });

        const sortedRemoveIndices = Array.from(toRemove).sort((a, b) => b - a);
        for (const idx of sortedRemoveIndices) {
            remaining.splice(idx, 1);
        }
    }

    return pages;
}
