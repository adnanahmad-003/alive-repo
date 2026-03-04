import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

type Props = {
    width: number;
    height: number;
};

const GalleryTileSkeleton = memo(function GalleryTileSkeleton({
    width,
    height,
}: Props) {
    return (
        <View style={[styles.container, { width, height }]}>
            <Skeleton
                containerStyle={styles.skeletonContainer}
                isLoading={true}
                layout={[
                    {
                        width: width,
                        height: height,
                        borderRadius: 8,
                    },
                ]}
                boneColor="#1a1a1a"
                highlightColor="#2a2a2a"
                animationType="shiver"
                animationDirection="horizontalRight"
                duration={1200}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
    },
    skeletonContainer: {
        flex: 1,
    },
});

export default GalleryTileSkeleton;
