import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Video from 'react-native-video';
import Skeleton from 'react-native-reanimated-skeleton';
import { GalleryItem } from '../types/gallery';
import {
    getPreviewUrl,
    getImageProcessedUrl,
    getImageUrl,
    getVideoPosterPreviewUrl,
    getVideoPosterProcessedUrl,
    getVideoPosterUrl,
    getVideoProcessedUrl,
    getVideoUrl,
} from '../constants/config';

type Props = {
    item: GalleryItem;
    width: number;
    height: number;
    isVisible: boolean;
    onPress?: (item: GalleryItem) => void;
};

const SkeletonOverlay = memo(function SkeletonOverlay({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    return (
        <View style={styles.overlay}>
            <Skeleton
                containerStyle={styles.skeletonContainer}
                isLoading={true}
                layout={[{ width, height, borderRadius: 0 }]}
                boneColor="#1a1a1a"
                highlightColor="#2a2a2a"
                animationType="shiver"
                animationDirection="horizontalRight"
                duration={1200}
            />
        </View>
    );
});

const GalleryTile = memo(function GalleryTile({
    item,
    width,
    height,
    isVisible,
    onPress,
}: Props) {
    const [imageTryIdx, setImageTryIdx] = useState(0);
    const [loadedImageUri, setLoadedImageUri] = useState<string | null>(null);
    const imageTryIdxRef = useRef(0);

    const [posterTryIdx, setPosterTryIdx] = useState(0);
    const [loadedPosterUri, setLoadedPosterUri] = useState<string | null>(null);
    const posterTryIdxRef = useRef(0);

    const [videoFallbackIdx, setVideoFallbackIdx] = useState(0);
    const [videoReady, setVideoReady] = useState(false);

    imageTryIdxRef.current = imageTryIdx;
    posterTryIdxRef.current = posterTryIdx;

    const imageUrls = useMemo(() =>
        item.type === 'image'
            ? [
                getPreviewUrl(item.src),
                getImageProcessedUrl(item.src),
                getImageUrl(item.src),
            ]
            : [],
        [item.src, item.type],
    );

    const posterUrls = useMemo(() =>
        item.type === 'video'
            ? [
                getVideoPosterPreviewUrl(item.src),
                getVideoPosterProcessedUrl(item.src),
                getVideoPosterUrl(item.src),
            ]
            : [],
        [item.src, item.type],
    );

    const videoUrls = useMemo(() =>
        item.type === 'video'
            ? [
                getVideoProcessedUrl(item.src),
                getVideoUrl(item.src),
            ]
            : [],
        [item.src, item.type],
    );

    const handleImageLoad = useCallback(() => {
        const uri = imageUrls[imageTryIdxRef.current];
        if (uri) {
            setLoadedImageUri(uri);
        }
    }, [imageUrls]);

    const handleImageError = useCallback(() => {
        setImageTryIdx(prev => prev + 1);
    }, []);

    const handlePosterLoad = useCallback(() => {
        const uri = posterUrls[posterTryIdxRef.current];
        if (uri) {
            setLoadedPosterUri(uri);
        }
    }, [posterUrls]);

    const handlePosterError = useCallback(() => {
        setPosterTryIdx(prev => prev + 1);
    }, []);

    const handleVideoError = useCallback(() => {
        setVideoReady(false);
        setVideoFallbackIdx(prev => prev + 1);
    }, []);

    const handleVideoReady = useCallback(() => {
        setVideoReady(true);
    }, []);

    if (item.type === 'image') {
        const hasMoreUrls = imageTryIdx < imageUrls.length;

        return (
            <TouchableWithoutFeedback onPress={() => onPress?.(item)}>
                <View style={[styles.container, { width, height }]}>
                    {loadedImageUri ? (
                        <FastImage
                            source={{
                                uri: loadedImageUri,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.media}
                            resizeMode={FastImage.resizeMode.cover}
                            accessibilityLabel={item.alt}
                        />
                    ) : (
                        <>
                            <SkeletonOverlay width={width} height={height} />
                            {hasMoreUrls && (
                                <FastImage
                                    source={{
                                        uri: imageUrls[imageTryIdx],
                                        priority: FastImage.priority.normal,
                                        cache: FastImage.cacheControl.immutable,
                                    }}
                                    style={styles.media}
                                    resizeMode={FastImage.resizeMode.cover}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            )}
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    const hasVideoSource = videoFallbackIdx < videoUrls.length;
    const showOverlay = !videoReady;
    const hasMorePosters = posterTryIdx < posterUrls.length;

    return (
        <TouchableWithoutFeedback onPress={() => onPress?.(item)}>
            <View style={[styles.container, { width, height }]}>
                {hasVideoSource && (
                    <Video
                        source={{ uri: videoUrls[videoFallbackIdx] }}
                        style={styles.media}
                        resizeMode="cover"
                        paused={!isVisible}
                        repeat
                        muted
                        onReadyForDisplay={handleVideoReady}
                        onError={handleVideoError}
                    />
                )}

                {showOverlay && (
                    loadedPosterUri ? (
                        <FastImage
                            source={{
                                uri: loadedPosterUri,
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.overlay}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    ) : (
                        <>
                            <SkeletonOverlay width={width} height={height} />
                            {hasMorePosters && (
                                <FastImage
                                    source={{
                                        uri: posterUrls[posterTryIdx],
                                        priority: FastImage.priority.high,
                                        cache: FastImage.cacheControl.immutable,
                                    }}
                                    style={styles.overlay}
                                    resizeMode={FastImage.resizeMode.cover}
                                    onLoad={handlePosterLoad}
                                    onError={handlePosterError}
                                />
                            )}
                        </>
                    )
                )}
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
    },
    media: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    skeletonContainer: {
        flex: 1,
    },
});

export default GalleryTile;
