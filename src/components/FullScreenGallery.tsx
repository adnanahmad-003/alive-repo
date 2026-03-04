import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    SafeAreaView,
    ViewToken,
    Platform,
    ActivityIndicator,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Video from 'react-native-video';
import { GalleryItem } from '../types/gallery';
import { getImageUrl, getVideoUrl, getVideoPosterUrl, getVideoProcessedUrl } from '../constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
    visible: boolean;
    items: GalleryItem[];
    initialIndex: number;
    onClose: () => void;
};

type TileProps = {
    item: GalleryItem;
    isVisible: boolean;
};

const FullScreenTile = memo(function FullScreenTile({ item, isVisible }: TileProps) {
    const [videoTryIdx, setVideoTryIdx] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    if (item.type === 'video') {
        const videoUrls = [
            getVideoProcessedUrl(item.src),
            getVideoUrl(item.src),
        ];
        const posterUrl = getVideoPosterUrl(item.src);
        const currentUri = videoUrls[videoTryIdx] || videoUrls[0];

        return (
            <View style={styles.tileContainer}>
                <Video
                    source={{ uri: currentUri }}
                    style={styles.media}
                    resizeMode="contain"
                    paused={!isVisible}
                    repeat
                    muted={isMuted}
                    controls={true}
                    poster={posterUrl}
                    posterResizeMode="contain"
                    onError={() => {
                        if (videoTryIdx < videoUrls.length - 1) {
                            setVideoTryIdx(videoTryIdx + 1);
                        }
                    }}
                />

                <TouchableOpacity
                    style={styles.muteButton}
                    onPress={() => setIsMuted(prev => !prev)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.muteButtonText}>
                        {isMuted ? '🔇 Unmute' : '🔊 Mute'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = getImageUrl(item.src);

    return (
        <View style={styles.tileContainer}>
            <FastImage
                source={{
                    uri: imageUrl,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                }}
                style={styles.media}
                resizeMode={FastImage.resizeMode.contain}
                accessibilityLabel={item.alt}
            />
        </View>
    );
});

const VIEWABILITY_CONFIG = {
    itemVisiblePercentThreshold: 60,
};

const FullScreenGallery = memo(function FullScreenGallery({
    visible,
    items,
    initialIndex,
    onClose,
}: Props) {
    const flatListRef = useRef<FlatList<GalleryItem>>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (visible) {
            setCurrentIndex(initialIndex);
        }
    }, [visible, initialIndex]);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index != null) {
                setCurrentIndex(viewableItems[0].index);
            }
        },
        [],
    );

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig: VIEWABILITY_CONFIG, onViewableItemsChanged },
    ]);

    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
        }),
        [],
    );

    const renderItem = useCallback(
        ({ item, index }: { item: GalleryItem; index: number }) => (
            <FullScreenTile item={item} isVisible={index === currentIndex} />
        ),
        [currentIndex],
    );

    const keyExtractor = useCallback((item: GalleryItem, index: number) => `${item.src}-${index}`, []);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalBackground}>
                <View style={styles.header}>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} / {items.length}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Close gallery">
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={getItemLayout}
                    initialScrollIndex={initialIndex > 0 && initialIndex < items.length ? initialIndex : 0}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    windowSize={3}
                    maxToRenderPerBatch={2}
                    initialNumToRender={1}
                    removeClippedSubviews={Platform.OS === 'android'}
                />
            </SafeAreaView>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    counterText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    closeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    tileContainer: {
        width: SCREEN_WIDTH,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    media: {
        ...StyleSheet.absoluteFillObject,
    },
    muteButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        zIndex: 50,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    muteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default FullScreenGallery;
