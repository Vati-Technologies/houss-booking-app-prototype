import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/ui/Header';
import { Theme } from '../../constants/Theme';
import { CURRENT_USER } from '../../data/misc';

const SETTINGS_SECTIONS = [
    {
        title: 'Account',
        items: [
            { id: '1', label: 'Personal Information', icon: 'user' },
            { id: '2', label: 'Payment Methods', icon: 'credit-card' },
            { id: '3', label: 'Notifications', icon: 'bell' },
        ]
    },
    {
        title: 'Estate',
        items: [
            { id: '4', label: 'My Vehicles', icon: 'truck' },
            { id: '5', label: 'Access Codes', icon: 'key' },
            { id: '6', label: 'Rules & Policies', icon: 'file-text' },
        ]
    },
    {
        title: 'Support',
        items: [
            { id: '7', label: 'Help Center', icon: 'help-circle' },
            { id: '8', label: 'Contact Management', icon: 'message-square' },
        ]
    }
];

export default function ProfileScreen() {
    const router = useRouter();

    const handleSignOut = () => {
        router.replace('/(auth)/welcome');
    };

    return (
        <View style={styles.container}>
            <Header title="Profile" showBack={false} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* User Identity Card */}
                <Card style={styles.userCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarLargeText}>{CURRENT_USER.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.userName}>{CURRENT_USER.name}</Text>
                    <Text style={styles.userEmail}>{CURRENT_USER.email}</Text>

                    <View style={styles.propertyPill}>
                        <Feather name="home" size={14} color={Theme.colors.primary.default} />
                        <Text style={styles.propertyText}>{CURRENT_USER.unit}, {CURRENT_USER.property}</Text>
                    </View>
                </Card>

                {/* Settings Sections */}
                {SETTINGS_SECTIONS.map((section, idx) => (
                    <View key={idx} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>

                        <Card style={styles.settingsCard} noPadding>
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.settingsRow,
                                        index !== section.items.length - 1 && styles.borderBottom
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.settingIconBox}>
                                        <Feather name={item.icon as any} size={20} color={Theme.colors.text.secondary} />
                                    </View>
                                    <Text style={styles.settingLabel}>{item.label}</Text>
                                    <Feather name="chevron-right" size={20} color={Theme.colors.border} />
                                </TouchableOpacity>
                            ))}
                        </Card>
                    </View>
                ))}

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
                    <Feather name="log-out" size={20} color={Theme.colors.danger.default} style={{ marginRight: 8 }} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>EstateLife v1.0.0</Text>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background.app,
    },
    content: {
        padding: Theme.spacing.md,
    },
    userCard: {
        alignItems: 'center',
        paddingVertical: Theme.spacing.xl,
        marginBottom: Theme.spacing.xl,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.colors.primary.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.md,
    },
    avatarLargeText: {
        ...Theme.typography.h1,
        color: '#FFFFFF',
    },
    userName: {
        ...Theme.typography.h2,
        marginBottom: 4,
    },
    userEmail: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
        marginBottom: Theme.spacing.md,
    },
    propertyPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.accent.purpleLight,
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        borderRadius: Theme.radius.full,
    },
    propertyText: {
        ...Theme.typography.bodySm,
        fontWeight: '600',
        color: Theme.colors.primary.default,
        marginLeft: 6,
    },
    section: {
        marginBottom: Theme.spacing.lg,
    },
    sectionTitle: {
        ...Theme.typography.caption,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: Theme.spacing.sm,
        marginBottom: Theme.spacing.sm,
    },
    settingsCard: {
        overflow: 'hidden',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        backgroundColor: Theme.colors.background.card,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    settingIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Theme.colors.background.app,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.md,
    },
    settingLabel: {
        ...Theme.typography.bodyLg,
        flex: 1,
    },
    signOutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        backgroundColor: Theme.colors.danger.background,
        borderRadius: Theme.radius.lg,
        marginTop: Theme.spacing.md,
        marginBottom: Theme.spacing.xl,
    },
    signOutText: {
        ...Theme.typography.h4,
        color: Theme.colors.danger.default,
    },
    version: {
        ...Theme.typography.caption,
        textAlign: 'center',
        marginBottom: Theme.spacing.xl,
    }
});
