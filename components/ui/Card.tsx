import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Theme } from '../../constants/Theme';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const Card = ({ children, style, noPadding = false, ...props }: CardProps) => {
    return (
        <View style={[styles.card, !noPadding && styles.padding, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Theme.colors.background.card,
        borderRadius: Theme.radius.xl,
        ...Theme.shadows.card,
        overflow: 'hidden',
    },
    padding: {
        padding: Theme.spacing.lg,
    },
});
