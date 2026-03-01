import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Header } from '../../../components/ui/Header';
import { Theme } from '../../../constants/Theme';
import { AMENITIES } from '../../../data/amenities';

export default function BookSummaryScreen() {
    const { id, date, slot, guests, noise, music } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const amenity = AMENITIES.find(a => a.id === id);
    if (!amenity) return null;

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(`/amenities/book/success?id=${id}&date=${date}&slot=${slot}&noise=${noise}&guests=${guests}`);
        }, 1200);
    };

    const displayDate = date ? new Date(date as string).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '';

    return (
        <View style={styles.container}>
            <Header title="Review Booking" showBack={true} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.headerBlock}>
                    <Text style={styles.amenityName}>{amenity.name}</Text>
                    <Text style={styles.subtext}>Please review your request before confirming.</Text>
                </View>

                {/* Main Details Card */}
                <View style={styles.card}>
                    <View style={styles.detailRow}>
                        <View style={styles.iconBox}>
                            <Feather name="calendar" size={20} color={Theme.colors.primary.default} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Date</Text>
                            <Text style={styles.detailValue}>{displayDate}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.iconBox}>
                            <Feather name="clock" size={20} color={Theme.colors.primary.default} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Time Slot</Text>
                            <Text style={styles.detailValue}>{slot}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.iconBox}>
                            <Feather name="users" size={20} color={Theme.colors.primary.default} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Guests Expected</Text>
                            <Text style={styles.detailValue}>{guests} People</Text>
                        </View>
                    </View>
                </View>

                {/* Declarations Card */}
                <View style={styles.card}>
                    <View style={styles.declarationRow}>
                        <Text style={styles.declarationLabel}>Noise Level Declaration</Text>
                        <Text style={[styles.declarationValue, noise === 'High' && { color: Theme.colors.warning.default }]}>{noise}</Text>
                    </View>
                    <View style={[styles.declarationRow, { marginTop: Theme.spacing.md }]}>
                        <Text style={styles.declarationLabel}>Subject to House Rules</Text>
                        <Text style={styles.declarationValue}>Agreed</Text>
                    </View>
                </View>

                {/* Policy Notice */}
                <View style={styles.policyNotice}>
                    <Feather name="info" size={16} color={Theme.colors.text.secondary} />
                    <Text style={styles.policyText}>
                        Cancellations must be made at least 2 hours before the booking start time to avoid penalty charges.
                    </Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.stickyFooter}>
                <Button
                    title="Confirm & Book"
                    onPress={handleConfirm}
                    loading={loading}
                    style={{ elevation: 4, shadowColor: Theme.colors.primary.default, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
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
        padding: Theme.spacing.lg,
    },
    headerBlock: {
        marginBottom: Theme.spacing.lg,
        paddingHorizontal: Theme.spacing.xs,
    },
    amenityName: {
        fontSize: 28,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginBottom: 4,
    },
    subtext: {
        fontSize: 15,
        color: Theme.colors.text.secondary,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.xl,
        padding: Theme.spacing.lg,
        marginBottom: Theme.spacing.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Theme.shadows.soft,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.md,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 13,
        color: Theme.colors.text.secondary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: Theme.spacing.md,
        marginLeft: 60, // align with text
    },
    declarationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    declarationLabel: {
        fontSize: 14,
        color: Theme.colors.text.secondary,
        fontWeight: '500',
    },
    declarationValue: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    policyNotice: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.lg,
        marginTop: Theme.spacing.sm,
        alignItems: 'center',
    },
    policyText: {
        flex: 1,
        fontSize: 13,
        color: Theme.colors.text.secondary,
        marginLeft: Theme.spacing.sm,
        lineHeight: 18,
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Theme.spacing.lg,
        paddingBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    }
});
