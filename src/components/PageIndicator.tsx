import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
    total: number;
    current: number;
};

const MAX_DOTS = 7;

const PageIndicator = memo(function PageIndicator({ total, current }: Props) {
    if (total <= 1) {
        return null;
    }

    const half = Math.floor(MAX_DOTS / 2);
    let startIdx = 0;
    let endIdx = total - 1;

    if (total > MAX_DOTS) {
        startIdx = Math.max(0, current - half);
        endIdx = startIdx + MAX_DOTS - 1;
        if (endIdx >= total) {
            endIdx = total - 1;
            startIdx = endIdx - MAX_DOTS + 1;
        }
    }

    const dots: React.ReactElement[] = [];
    for (let i = startIdx; i <= endIdx; i++) {
        const isActive = i === current;
        const isEdge =
            total > MAX_DOTS && (i === startIdx || i === endIdx);
        dots.push(
            <View
                key={i}
                style={[
                    styles.dot,
                    isActive && styles.activeDot,
                    isEdge && styles.edgeDot,
                ]}
            />,
        );
    }

    return <View style={styles.container}>{dots}</View>;
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        marginHorizontal: 3,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ffffff',
    },
    edgeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        opacity: 0.5,
    },
});

export default PageIndicator;
