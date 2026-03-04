import React, { memo, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';

type Props = {
    visible: boolean;
    onPress: () => void;
};

const NudgeButton = memo(function NudgeButton({ visible, onPress }: Props) {
    const opacity = useSharedValue(visible ? 1 : 0);
    const translateX = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 250 });
            translateX.value = withRepeat(
                withSequence(
                    withTiming(-6, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
                ),
                4,
                false
            );
        } else {
            cancelAnimation(translateX);
            opacity.value = withTiming(0, { duration: 250 });
            translateX.value = withTiming(0, { duration: 250 });
        }

        return () => {
            cancelAnimation(opacity);
            cancelAnimation(translateX);
        };
    }, [visible, opacity, translateX]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <Animated.View
            style={[styles.container, animatedStyle]}
            pointerEvents={visible ? 'auto' : 'none'}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.button}
                activeOpacity={0.8}
                accessibilityLabel="Scroll to next page"
                accessibilityRole="button">
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 8,
        top: '50%',
        marginTop: -22,
        zIndex: 10,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chevron: {
        color: '#ffffff',
        fontSize: 26,
        fontWeight: '600',
        marginTop: -2,
    },
});

export default NudgeButton;
