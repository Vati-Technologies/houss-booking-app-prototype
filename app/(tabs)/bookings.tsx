import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingCard } from '../../components/ui/BookingCard';
import { Header } from '../../components/ui/Header';
import { Theme } from '../../constants/Theme';
import { AMENITIES } from '../../data/amenities';
import { BOOKINGS } from '../../data/bookings';

const { width } = Dimensions.get('window');

export default function BookingsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'History'>('Upcoming');
    const indicatorPosition = useSharedValue(0);

    const handleTabPress = (tab: 'Upcoming' | 'History', index: number) => {
        setActiveTab(tab);
        indicatorPosition.value = withSpring(index * ((width - 32 - 8) / 2), { damping: 20, stiffness: 200 });
    };

    const animatedIndicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: indicatorPosition.value }],
        };
    });

    const filteredBookings = BOOKINGS.filter(b =>
        activeTab === 'Upcoming'
            ? b.status === 'Confirmed' || b.status === 'Pending'
            : b.status === 'Completed' || b.status === 'Cancelled'
    );

    return (
        <View style={styles.container}>
            <Header title="My Bookings" showBack={false} />

            <View style={styles.segmentedControl}>
                <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
                <TouchableOpacity
                    style={styles.segment}
                    onPress={() => handleTabPress('Upcoming', 0)}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.segmentText, activeTab === 'Upcoming' && styles.segmentTextActive]}>
                        Upcoming
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.segment}
                    onPress={() => handleTabPress('History', 1)}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.segmentText, activeTab === 'History' && styles.segmentTextActive]}>
                        History
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {filteredBookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} bookings</Text>
                    </View>
                ) : (
                    filteredBookings.map(booking => {
                        const amenity = AMENITIES.find(a => a.id === booking.amenityId);
                        if (!amenity) return null;

                        return <BookingCard key={booking.id} booking={booking} amenity={amenity} />;
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA', // Matching the requested background
    },
    segmentedControl: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        width: (width - 32 - 8) / 2, // Half width minus padding
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        top: 4,
        left: 4,
        ...Theme.shadows.soft,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    segment: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    segmentText: {
        fontSize: 15,
        fontWeight: '500',
        color: Theme.colors.text.secondary,
    },
    segmentTextActive: {
        color: Theme.colors.text.primary,
        fontWeight: '700',
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        marginTop: 60,
        alignItems: 'center',
    },
    emptyStateText: {
        ...Theme.typography.bodyLg,
        color: Theme.colors.text.muted,
        marginTop: 16,
    },
});
