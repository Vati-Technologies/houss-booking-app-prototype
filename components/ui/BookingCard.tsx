import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Theme } from '../../constants/Theme';
import { Amenity, Booking, BookingStatus } from '../../data/types';
import { Button } from './Button';

interface BookingCardProps {
    booking: Booking;
    amenity: Amenity;
}

const getStatusColor = (status: BookingStatus, reviewed?: boolean) => {
    switch (status) {
        case 'Confirmed': return { bg: '#E7F8F0', text: '#1F7A5A', bar: '#1F7A5A' };
        case 'Pending': return { bg: '#FFFBEB', text: '#B45309', bar: '#F5A623' };
        case 'Cancelled': return { bg: '#FFE4E2', text: '#F04438', bar: '#F04438' };
        case 'Completed':
            if (reviewed === false) return { bg: '#FFF4E5', text: '#B8860B', bar: '#F5A623' }; // Muted amber for Needs Review
            if (reviewed === true) return { bg: '#E7F8F0', text: '#1F7A5A', bar: '#1F7A5A' }; // Green for Reviewed
            return { bg: '#EEF2F7', text: '#64748B', bar: '#64748B' }; // Default completed
    }
};

const getTimeRelevance = (dateStr: string, status: BookingStatus) => {
    if (status === 'Completed') return 'Ended';
    if (status === 'Cancelled') return 'Cancelled';

    // Naive mock time relevance logic
    const bookingDate = new Date(dateStr);
    const now = new Date('2026-10-18'); // using a mock current date to match the mock data range
    const diffTime = bookingDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Happening Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `Starts in ${diffDays} days`;
    if (diffDays < 0) return `Ended ${Math.abs(diffDays)} days ago`;
    return '';
};

export const BookingCard = ({ booking, amenity }: BookingCardProps) => {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const progress = useSharedValue(0);

    const toggleExpand = () => {
        setExpanded(!expanded);
        progress.value = withSpring(expanded ? 0 : 1, { damping: 15, stiffness: 120 });
    };

    const statusColors = getStatusColor(booking.status, booking.reviewed);
    const timeRelevance = getTimeRelevance(booking.date, booking.status);

    const displayStatusLabel = () => {
        if (booking.status === 'Completed') {
            if (booking.reviewed === false) return '🟡 Needs Review';
            if (booking.reviewed === true) return '🟢 Reviewed';
        }
        if (booking.status === 'Pending') return '🟡 Under Review';
        if (booking.status === 'Confirmed') return '🟢 Confirmed';
        return booking.status;
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            maxHeight: interpolate(progress.value, [0, 1], [0, 300]),
            opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]),
            marginTop: interpolate(progress.value, [0, 1], [0, 16]),
        };
    });

    const handleViewDetails = () => {
        router.push(`/booking/${booking.id}` as any);
    };

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand} style={styles.cardContainer}>
            <View style={[styles.indicatorBar, { backgroundColor: statusColors.bar }]} />

            <View style={styles.mainContent}>
                <View style={styles.row}>
                    <Image source={amenity.image} style={styles.image} />
                    <View style={styles.details}>
                        <View style={styles.headerRow}>
                            <Text style={styles.title} numberOfLines={1}>{amenity.name}</Text>
                            <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
                                <Text style={[styles.statusText, { color: statusColors.text }]}>{displayStatusLabel()}</Text>
                            </View>
                        </View>

                        <Text style={styles.dateTime}>
                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {booking.timeSlot}
                        </Text>

                        <View style={styles.infoRow}>
                            <View style={styles.guests}>
                                <Feather name="users" size={14} color={Theme.colors.text.secondary} />
                                <Text style={styles.guestsText}>{booking.guestCount} Guests</Text>
                            </View>
                            <View style={styles.timeTag}>
                                <Feather name="clock" size={12} color={statusColors.text} />
                                <Text style={[styles.timeTagText, { color: statusColors.text }]}>{timeRelevance}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* EXPANDABLE SECTION */}
                <Animated.View style={[styles.expandedContent, animatedStyle]}>
                    <View style={styles.divider} />

                    <View style={styles.expandedStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Booking ID</Text>
                            <Text style={styles.statValue}>#{booking.id.toUpperCase()}-2026</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Noise Level</Text>
                            <Text style={styles.statValue}>{booking.noiseLevel}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Guest List</Text>
                            <Text style={styles.statValue}>{booking.guestNames ? `${booking.guestNames.length} Registered` : 'Not provided'}</Text>
                        </View>
                    </View>

                    <View style={styles.qrPlaceholder}>
                        <Feather name="maximize" size={20} color={Theme.colors.text.muted} style={{ marginBottom: 4 }} />
                        <Text style={styles.qrText}>Tap to View Access QR</Text>
                    </View>

                    {/* ACTION BUTTONS */}
                    <View style={styles.actionButtons}>
                        {booking.status === 'Confirmed' && (
                            <>
                                <View style={styles.btnWrapper}><Button title="View Details" variant="outline" onPress={handleViewDetails} /></View>
                                <View style={styles.btnWrapper}><Button title="Cancel" variant="outline" onPress={() => { }} style={{ borderColor: Theme.colors.danger.default }} textStyle={{ color: Theme.colors.danger.default }} /></View>
                            </>
                        )}
                        {booking.status === 'Pending' && (
                            <>
                                <View style={styles.btnWrapper}><Button title="Edit Booking" variant="primary" onPress={() => { }} /></View>
                                <View style={styles.btnWrapper}><Button title="Cancel" variant="outline" onPress={() => { }} /></View>
                            </>
                        )}
                        {booking.status === 'Completed' && (
                            <>
                                {(!booking.reviewed || booking.reviewed === undefined) && (
                                    <View style={styles.btnWrapper}><Button title="Rate Amenity" variant="primary" onPress={() => router.push(`/booking/feedback/${booking.id}` as any)} /></View>
                                )}
                                {booking.reviewed && (
                                    <View style={styles.btnWrapper}><Button title="Edit Feedback" variant="outline" onPress={() => router.push(`/booking/feedback/${booking.id}` as any)} /></View>
                                )}
                                <View style={styles.btnWrapper}><Button title="View Summary" variant={(!booking.reviewed || booking.reviewed === undefined) ? "outline" : "primary"} onPress={handleViewDetails} /></View>
                            </>
                        )}
                        {booking.status === 'Cancelled' && (
                            <>
                                <View style={styles.btnWrapper}><Button title="Rebook" variant="primary" onPress={() => { }} /></View>
                            </>
                        )}
                    </View>
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        ...Theme.shadows.soft,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    indicatorBar: {
        width: 6,
        height: '100%',
    },
    mainContent: {
        flex: 1,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
    },
    image: {
        width: 72,
        height: 72,
        borderRadius: 16,
        backgroundColor: Theme.colors.background.app,
    },
    details: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        ...Theme.typography.h4,
        fontSize: 17,
        flex: 1,
        marginRight: 8,
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateTime: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    guests: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    guestsText: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
        marginLeft: 6,
        fontWeight: '500',
    },
    timeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    timeTagText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
    },
    expandedContent: {
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: Theme.colors.border,
        marginVertical: 16,
    },
    expandedStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: Theme.colors.text.muted,
        marginBottom: 4,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 14,
        color: Theme.colors.text.primary,
        fontWeight: '600',
    },
    qrPlaceholder: {
        backgroundColor: Theme.colors.background.app,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    qrText: {
        fontSize: 12,
        color: Theme.colors.text.muted,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    btnWrapper: {
        flex: 1,
    }
});
