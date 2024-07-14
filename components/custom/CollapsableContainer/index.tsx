import React, { useState, useEffect } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const CollapsableContainer = ({
  children,
  expanded,
}: {
  children: React.ReactNode;
  expanded: boolean;
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = expanded ? withTiming(contentHeight) : withTiming(0);
  }, [expanded, contentHeight]);

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && contentHeight !== onLayoutHeight) {
      setContentHeight(onLayoutHeight);
    }
  };

  const collapsableStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  return (
    <Animated.View style={[collapsableStyle, { overflow: "hidden" }]}>
      <View style={{ position: "absolute", width: '100%' }} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  );
};
