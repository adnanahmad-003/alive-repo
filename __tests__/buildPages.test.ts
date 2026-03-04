/**
 * buildPages unit tests
 *
 * Covers all composition rules, edge cases, video preference,
 * tie-breaking, and order preservation.
 */

import { buildPages } from '../src/utils/buildPages';
import { GalleryItem } from '../src/types/gallery';

// ── Factories ────────────────────────────────────────

const makeImage = (id: string, ar = 1.5): GalleryItem => ({
    type: 'image',
    src: id,
    aspectRatio: ar,
});

const makeVideo = (id: string, ar = 0.5625): GalleryItem => ({
    type: 'video',
    src: id,
    aspectRatio: ar,
});

// ── Tests ────────────────────────────────────────────

describe('buildPages', () => {
    test('returns empty array for empty input', () => {
        expect(buildPages([])).toEqual([]);
    });

    test('returns empty array for < 3 items', () => {
        expect(buildPages([makeImage('i1'), makeVideo('v1')])).toEqual([]);
    });

    test('Case A: 1 video + 2 images → video left, images right', () => {
        const items = [makeVideo('v1', 0.56), makeImage('i1', 1.5), makeImage('i2', 1.0)];
        const pages = buildPages(items);

        expect(pages).toHaveLength(1);
        expect(pages[0].left.src).toBe('v1');
        expect(pages[0].left.type).toBe('video');
        expect(pages[0].rightTop.src).toBe('i1');
        expect(pages[0].rightBottom.src).toBe('i2');
    });

    test('Case B: 2 videos + 1 image → best video left, 2nd video rightTop, image rightBottom', () => {
        const items = [makeVideo('v1', 0.56), makeVideo('v2', 0.8), makeImage('i1', 1.0)];
        const pages = buildPages(items);

        expect(pages).toHaveLength(1);
        // v1 (0.56) is closer to 0.5625 than v2 (0.8)
        expect(pages[0].left.src).toBe('v1');
        expect(pages[0].rightTop.src).toBe('v2');
        expect(pages[0].rightBottom.src).toBe('i1');
    });

    test('Case C: 3 videos → all video, best video left', () => {
        const items = [makeVideo('v1', 0.8), makeVideo('v2', 0.56), makeVideo('v3', 0.7)];
        const pages = buildPages(items);

        expect(pages).toHaveLength(1);
        // v2 (0.56) is closest to 0.5625
        expect(pages[0].left.src).toBe('v2');
        expect(pages[0].rightTop.src).toBe('v1');
        expect(pages[0].rightBottom.src).toBe('v3');
    });

    test('Case D: all images → first 3 in order', () => {
        const items = [makeImage('i1'), makeImage('i2'), makeImage('i3')];
        const pages = buildPages(items);

        expect(pages).toHaveLength(1);
        expect(pages[0].left.src).toBe('i1');
        expect(pages[0].rightTop.src).toBe('i2');
        expect(pages[0].rightBottom.src).toBe('i3');
    });

    test('drops leftover items that cannot form a complete page', () => {
        const items = [
            makeImage('i1'),
            makeImage('i2'),
            makeImage('i3'),
            makeImage('i4'), // leftover
        ];
        const pages = buildPages(items);
        expect(pages).toHaveLength(1);
    });

    test('video preference: picks closest to 9:16 per page', () => {
        // 6 items → 2 pages
        const items = [
            makeVideo('v1', 0.8),   // score |0.8 - 0.5625| = 0.2375
            makeVideo('v2', 0.56),  // score |0.56 - 0.5625| = 0.0025  ← best
            makeImage('i1'),
            makeImage('i2'),
            makeImage('i3'),
            makeImage('i4'),
        ];
        const pages = buildPages(items);

        expect(pages).toHaveLength(2);
        // Page 1: v2 should be picked as best video
        expect(pages[0].left.src).toBe('v2');
        // Page 2: v1 is the only remaining video
        expect(pages[1].left.src).toBe('v1');
    });

    test('tie-breaker: earlier video wins when equally close', () => {
        const items = [
            makeVideo('v1', 0.5625),
            makeVideo('v2', 0.5625),
            makeImage('i1'),
            makeImage('i2'),
            makeImage('i3'),
            makeImage('i4'),
        ];
        const pages = buildPages(items);
        // Both score 0, v1 appears earlier → chosen first
        expect(pages[0].left.src).toBe('v1');
        expect(pages[1].left.src).toBe('v2');
    });

    test('preserves image order within pages', () => {
        const items = [
            makeImage('i1', 1.0),
            makeImage('i2', 1.5),
            makeImage('i3', 0.8),
            makeImage('i4', 1.78),
            makeImage('i5', 1.0),
            makeImage('i6', 1.5),
        ];
        const pages = buildPages(items);

        expect(pages).toHaveLength(2);
        // Page 1
        expect(pages[0].left.src).toBe('i1');
        expect(pages[0].rightTop.src).toBe('i2');
        expect(pages[0].rightBottom.src).toBe('i3');
        // Page 2
        expect(pages[1].left.src).toBe('i4');
        expect(pages[1].rightTop.src).toBe('i5');
        expect(pages[1].rightBottom.src).toBe('i6');
    });

    test('handles large datasets (100+ items)', () => {
        const items: GalleryItem[] = [];
        for (let i = 0; i < 102; i++) {
            items.push(makeImage(`i${i}`, 1 + Math.random()));
        }
        const pages = buildPages(items);
        expect(pages).toHaveLength(34); // 102 / 3 = 34
    });

    test('mixed: video scattered among many images', () => {
        const items = [
            makeImage('i1'),
            makeImage('i2'),
            makeVideo('v1', 0.56),
            makeImage('i3'),
            makeImage('i4'),
            makeImage('i5'),
            makeVideo('v2', 0.9),
            makeImage('i6'),
            makeImage('i7'),
        ];
        const pages = buildPages(items);
        expect(pages).toHaveLength(3);

        // Page 1: v1 (best video 0.56), then first 2 images
        expect(pages[0].left.src).toBe('v1');
        expect(pages[0].left.type).toBe('video');
        expect(pages[0].rightTop.src).toBe('i1');
        expect(pages[0].rightBottom.src).toBe('i2');

        // Page 2: v2 (only remaining video 0.9), then next 2 images
        expect(pages[1].left.src).toBe('v2');
        expect(pages[1].left.type).toBe('video');
        expect(pages[1].rightTop.src).toBe('i3');
        expect(pages[1].rightBottom.src).toBe('i4');

        // Page 3: all images
        expect(pages[2].left.src).toBe('i5');
        expect(pages[2].rightTop.src).toBe('i6');
        expect(pages[2].rightBottom.src).toBe('i7');
    });

    test('missing aspectRatio on videos → treated as worst score (Infinity)', () => {
        const videoNoAr: GalleryItem = {
            type: 'video',
            src: 'v_noar',
            // aspectRatio is undefined
        };
        const videoWithAr = makeVideo('v_good', 0.56);
        const items = [videoNoAr, videoWithAr, makeImage('i1'), makeImage('i2'), makeImage('i3')];
        const pages = buildPages(items);

        expect(pages).toHaveLength(1);
        // v_good (0.56) should be preferred over v_noar (Infinity score)
        expect(pages[0].left.src).toBe('v_good');
    });

    test('missing aspectRatio on images → still placed correctly', () => {
        const imageNoAr: GalleryItem = {
            type: 'image',
            src: 'i_noar',
            // no aspectRatio
        };
        const items = [imageNoAr, makeImage('i2'), makeImage('i3')];
        const pages = buildPages(items);

        expect(pages).toHaveLength(1);
        expect(pages[0].left.src).toBe('i_noar');
        expect(pages[0].rightTop.src).toBe('i2');
        expect(pages[0].rightBottom.src).toBe('i3');
    });

    test('single video among many (only video available for one page)', () => {
        const items = [
            makeImage('i1'),
            makeImage('i2'),
            makeImage('i3'),
            makeImage('i4'),
            makeVideo('v1', 0.56),
            makeImage('i5'),
            makeImage('i6'),
            makeImage('i7'),
            makeImage('i8'),
        ];
        const pages = buildPages(items);

        expect(pages).toHaveLength(3);
        // Page 1 gets the only video
        expect(pages[0].left.src).toBe('v1');
        expect(pages[0].left.type).toBe('video');
        // Pages 2 & 3 are all images
        expect(pages[1].left.type).toBe('image');
        expect(pages[2].left.type).toBe('image');
    });
});
