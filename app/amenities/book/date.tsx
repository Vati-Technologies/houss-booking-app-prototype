import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Header } from '../../../components/ui/Header';
import { Theme } from '../../../constants/Theme';
import { AMENITIES } from '../../../data/amenities';

export default function BookDateScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState('');

    const amenity = AMENITIES.find(a => a.id === id);
    const today = new Date().toISOString().split('T')[0];

    // Generate deterministic mock availability data for dates
    const markedDatesData = useMemo(() => {
        const marks: any = {};
        const now = new Date();
        for (let i = 0; i < 60; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() + i);
            const dString = d.toISOString().split('T')[0];

            // Simple hash to vary the status consistently per date
            const hash = dString.split('-').reduce((sum, part) => sum + parseInt(part), 0);
            let status = 'low';
            if (hash % 5 === 0) status = 'full';
            else if (hash % 2 === 0) status = 'moderate';

            let dotColor = '#34D399'; // Light green (low traffic)
            let disabled = false;

            if (status === 'full') {
                dotColor = '#EF4444'; // Red
                disabled = true;
            } else if (status === 'moderate') {
                dotColor = '#FBBF24'; // Yellow
            }

            marks[dString] = {
                marked: true,
                dotColor,
                disableTouchEvent: disabled,
            };
        }

        if (selectedDate) {
            marks[selectedDate] = {
                ...marks[selectedDate],
                selected: true,
                selectedColor: Theme.colors.primary.default,
                customStyles: {
                    container: {
                        backgroundColor: Theme.colors.primary.default,
                        elevation: 4,
                        shadowColor: Theme.colors.primary.default,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                    },
                    text: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            };
        }

        return marks;
    }, [selectedDate]);

    // Simulated available slots count based on the selected date
    const getAvailableSlotsCount = (dateStr: string) => {
        const hash = dateStr.split('-').reduce((sum, part) => sum + parseInt(part), 0);
        if (hash % 5 === 0) return 0;
        if (hash % 2 === 0) return 2;
        return 5;
    };

    const slotsAvailable = selectedDate ? getAvailableSlotsCount(selectedDate) : 0;

    return (
        <View style={styles.container}>
            <Header title="Select Date" showBack={true} />

            <View style={styles.calendarContainer}>
                {/* Legend */}
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#34D399' }]} />
                        <Text style={styles.legendText}>Available</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
                        <Text style={styles.legendText}>Moderate</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.legendText}>Full</Text>
                    </View>
                </View>

                <Calendar
                    current={today}
                    minDate={today}
                    onDayPress={(day: any) => setSelectedDate(day.dateString)}
                    markedDates={markedDatesData}
                    markingType={'custom'}
                    theme={{
                        backgroundColor: Theme.colors.background.app,
                        calendarBackground: '#FFFFFF',
                        textSectionTitleColor: Theme.colors.text.secondary,
                        selectedDayBackgroundColor: Theme.colors.primary.default,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: Theme.colors.primary.default,
                        dayTextColor: Theme.colors.text.primary,
                        textDisabledColor: Theme.colors.text.muted,
                        arrowColor: Theme.colors.text.primary,
                        monthTextColor: Theme.colors.text.primary,
                        textDayFontWeight: '500',
                        textMonthFontWeight: '700',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 14,
                        'stylesheet.calendar.header': {
                            header: {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 10,
                                paddingRight: 10,
                                marginTop: 6,
                                alignItems: 'center',
                                marginBottom: 16
                            }
                        }
                    }}
                    style={styles.calendar}
                />
            </View>

            {selectedDate ? (
                <View style={styles.summaryContainer}>
                    <Card style={styles.summaryCard} noPadding>
                        <View style={styles.summaryInner}>
                            <View style={styles.summaryIconBox}>
                                <Feather name="calendar" size={24} color={Theme.colors.primary.default} />
                            </View>
                            <View style={styles.summaryTextGroup}>
                                <Text style={styles.summaryTitle}>
                                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </Text>
                                <Text style={styles.summarySubtitle}>
                                    {slotsAvailable} time slots available
                                </Text>
                            </View>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryFooter}>
                            {markedDatesData[selectedDate]?.dotColor === '#EF4444' || markedDatesData[selectedDate]?.dotColor === '#FBBF24' ? (
                                <>
                                    <Feather name="trending-up" size={14} color="#D97706" />
                                    <Text style={[styles.summaryFooterText, { color: '#D97706', fontWeight: '500' }]}>
                                        High demand expected this {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Feather name="check-circle" size={14} color="#10B981" />
                                    <Text style={[styles.summaryFooterText, { color: '#10B981', fontWeight: '500' }]}>
                                        Good availability expected
                                    </Text>
                                </>
                            )}
                        </View>
                    </Card>
                </View>
            ) : null}

            <View style={styles.stickyFooter}>
                <Button
                    title="Continue to Time Slots"
                    disabled={!selectedDate || slotsAvailable === 0}
                    style={selectedDate && slotsAvailable > 0 ? { elevation: 4, shadowColor: Theme.colors.primary.default, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}}
                    onPress={() => router.push(`/amenities/book/slot?id=${id}&date=${selectedDate}`)}
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
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Theme.spacing.md,
        gap: Theme.spacing.lg,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 13,
        fontWeight: '500',
        color: Theme.colors.text.secondary,
    },
    calendarContainer: {
        padding: Theme.spacing.md,
    },
    calendar: {
        borderRadius: Theme.radius.xl,
        padding: Theme.spacing.md,
        ...Theme.shadows.card,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    summaryContainer: {
        padding: Theme.spacing.md,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    summaryInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.lg,
    },
    summaryIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.md,
    },
    summaryTextGroup: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginBottom: 4,
    },
    summarySubtitle: {
        fontSize: 14,
        color: Theme.colors.text.secondary,
        fontWeight: '500',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    summaryFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        paddingHorizontal: Theme.spacing.lg,
        backgroundColor: '#F8FAFC',
        borderBottomLeftRadius: Theme.radius.lg,
        borderBottomRightRadius: Theme.radius.lg,
    },
    summaryFooterText: {
        fontSize: 13,
        color: Theme.colors.text.secondary,
        marginLeft: 6,
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
    }
});
