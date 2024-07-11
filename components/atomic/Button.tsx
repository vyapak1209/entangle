import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ButtonProps = {
    text: string;
    onButtonPress: () => void;
    ripple?: boolean;
    disabled?: boolean;
    iconNode?: ReactNode;
    fullWidth?: boolean;
    type?: 'primary' | 'secondary';
}

const Button = ({ text, ripple, disabled, onButtonPress, iconNode, fullWidth = false, type = 'primary' }: ButtonProps) => {
    return (
        <View style={{ overflow: 'hidden' }}>
            <Pressable
                style={[
                    disabled ? styles.buttonDisabled : {}, 
                    styles.buttonContainer, 
                    fullWidth ? { width: '100%' } : {},
                    type === 'primary' ? styles.primary : styles.secondary
                ]}
                onPress={onButtonPress}
                android_ripple={{ color: Colors.light.subtleBackground, foreground: true }}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>
                    {text}
                </Text>
                {iconNode}
            </Pressable>
        </View>
    )
}

export default Button;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: Colors.light.subtleBackground,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        maxWidth: 'auto',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        minWidth: 85,
        minHeight: 45,
        overflow: 'hidden'
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    buttonDisabled: {
        opacity: 0.5,
        pointerEvents: 'none'
    },
    primary: {

    },
    secondary: {
        backgroundColor: 'transparent',
        borderColor: Colors.light.subtleBackground,
        borderWidth: 2
    }
})