import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageLayout, GalleryItem } from '../types/gallery';
import { PAGE_GAP } from '../constants/config';
import GalleryTile from './GalleryTile';

type Props = {
    page: PageLayout;
    pageWidth: number;
    pageHeight: number;
    isVisible: boolean;
    onPress?: (item: GalleryItem) => void;
};

const GalleryPage = memo(function GalleryPage({
    page,
    pageWidth,
    pageHeight,
    isVisible,
    onPress,
}: Props) {
    const colWidth = (pageWidth - PAGE_GAP) / 2;
    const rightTileHeight = (pageHeight - PAGE_GAP) / 2;

    return (
        <View style={[styles.page, { width: pageWidth, height: pageHeight }]}>
            <GalleryTile
                item={page.left}
                width={colWidth}
                height={pageHeight}
                isVisible={isVisible}
                onPress={onPress}
            />

            <View style={[styles.rightColumn, { marginLeft: PAGE_GAP }]}>
                <GalleryTile
                    item={page.rightTop}
                    width={colWidth}
                    height={rightTileHeight}
                    isVisible={isVisible}
                    onPress={onPress}
                />
                <View style={{ height: PAGE_GAP }} />
                <GalleryTile
                    item={page.rightBottom}
                    width={colWidth}
                    height={rightTileHeight}
                    isVisible={isVisible}
                    onPress={onPress}
                />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
    },
    rightColumn: {
        justifyContent: 'space-between',
    },
});

export default GalleryPage;
