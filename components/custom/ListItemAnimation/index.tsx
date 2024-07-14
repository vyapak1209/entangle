import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from "react-native-reanimated";

type ListItemAnimationProps = {
    isVisible: boolean;
    children: React.ReactNode;
};

const ListItemAnimation = ({ isVisible, children }: ListItemAnimationProps) => {
    const opacity = useSharedValue(isVisible ? 0 : 1);
    const translateY = useSharedValue(isVisible ? 20 : 0);

    useEffect(() => {
        if (isVisible) {
            opacity.value = withTiming(1, { duration: 500 });
            translateY.value = withSpring(0);
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default ListItemAnimation;