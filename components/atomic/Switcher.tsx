import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type SwitcherProps = {
    choices: { value: string; title: string }[];
    onSelect: (value: string) => void;
    selected: string;
}

const Switcher = ({ choices, onSelect, selected }: SwitcherProps) => {

    const current = choices.findIndex(item => item.value === selected);

    const onPressHandle = () => {
        onSelect(choices[ current + 1 >= choices.length ? 0 : current + 1 ].value);
    }

    return (
        <View style={{ overflow: 'hidden' }}>
            <Pressable
                style={styles.switcherContainer}
                onPress={onPressHandle}
                android_ripple={{ color: Colors.light.subtleBackground, foreground: true }}
            >
                <Text style={styles.switcherText}>
                    {choices[current].title}
                </Text>
                <Ionicons name="chevron-expand-outline" size={24} color="black" />
            </Pressable>
        </View>
    )
}

export default Switcher;

const styles = StyleSheet.create({
    switcherContainer: {
        backgroundColor: Colors.light.subtleBackground,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 10,
        maxWidth: 'auto',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    switcherText: {
        fontSize: 22,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    }
})