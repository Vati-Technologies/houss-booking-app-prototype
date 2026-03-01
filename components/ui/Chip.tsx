import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface ChipProps {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'outline';
    size?: 'sm' | 'md';
    style?: ViewStyle;
}

export const Chip = ({ label, variant = 'default', size = 'md', style }: ChipProps) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return Theme.colors.accent.purpleLight;
            case 'success': return '#E6F4EA';
            case 'warning': return '#FFF4E5';
            case 'danger': return Theme.colors.danger.background;
            case 'outline': return 'transparent';
            default: return Theme.colors.border;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return Theme.colors.accent.purple;
            case 'success': return Theme.colors.primary.default;
            case 'warning': return Theme.colors.warning.default;
            case 'danger': return Theme.colors.danger.default;
            case 'outline': return Theme.colors.text.secondary;
            default: return Theme.colors.text.primary;
        }
    };

    const height = size === 'sm' ? 24 : 32;
    const paddingHorizontal = size === 'sm' ? 8 : 12;

    return (
        <View
            style={[
                styles.chip,
                {
                    backgroundColor: getBackgroundColor(),
                    height,
                    paddingHorizontal,
                    borderWidth: variant === 'outline' ? 1 : 0,
                    borderColor: Theme.colors.border,
                },
                style,
            ]}
        >
            <Text
                style={[
                    Theme.typography.caption,
                    { color: getTextColor(), fontWeight: variant === 'default' ? '400' : '600' },
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        borderRadius: Theme.radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
    },
});
