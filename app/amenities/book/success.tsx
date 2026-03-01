import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Theme } from '../../../constants/Theme';
import { AMENITIES } from '../../../data/amenities';

export default function BookSuccessScreen() {
    const { id, date, slot, noise } = useLocalSearchParams();
    const router = useRouter();

    const isRisky = noise === 'High';

    const amenity = AMENITIES.find(a => a.id === id);

    // Simple scale animation for the success icon
    const scaleAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    const displayDate = date ? new Date(date as string).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <Feather name="check" size={48} color="#FFFFFF" />
                </Animated.View>

                <Text style={styles.title}>Booking Confirmed</Text>
                <Text style={styles.subtitle}>Your access is granted.</Text>

                {/* Simulated QR Code Area */}
                <View style={styles.passCard}>
                    <View style={styles.passHeader}>
                        <Text style={styles.passAmenity}>{amenity?.name}</Text>
                        <Text style={styles.passDate}>{displayDate} • {slot}</Text>
                    </View>

                    <View style={styles.qrPlaceholder}>
                        <Feather name="grid" size={100} color={Theme.colors.primary.default} style={{ opacity: 0.8 }} />
                        <Text style={styles.qrText}>Present to concierge or scanner</Text>
                    </View>

                    <View style={styles.referenceContainer}>
                        <Text style={styles.referenceLabel}>Reference</Text>
                        <Text style={styles.referenceValue}>#EST-8492-MK</Text>
                    </View>

                    <View style={[styles.aiStatusTag, isRisky ? styles.aiStatusWarning : styles.aiStatusApproved]}>
                        <Feather name={isRisky ? "clock" : "shield"} size={14} color={isRisky ? "#D97706" : "#059669"} style={{ marginRight: 6 }} />
                        <Text style={[styles.aiStatusText, isRisky ? { color: '#B45309' } : { color: '#047857' }]}>
                            {isRisky ? 'Pending review due to noise selection' : 'Auto-approved by Smart Review'}
                        </Text>
                    </View>
                </View>

            </View>

            <View style={styles.footer}>
                <View style={styles.actionRow}>
                    <View style={styles.actionButton}>
                        <Feather name="calendar" size={20} color={Theme.colors.text.primary} />
                        <Text style={styles.actionText}>Add to Calendar</Text>
                    </View>
                    <View style={styles.actionButton}>
                        <Feather name="share" size={20} color={Theme.colors.text.primary} />
                        <Text style={styles.actionText}>Share with Guests</Text>
                    </View>
                </View>

                <Button
                    title="View in Bookings"
                    onPress={() => router.replace('/(tabs)/bookings')}
                    style={{ marginBottom: Theme.spacing.md }}
                />
                <Button
                    title="Return Home"
                    variant="outline"
                    onPress={() => router.replace('/(tabs)')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: Theme.spacing.xl,
        justifyContent: 'center',
        marginTop: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.colors.primary.default,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.lg,
        ...Theme.shadows.card,
        shadowColor: Theme.colors.primary.default,
        shadowOpacity: 0.4,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.text.secondary,
        marginBottom: 32,
    },
    passCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: Theme.radius.xl,
        overflow: 'hidden',
        ...Theme.shadows.card,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    passHeader: {
        backgroundColor: Theme.colors.primary.default,
        padding: Theme.spacing.lg,
        alignItems: 'center',
    },
    passAmenity: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    passDate: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    qrPlaceholder: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E2E8F0',
    },
    qrText: {
        fontSize: 13,
        color: Theme.colors.text.secondary,
        marginTop: Theme.spacing.lg,
    },
    referenceContainer: {
        padding: Theme.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    referenceLabel: {
        fontSize: 13,
        color: Theme.colors.text.secondary,
    },
    referenceValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        letterSpacing: 1,
    },
    aiStatusTag: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        backgroundColor: '#F8FAFC',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        justifyContent: 'center',
    },
    aiStatusApproved: {
        backgroundColor: '#ECFDF5',
    },
    aiStatusWarning: {
        backgroundColor: '#FFFBEB',
    },
    aiStatusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Theme.spacing.xl,
        paddingHorizontal: Theme.spacing.md,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Theme.spacing.sm,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: Theme.colors.text.primary,
        marginTop: 6,
    },
    footer: {
        padding: Theme.spacing.lg,
        paddingBottom: 40,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: Theme.radius.xl,
        borderTopRightRadius: Theme.radius.xl,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    }
});
