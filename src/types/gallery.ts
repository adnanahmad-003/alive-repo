export type GalleryItem = {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    aspectRatio?: number;
};

export type PageLayout = {
    left: GalleryItem;
    rightTop: GalleryItem;
    rightBottom: GalleryItem;
};

export type GalleryApiResponse = {
    status: string;
    message: string;
    data: {
        _id: string;
        gallery: GalleryItem[];
    };
};
