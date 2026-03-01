import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Header } from '../../../components/ui/Header';
import { Theme } from '../../../constants/Theme';

const SLOT_SECTIONS = [
    {
        title: 'Morning',
        slots: [
            { id: 's1', time: '08:00 - 10:00', status: 'Booked', type: 'normal' },
            { id: 's2', time: '10:00 - 12:00', status: 'Available', type: 'normal' }
        ]
    },
    {
        title: 'Afternoon',
        slots: [
            { id: 's3', time: '12:00 - 14:00', status: 'Available', type: 'normal' },
            { id: 's4', time: '14:00 - 16:00', status: 'Available', type: 'peak' },
            { id: 's5', time: '16:00 - 18:00', status: 'Booked', type: 'peak' },
        ]
    },
    {
        title: 'Evening',
        slots: [
            { id: 's6', time: '18:00 - 20:00', status: 'Available', type: 'peak' },
            { id: 's7', time: '20:00 - 22:00', status: 'Available', type: 'quiet' },
            { id: 's8', time: '22:00 - 00:00', status: 'Available', type: 'quiet' },
        ]
    }
];

export default function BookSlotScreen() {
    const { id, date } = useLocalSearchParams();
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState('');

    const displayDate = date ? new Date(date as string).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '';

    return (
        <View style={styles.container}>
            <Header title="Select Time" showBack={true} />

            <View style={styles.dateHeader}>
                <View style={styles.dateIconWrapper}>
                    <Feather name="calendar" size={20} color={Theme.colors.primary.default} />
                </View>
                <View>
                    <Text style={styles.dateLabel}>Booking for</Text>
                    <Text style={styles.dateText}>{displayDate}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {SLOT_SECTIONS.map(section => (
                    <View key={section.title} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.slotsGrid}>
                            {section.slots.map(slot => {
                                const isSelected = selectedSlot === slot.time;
                                const isBooked = slot.status === 'Booked';
                                return (
                                    <TouchableOpacity
                                        key={slot.id}
                                        activeOpacity={isBooked ? 1 : 0.7}
                                        onPress={() => !isBooked && setSelectedSlot(slot.time)}
                                        style={[
                                            styles.slotCard,
                                            isSelected && styles.slotSelected,
                                            isBooked && styles.slotBooked,
                                            slot.type === 'peak' && !isSelected && !isBooked && styles.slotPeak,
                                        ]}
                                    >
                                        <View style={styles.slotHeader}>
                                            <Text
                                                style={[
                                                    styles.timeText,
                                                    isSelected && styles.textSelected,
                                                    isBooked && styles.textBooked,
                                                ]}
                                            >
                                                {slot.time}
                                            </Text>
                                            {isSelected && (
                                                <Feather name="check-circle" size={16} color="#FFFFFF" />
                                            )}
                                        </View>
                                        <View style={styles.slotFooter}>
                                            {isBooked ? (
                                                <Text style={[styles.statusText, styles.textBooked]}>Booked</Text>
                                            ) : slot.type === 'peak' ? (
                                                <View style={styles.pillContainer}>
                                                    <Feather name="trending-up" size={12} color={isSelected ? '#D1FAE5' : '#D97706'} />
                                                    <Text style={[styles.pillText, isSelected ? { color: '#D1FAE5' } : { color: '#D97706' }]}>Peak Time</Text>
                                                </View>
                                            ) : slot.type === 'quiet' ? (
                                                <View style={styles.pillContainer}>
                                                    <Feather name="moon" size={12} color={isSelected ? '#E0E7FF' : '#4F46E5'} />
                                                    <Text style={[styles.pillText, isSelected ? { color: '#E0E7FF' } : { color: '#4F46E5' }]}>Quiet Hours</Text>
                                                </View>
                                            ) : (
                                                <Text style={[styles.statusText, isSelected && { color: '#D1FAE5' }]}>Available</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {selectedSlot !== '' && (
                <View style={styles.advisoryContainer}>
                    {(() => {
                        let slotType = 'normal';
                        for (const sec of SLOT_SECTIONS) {
                            const found = sec.slots.find(s => s.time === selectedSlot);
                            if (found) {
                                slotType = found.type;
                                break;
                            }
                        }

                        if (slotType === 'peak') {
                            return (
                                <View style={[styles.advisoryCard, styles.advisoryPeak]}>
                                    <Feather name="trending-up" size={16} color="#D97706" />
                                    <View style={styles.advisoryTextContainer}>
                                        <Text style={[styles.advisoryText, { color: '#B45309' }]}>Peak Time</Text>
                                    </View>
                                </View>
                            );
                        } else if (slotType === 'quiet') {
                            return (
                                <View style={[styles.advisoryCard, styles.advisoryQuiet]}>
                                    <Feather name="moon" size={16} color="#4338CA" />
                                    <View style={styles.advisoryTextContainer}>
                                        <Text style={[styles.advisoryText, { color: '#3730A3' }]}>Quiet hours begin at 11PM.</Text>
                                    </View>
                                </View>
                            );
                        } else {
                            return (
                                <View style={[styles.advisoryCard, styles.advisoryInfo]}>
                                    <Feather name="users" size={16} color="#0369A1" />
                                    <View style={styles.advisoryTextContainer}>
                                        <Text style={[styles.advisoryText, { color: '#075985' }]}>Large groups frequently book this time.</Text>
                                    </View>
                                </View>
                            );
                        }
                    })()}
                </View>
            )}

            <View style={styles.stickyFooter}>
                <Button
                    title="Continue to Requirements"
                    disabled={!selectedSlot}
                    style={selectedSlot ? { elevation: 4, shadowColor: Theme.colors.primary.default, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}}
                    onPress={() => router.push(`/amenities/book/guests?id=${id}&date=${date}&slot=${selectedSlot}`)}
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
    dateHeader: {
        padding: Theme.spacing.lg,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.md,
    },
    dateLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: Theme.colors.text.secondary,
        marginBottom: 2,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    list: {
        padding: Theme.spacing.md,
    },
    sectionContainer: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginBottom: Theme.spacing.md,
        paddingHorizontal: Theme.spacing.sm,
    },
    slotsGrid: {
        flexDirection: 'column',
    },
    slotCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.lg,
        padding: Theme.spacing.md,
        marginBottom: Theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        height: 76,
        justifyContent: 'space-between',
        ...Theme.shadows.soft,
    },
    slotPeak: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
    },
    slotSelected: {
        backgroundColor: Theme.colors.primary.default,
        borderColor: Theme.colors.primary.default,
        transform: [{ scale: 1.02 }],
        zIndex: 10,
        ...Theme.shadows.card,
    },
    slotBooked: {
        backgroundColor: '#F1F5F9',
        borderColor: '#E2E8F0',
        opacity: 0.6,
        elevation: 0,
        shadowOpacity: 0,
    },
    slotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slotFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
        color: Theme.colors.text.secondary,
        marginTop: 4,
    },
    textSelected: {
        color: '#FFFFFF',
    },
    textBooked: {
        color: Theme.colors.text.muted,
        textDecorationLine: 'line-through',
    },
    pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Theme.spacing.lg,
        paddingBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    advisoryContainer: {
        position: 'absolute',
        bottom: 110,
        left: Theme.spacing.lg,
        right: Theme.spacing.lg,
        zIndex: 5,
    },
    advisoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        ...Theme.shadows.soft,
    },
    advisoryPeak: {
        backgroundColor: '#FEF3C7',
        borderColor: '#FDE68A',
    },
    advisoryQuiet: {
        backgroundColor: '#E0E7FF',
        borderColor: '#C7D2FE',
    },
    advisoryInfo: {
        backgroundColor: '#E0F2FE',
        borderColor: '#BAE6FD',
    },
    advisoryTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    advisoryText: {
        fontSize: 14,
        fontWeight: '600',
    }
});
