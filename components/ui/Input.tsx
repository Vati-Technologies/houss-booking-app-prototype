import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Theme } from '../../constants/Theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={Theme.colors.text.muted}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Theme.spacing.md,
    },
    label: {
        ...Theme.typography.body,
        fontWeight: '600',
        marginBottom: Theme.spacing.xs,
        color: Theme.colors.text.primary,
    },
    input: {
        backgroundColor: Theme.colors.background.app,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        paddingHorizontal: Theme.spacing.md,
        height: 48,
        ...Theme.typography.bodyLg,
        color: Theme.colors.text.primary,
    },
    inputError: {
        borderColor: Theme.colors.danger.default,
    },
    error: {
        ...Theme.typography.caption,
        color: Theme.colors.danger.default,
        marginTop: Theme.spacing.xs,
    },
});
