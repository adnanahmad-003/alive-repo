
import { GalleryApiResponse, GalleryItem } from '../types/gallery';
import { API_BASE, GALLERY_ENDPOINT } from '../constants/config';

export async function fetchGallery(): Promise<GalleryItem[]> {
    const url = `${API_BASE}${GALLERY_ENDPOINT}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Gallery API error: ${response.status}`);
    }

    const json: GalleryApiResponse = await response.json();

    if (json.status !== 'success') {
        throw new Error(`Gallery API failure: ${json.message}`);
    }

    return json.data.gallery;
}
