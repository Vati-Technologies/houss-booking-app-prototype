import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Header } from '../../../components/ui/Header';
import { Theme } from '../../../constants/Theme';
import { AMENITIES } from '../../../data/amenities';

type NoiseLevel = 'Low' | 'Medium' | 'High';

export default function BookGuestsScreen() {
    const { id, date, slot } = useLocalSearchParams();
    const router = useRouter();

    const amenity = AMENITIES.find(a => a.id === id);
    const maxCapacity = amenity ? Math.min(amenity.capacity, 50) : 10;

    const [guests, setGuests] = useState(1);
    const [noise, setNoise] = useState<NoiseLevel>('Low');
    const [music, setMusic] = useState(false);

    const increment = () => setGuests(prev => Math.min(prev + 1, maxCapacity + 5)); // Allow going slightly over to show validation
    const decrement = () => setGuests(prev => Math.max(prev - 1, 1));

    const isOverCapacity = guests > maxCapacity;
    const isHighNoise = noise === 'High';

    return (
        <View style={styles.container}>
            <Header title="Requirements" showBack={true} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Guest Selection */}
                <Card style={[styles.section, isOverCapacity && styles.sectionWarning]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Number of Guests</Text>
                        <Text style={styles.sectionSubtitle}>Includes you and your visitors</Text>
                    </View>

                    <View style={styles.stepperContainer}>
                        <TouchableOpacity
                            style={[styles.stepperButton, guests <= 1 && styles.stepperDisabled]}
                            onPress={decrement}
                            disabled={guests <= 1}
                        >
                            <Feather name="minus" size={20} color={guests <= 1 ? Theme.colors.text.muted : Theme.colors.text.primary} />
                        </TouchableOpacity>

                        <View style={styles.stepperCenter}>
                            <Text style={styles.stepperValue}>{guests}</Text>
                        </View>

                        <TouchableOpacity style={styles.stepperButton} onPress={increment}>
                            <Feather name="plus" size={20} color={Theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    {isOverCapacity && (
                        <View style={styles.inlineWarning}>
                            <Feather name="alert-circle" size={16} color={Theme.colors.danger.default} />
                            <Text style={styles.inlineWarningText}>Exceeds max capacity of {maxCapacity}</Text>
                        </View>
                    )}
                </Card>

                {/* Noise Declaration */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Noise Declaration</Text>
                        <Text style={styles.sectionSubtitle}>Honest estimation helps avoid fines</Text>
                    </View>

                    <View style={styles.segmentedControl}>
                        {(['Low', 'Medium', 'High'] as NoiseLevel[]).map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.segment,
                                    noise === level && styles.segmentActive,
                                    noise === 'High' && level === 'High' && { backgroundColor: '#FEF2F2' }
                                ]}
                                onPress={() => setNoise(level)}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        noise === level && styles.segmentTextActive,
                                        noise === 'High' && level === 'High' && { color: Theme.colors.danger.default }
                                    ]}
                                >
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {isHighNoise && (
                        <View style={[styles.inlineWarning, { backgroundColor: '#FFFBEB', marginTop: Theme.spacing.md }]}>
                            <Feather name="alert-triangle" size={16} color="#D97706" />
                            <Text style={[styles.inlineWarningText, { color: '#B45309' }]}>High noise may reduce approval chances after 10PM.</Text>
                        </View>
                    )}
                </Card>

                {/* Smart Booking Check */}
                <View style={[styles.aiPanel, isOverCapacity && styles.aiPanelError]}>
                    <View style={styles.aiHeader}>
                        <View style={styles.aiIconBox}>
                            <Feather name="shield" size={16} color={Theme.colors.primary.default} />
                        </View>
                        <Text style={styles.aiTitle}>Smart Booking Check</Text>
                    </View>
                    <View style={styles.aiCheckList}>
                        <View style={styles.aiCheckItem}>
                            <Feather
                                name={isOverCapacity ? "x-circle" : "check"}
                                size={18}
                                color={isOverCapacity ? Theme.colors.danger.default : Theme.colors.primary.default}
                            />
                            <Text style={[styles.aiCheckText, isOverCapacity && { color: Theme.colors.danger.default }]}>
                                {isOverCapacity ? `Guest count exceeds capacity (${maxCapacity} max)` : 'Guest count within capacity'}
                            </Text>
                        </View>
                        <View style={styles.aiCheckItem}>
                            <Feather name="check" size={18} color={Theme.colors.primary.default} />
                            <Text style={styles.aiCheckText}>No schedule conflicts</Text>
                        </View>
                        <View style={styles.aiCheckItem}>
                            <Feather name="check" size={18} color={Theme.colors.primary.default} />
                            <Text style={styles.aiCheckText}>Within allowed duration</Text>
                        </View>
                        {isHighNoise ? (
                            <View style={[styles.aiCheckItem, { backgroundColor: '#FFFBEB' }]}>
                                <Feather name="alert-triangle" size={18} color="#D97706" />
                                <Text style={[styles.aiCheckText, { color: '#B45309' }]}>
                                    High noise after 11PM may require admin review.
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.stickyFooter}>
                <Button
                    title="Review Booking"
                    disabled={isOverCapacity}
                    style={(!isOverCapacity) ? { elevation: 4, shadowColor: Theme.colors.primary.default, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}}
                    onPress={() => router.push(`/amenities/book/summary?id=${id}&date=${date}&slot=${slot}&guests=${guests}&noise=${noise}&music=${music}`)}
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
    section: {
        marginBottom: Theme.spacing.xl,
        padding: Theme.spacing.lg,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
    },
    sectionWarning: {
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    sectionHeader: {
        marginBottom: Theme.spacing.lg,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Theme.colors.text.secondary,
        fontWeight: '500',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: Theme.radius.full,
        padding: 4,
        marginBottom: 8,
    },
    stepperButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...Theme.shadows.soft,
        shadowOpacity: 0.05,
    },
    stepperDisabled: {
        opacity: 0.5,
        elevation: 0,
        backgroundColor: 'transparent',
    },
    stepperCenter: {
        flex: 1,
        alignItems: 'center',
    },
    stepperValue: {
        fontSize: 28,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    inlineWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: Theme.radius.lg,
        marginTop: Theme.spacing.sm,
    },
    inlineWarningText: {
        fontSize: 13,
        fontWeight: '600',
        color: Theme.colors.danger.default,
        marginLeft: 8,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: Theme.radius.lg,
        padding: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: Theme.radius.md,
    },
    segmentActive: {
        backgroundColor: '#FFFFFF',
        ...Theme.shadows.soft,
        shadowOpacity: 0.08,
    },
    segmentText: {
        fontSize: 15,
        fontWeight: '600',
        color: Theme.colors.text.secondary,
    },
    segmentTextActive: {
        color: Theme.colors.text.primary,
    },
    aiPanel: {
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.xl,
        padding: Theme.spacing.xl,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Theme.shadows.soft,
    },
    aiPanelError: {
        borderColor: '#FECACA',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Theme.spacing.lg,
    },
    aiIconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    aiTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
    },
    aiCheckList: {
        gap: 12,
    },
    aiCheckItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: Theme.radius.md,
    },
    aiCheckText: {
        fontSize: 14,
        fontWeight: '500',
        color: Theme.colors.text.primary,
        marginLeft: 10,
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
