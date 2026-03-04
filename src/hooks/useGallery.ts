import { useCallback, useEffect, useMemo, useState } from 'react';
import { GalleryItem, PageLayout } from '../types/gallery';
import { fetchGallery } from '../services/api';
import { buildPages } from '../utils/buildPages';

type UseGalleryResult = {
    items: GalleryItem[];
    pages: PageLayout[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

export function useGallery(): UseGalleryResult {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchGallery();
            setItems(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Failed to load gallery';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const pages = useMemo(() => buildPages(items), [items]);

    return { items, pages, loading, error, refetch: load };
}
