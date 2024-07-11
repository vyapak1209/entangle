import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

type IconButtonProps = {
    onPressHandle: () => void;
    children: React.ReactNode;
    transparent?: boolean;
    disabled?: boolean;
    size?: number;
}

const IconButton = ({ onPressHandle, children, transparent = false, disabled = false, size = 50 }: IconButtonProps) => {
    return (
        <View style={{ overflow: 'hidden' }}>
            <Pressable
                style={[
                    styles.iconPressable, 
                    transparent ? {backgroundColor: Colors.light.background } : {},
                    disabled ? {opacity: 0.5, pointerEvents: 'none'} : {},
                    { height: size, width: size, borderRadius: size / 2 }
                ]}
                onPress={onPressHandle}
                android_ripple={{ color: Colors.light.subtleBackground, foreground: true }}
            >
                {children}
            </Pressable>
        </View>
    )
}

export default IconButton

const styles = StyleSheet.create({
    iconPressable: {
        backgroundColor: Colors.light.subtleBackground,
        borderRadius: 25,
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
})