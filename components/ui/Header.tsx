import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/Theme';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}

export const Header = ({ title, showBack = true, rightElement }: HeaderProps) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Feather name="chevron-left" size={28} color={Theme.colors.text.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.titleContainer}>
                {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : null}
            </View>

            <View style={styles.rightContainer}>
                {rightElement}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: Theme.spacing.md,
        backgroundColor: Theme.colors.background.app,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    titleContainer: {
        flex: 2,
        alignItems: 'center',
    },
    title: {
        ...Theme.typography.h3,
        color: Theme.colors.text.primary,
    },
    iconButton: {
        padding: Theme.spacing.xs,
        marginLeft: -Theme.spacing.xs,
    },
});
