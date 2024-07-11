import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

type SlideToDeleteProps = {
    children: React.ReactNode;
    onDelete: () => void;
};

const SlideToDelete = ({ children, onDelete }: SlideToDeleteProps) => {
    const offset = useSharedValue(0);
    const pressed = useSharedValue(false);

    const pan = Gesture.Pan()
        .onBegin(() => {
            pressed.value = true;
        })
        .onChange((event) => {
            offset.value = event.translationX;
        })
        .onEnd(() => {
            if (offset.value > 150) {
                offset.value = withSpring(200, {}, () => {
                    runOnJS(onDelete)();
                });
            } else {
                offset.value = withSpring(0);
            }
            pressed.value = false;
        });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value },
            ]
        }
    });

    return (
        <GestureHandlerRootView
            style={{ maxHeight: 'auto' }}
        >
            <GestureDetector gesture={pan}>
                <Animated.View style={[animatedStyles]}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({

});

export default SlideToDelete;