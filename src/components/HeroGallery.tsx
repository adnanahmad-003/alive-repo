import React, { memo, useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
    ViewToken,
} from 'react-native';
import { PageLayout } from '../types/gallery';
import { useGallery } from '../hooks/useGallery';
import { usePrefetch } from '../hooks/usePrefetch';
import GalleryPage from './GalleryPage';
import GalleryPageSkeleton from './GalleryPageSkeleton';
import FullScreenGallery from './FullScreenGallery';
import NudgeButton from './NudgeButton';
import PageIndicator from './PageIndicator';
import { GalleryItem } from '../types/gallery';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PAGE_HEIGHT = Math.round(SCREEN_HEIGHT * 0.7);

const VIEWABILITY_CONFIG = {
    itemVisiblePercentThreshold: 60,
};

const HeroGallery = memo(function HeroGallery() {
    const { items, pages, loading, error } = useGallery();
    const flatListRef = useRef<FlatList<PageLayout>>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [nudgeDismissed, setNudgeDismissed] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    usePrefetch(pages, currentPage);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index != null) {
                const idx = viewableItems[0].index;
                setCurrentPage(idx);
                if (idx > 0) {
                    setNudgeDismissed(true);
                }
            }
        },
        [],
    );

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig: VIEWABILITY_CONFIG, onViewableItemsChanged },
    ]);

    const handleNudgePress = useCallback(() => {
        flatListRef.current?.scrollToIndex({ index: 1, animated: true });
        setNudgeDismissed(true);
    }, []);

    const handleTilePress = useCallback((item: GalleryItem) => {
        setSelectedItem(item);
    }, []);

    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
        }),
        [],
    );

    const keyExtractor = useCallback(
        (_item: PageLayout, index: number) => `page-${index}`,
        [],
    );

    const renderPage = useCallback(
        ({ item, index }: { item: PageLayout; index: number }) => (
            <GalleryPage
                page={item}
                pageWidth={SCREEN_WIDTH}
                pageHeight={PAGE_HEIGHT}
                isVisible={index === currentPage}
                onPress={handleTilePress}
            />
        ),
        [currentPage],
    );


    if (loading) {
        return (
            <View style={styles.wrapper}>
                <GalleryPageSkeleton
                    pageWidth={SCREEN_WIDTH}
                    pageHeight={PAGE_HEIGHT}
                />
            </View>
        );
    }


    if (error) {
        return (
            <View style={[styles.center, { height: PAGE_HEIGHT }]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (pages.length === 0) {
        return null;
    }


    return (
        <View style={styles.wrapper}>
            <FlatList
                ref={flatListRef}
                data={pages}
                renderItem={renderPage}
                keyExtractor={keyExtractor}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                windowSize={5}
                maxToRenderPerBatch={2}
                initialNumToRender={1}
                updateCellsBatchingPeriod={100}
                removeClippedSubviews={true}
                decelerationRate="fast"
            />

            <NudgeButton
                visible={currentPage === 0 && !nudgeDismissed}
                onPress={handleNudgePress}
            />

            <View style={styles.indicatorContainer}>
                <PageIndicator total={pages.length} current={currentPage} />
            </View>

            <FullScreenGallery
                visible={!!selectedItem}
                items={items}
                initialIndex={selectedItem ? items.findIndex(i => i.src === selectedItem.src) : 0}
                onClose={() => setSelectedItem(null)}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        height: PAGE_HEIGHT,
        backgroundColor: '#fff',
        marginTop: 60,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
    },
});

export default HeroGallery;
