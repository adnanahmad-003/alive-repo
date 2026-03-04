import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PAGE_GAP } from '../constants/config';
import GalleryTileSkeleton from './GalleryTileSkeleton';

type Props = {
    pageWidth: number;
    pageHeight: number;
};

const GalleryPageSkeleton = memo(function GalleryPageSkeleton({
    pageWidth,
    pageHeight,
}: Props) {
    const colWidth = (pageWidth - PAGE_GAP) / 2;
    const rightTileHeight = (pageHeight - PAGE_GAP) / 2;

    return (
        <View style={[styles.page, { width: pageWidth, height: pageHeight }]}>
            <GalleryTileSkeleton width={colWidth} height={pageHeight} />

            <View style={[styles.rightColumn, { marginLeft: PAGE_GAP }]}>
                <GalleryTileSkeleton width={colWidth} height={rightTileHeight} />
                <View style={{ height: PAGE_GAP }} />
                <GalleryTileSkeleton width={colWidth} height={rightTileHeight} />
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

export default GalleryPageSkeleton;
