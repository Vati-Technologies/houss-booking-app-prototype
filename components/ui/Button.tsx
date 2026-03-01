import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../constants/Theme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    textStyle?: object;
}

export const Button = ({
    title,
    variant = 'primary',
    size = 'lg',
    loading = false,
    style,
    textStyle,
    disabled,
    ...props
}: ButtonProps) => {

    const getBackgroundColor = () => {
        if (disabled && variant !== 'ghost' && variant !== 'outline') return Theme.colors.border;
        switch (variant) {
            case 'primary': return Theme.colors.primary.default;
            case 'secondary': return Theme.colors.accent.purpleLight;
            case 'danger': return Theme.colors.danger.default;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return Theme.colors.primary.default;
        }
    };

    const getTextColor = () => {
        if (disabled && (variant === 'outline' || variant === 'ghost')) return Theme.colors.text.muted;
        switch (variant) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return Theme.colors.accent.purple;
            case 'danger': return '#FFFFFF';
            case 'outline': return Theme.colors.text.primary;
            case 'ghost': return Theme.colors.text.secondary;
            default: return '#FFFFFF';
        }
    };

    const getBorderColor = () => {
        if (variant === 'outline') return Theme.colors.border;
        return 'transparent';
    };

    const getHeight = () => {
        switch (size) {
            case 'sm': return 36;
            case 'md': return 48;
            case 'lg': return 56;
            default: return 56;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    height: getHeight(),
                },
                style,
            ]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        size === 'sm' ? Theme.typography.body : Theme.typography.h4,
                        { color: getTextColor() },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: Theme.radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
        flexDirection: 'row',
    },
    text: {
        textAlign: 'center',
    },
});
