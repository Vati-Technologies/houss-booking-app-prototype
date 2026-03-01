import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/Theme';
import { AMENITIES } from '../../data/amenities';
import { BOOKINGS } from '../../data/bookings';
import { BookingStatus } from '../../data/types';

const { width } = Dimensions.get('window');

const getStatusColor = (status: BookingStatus) => {
    switch (status) {
        case 'Confirmed': return { bg: '#E7F8F0', text: '#10B981' };
        case 'Pending': return { bg: '#E9E7FF', text: '#6D5EF6' };
        case 'Cancelled': return { bg: '#FFE4E2', text: '#F04438' };
        case 'Completed': return { bg: '#F1F5F9', text: '#64748B' };
    }
};

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const booking = BOOKINGS.find(b => b.id === id);
    if (!booking) {
        return (
            <View style={styles.errorContainer}>
                <Text>Booking not found</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const amenity = AMENITIES.find(a => a.id === booking.amenityId);
    if (!amenity) return null;

    const statusColors = getStatusColor(booking.status);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Dark Premium Background */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Ticket</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Feather name="share-2" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* TICKET CONTAINER */}
                <View style={styles.ticketContainer}>

                    {/* TOP TICKET SECTION */}
                    <View style={styles.ticketTop}>
                        {/* Amenity Header */}
                        <View style={styles.ticketHeaderRow}>
                            <View style={styles.amenityBrand}>
                                <Image source={amenity.image} style={styles.amenityThumb} />
                                <View>
                                    <Text style={styles.brandLabel}>Amenity</Text>
                                    <Text style={styles.brandName}>{amenity.name}</Text>
                                </View>
                            </View>
                            <View style={styles.statusBadge}>
                                <View style={[styles.statusDot, { backgroundColor: statusColors.text }]} />
                                <Text style={[styles.statusText, { color: statusColors.text }]}>{booking.status}</Text>
                            </View>
                        </View>

                        {/* Location / ID Row */}
                        <View style={styles.flightPathRow}>
                            <View style={styles.locationBlock}>
                                <Text style={styles.locationCode}>EST</Text>
                                <Text style={styles.locationSub}>EstateLife</Text>
                            </View>

                            <View style={styles.flightPathIndicator}>
                                <View style={styles.flightLine} />
                                <Feather name="anchor" size={16} color={Theme.colors.text.primary} style={styles.flightIcon} />
                            </View>

                            <View style={[styles.locationBlock, { alignItems: 'flex-end' }]}>
                                <Text style={styles.locationCode}>#{booking.id.toUpperCase()}</Text>
                                <Text style={styles.locationSub}>Booking ID</Text>
                            </View>
                        </View>

                        {/* Details Grid */}
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Access Time</Text>
                                <Text style={styles.detailValue}>{booking.timeSlot.split(' - ')[0]}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Floor</Text>
                                <Text style={styles.detailValue}>GF</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Guests</Text>
                                <Text style={styles.detailValue}>{booking.guestCount}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Duration</Text>
                                <Text style={styles.detailValue}>
                                    {booking.timeSlot.split(' - ')[1] ? `${parseInt(booking.timeSlot.split(' - ')[1]) - parseInt(booking.timeSlot.split(' - ')[0])}h` : 'N/A'}
                                </Text>
                            </View>
                        </View>

                        {/* Passenger/Resident Name */}
                        <View style={styles.passengerRow}>
                            <Text style={styles.detailLabel}>Primary Resident</Text>
                            <Text style={styles.passengerName}>Keletso Ntseno</Text>
                        </View>
                    </View>

                    {/* PERFORATION DIVIDER */}
                    <View style={styles.perforationRow}>
                        <View style={styles.circleLeft} />
                        <View style={styles.dashedLine} />
                        <View style={styles.circleRight} />
                    </View>

                    {/* BOTTOM TICKET SECTION (Barcode/QR) */}
                    <View style={styles.ticketBottom}>
                        {booking.status === 'Confirmed' ? (
                            <>
                                <View style={styles.qrHeaderRow}>
                                    <Text style={styles.qrLabel}>Ticket Code:</Text>
                                    <Text style={styles.qrCodeText}>A4DGH68-{booking.id.toUpperCase()}</Text>
                                </View>

                                <View style={styles.barcodeContainer}>
                                    {/* Artificial Barcode using views */}
                                    {Array.from({ length: 45 }).map((_, i) => (
                                        <View key={i} style={[
                                            styles.barcodeLine,
                                            {
                                                width: Math.random() > 0.5 ? 2 : 4,
                                                marginRight: Math.random() > 0.5 ? 2 : 4,
                                                opacity: Math.random() > 0.2 ? 1 : 0
                                            }
                                        ]} />
                                    ))}
                                </View>

                                <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
                                    <Text style={styles.downloadBtnText}>Save Access QR</Text>
                                    <Feather name="download" size={16} color={Theme.colors.text.primary} style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.noAccessContainer}>
                                <Feather name="lock" size={32} color={Theme.colors.text.muted} />
                                <Text style={styles.noAccessText}>Access code unavailable</Text>
                                <Text style={styles.noAccessSub}>Your booking is currently {booking.status.toLowerCase()}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Additional Actions (Cancel/Modify) */}
                {booking.status === 'Confirmed' && (
                    <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8}>
                        <Text style={styles.cancelBtnText}>Modify or Cancel Booking</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Deep dark blue/black
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
    },
    backBtn: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backBtnText: {
        color: '#0F172A',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    scrollContent: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    ticketContainer: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    ticketTop: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    ticketHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    amenityBrand: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amenityThumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    brandLabel: {
        fontSize: 12,
        color: Theme.colors.text.muted,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    brandName: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    flightPathRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    locationBlock: {
        flex: 1,
    },
    locationCode: {
        fontSize: 32,
        fontWeight: '800',
        color: Theme.colors.text.primary,
        letterSpacing: -1,
    },
    locationSub: {
        fontSize: 12,
        color: Theme.colors.text.muted,
        fontWeight: '500',
        marginTop: 2,
    },
    flightPathIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingHorizontal: 10,
    },
    flightLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        top: '50%',
        zIndex: -1,
    },
    flightIcon: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    detailItem: {
        width: '50%',
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: 12,
        color: Theme.colors.text.muted,
        fontWeight: '500',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    passengerRow: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 20,
    },
    passengerName: {
        fontSize: 18,
        fontWeight: '600',
        color: Theme.colors.text.primary,
        marginTop: 4,
    },
    perforationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: 30,
        position: 'relative',
        zIndex: 10,
    },
    circleLeft: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#0F172A',
        position: 'absolute',
        left: -15,
    },
    circleRight: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#0F172A',
        position: 'absolute',
        right: -15,
    },
    dashedLine: {
        flex: 1,
        height: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginHorizontal: 20,
    },
    ticketBottom: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    qrHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    qrLabel: {
        fontSize: 13,
        color: Theme.colors.text.muted,
        fontWeight: '500',
        marginRight: 8,
    },
    qrCodeText: {
        fontSize: 13,
        color: Theme.colors.text.primary,
        fontWeight: '700',
        letterSpacing: 1,
    },
    barcodeContainer: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    barcodeLine: {
        height: '100%',
        backgroundColor: '#0F172A',
    },
    downloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 16,
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    downloadBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: Theme.colors.text.primary,
    },
    noAccessContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    noAccessText: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text.primary,
        marginTop: 12,
        marginBottom: 4,
    },
    noAccessSub: {
        fontSize: 14,
        color: Theme.colors.text.muted,
    },
    cancelBtn: {
        marginTop: 24,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '600',
    }
});

