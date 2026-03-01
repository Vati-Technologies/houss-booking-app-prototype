import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import BottomSheet from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/ui/Header';
import { Theme } from '../../constants/Theme';

const INCIDENT_TYPES = [
    { id: '1', title: 'Medical Emergency', icon: 'heart', color: '#E11D48' },
    { id: '2', title: 'Fight / Altercation', icon: 'shield', color: '#B91C1C' },
    { id: '3', title: 'Uninvited Guest', icon: 'user-x', color: '#EA580C' },
    { id: '4', title: 'Noise Disturbance', icon: 'volume-2', color: '#F59E0B' },
];

const PREVIOUS_INCIDENTS = [
    { id: '101', type: 'Noise Disturbance', date: 'Oct 24, 2023', time: '14:30', location: 'Pool Area', status: 'Resolved' },
    { id: '102', type: 'Uninvited Guest', date: 'Oct 20, 2023', time: '21:15', location: 'Lobby', status: 'Resolved' },
];

const AMENITIES = ['Cinema', 'Clubhouse', 'Pool', 'Common Area', 'My Unit'];

export default function SecurityScreen() {
    // UI State
    const [selectedIncident, setSelectedIncident] = useState<any>(null);
    const [activeAlert, setActiveAlert] = useState<any>(null);
    const [successView, setSuccessView] = useState(false);

    // Form State for Report
    const [selectedLocation, setSelectedLocation] = useState(AMENITIES[0]);
    const [notes, setNotes] = useState('');
    const [shareLocation, setShareLocation] = useState(true);

    // Pulse Animation for Emergency Button
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.03, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedPanicStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
        shadowOpacity: pulseScale.value === 1 ? 0.2 : 0.5,
        shadowRadius: pulseScale.value === 1 ? 8 : 16,
    }));

    const dispatchSecurity = () => {
        setSuccessView(true);
    };

    const confirmSuccessAndClose = () => {
        setActiveAlert({
            ...selectedIncident,
            incidentId: `INC-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Responding',
            team: 'Alpha Unit',
            eta: '2 mins'
        });
        setSuccessView(false);
        setSelectedIncident(null);
        setSelectedLocation(AMENITIES[0]);
        setNotes('');
    };

    const renderBanner = () => {
        const isAlertActive = !!activeAlert;
        return (
            <View style={[styles.bannerCard, isAlertActive ? styles.bannerDanger : styles.bannerSafe]}>
                <View style={styles.bannerIconWrapper}>
                    <Feather name={isAlertActive ? "alert-circle" : "check-circle"} size={24} color={isAlertActive ? "#FFF" : Theme.colors.success.default} />
                </View>
                <View style={styles.bannerTextContainer}>
                    <Text style={[styles.bannerTitle, isAlertActive && { color: '#FFF' }]}>
                        {isAlertActive ? "Security Responding" : "Estate Secure"}
                    </Text>
                    <Text style={[styles.bannerSubtext, isAlertActive && { color: 'rgba(255,255,255,0.8)' }]}>
                        {isAlertActive ? "Response team dispatched." : "All security systems operational."}
                    </Text>
                </View>
            </View>
        );
    };

    const renderActiveAlertProgress = () => {
        const steps = ['Reported', 'Responding', 'On Site', 'Resolved'];
        const currentStep = 1; // Simulated at "Responding"

        return (
            <View style={styles.progressContainer}>
                {steps.map((step, index) => (
                    <View key={step} style={styles.progressStepWrapper}>
                        <View style={[
                            styles.progressDot,
                            index <= currentStep ? styles.progressDotActive : styles.progressDotInactive
                        ]} />
                        {index < steps.length - 1 && (
                            <View style={[
                                styles.progressLine,
                                index < currentStep ? styles.progressLineActive : styles.progressLineInactive
                            ]} />
                        )}
                        <Text style={[
                            styles.progressText,
                            index <= currentStep ? styles.progressTextActive : styles.progressTextInactive
                        ]}>{step}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Security Command" showBack={false} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* 1. Top Section – Safety Status Banner */}
                {renderBanner()}

                {/* 5. Active Alerts Tracker (If active alert) */}
                {activeAlert && (
                    <Card style={styles.activeAlertCard}>
                        <View style={styles.activeAlertHeader}>
                            <View>
                                <Text style={styles.activeAlertTitle}>{activeAlert.title}</Text>
                                <Text style={styles.activeAlertTime}>Reported at {activeAlert.timestamp}</Text>
                            </View>
                            <View style={styles.activeAlertChip}>
                                <Text style={styles.activeAlertChipText}>{activeAlert.status}</Text>
                            </View>
                        </View>
                        <View style={styles.activeAlertDetails}>
                            <Feather name="shield" size={16} color={Theme.colors.text.secondary} />
                            <Text style={styles.activeAlertDetailText}>Assigned: {activeAlert.team}</Text>
                            <Text style={styles.activeAlertDetailDot}>•</Text>
                            <Feather name="clock" size={16} color={Theme.colors.text.secondary} />
                            <Text style={styles.activeAlertDetailText}>ETA: {activeAlert.eta}</Text>
                        </View>
                        {renderActiveAlertProgress()}
                    </Card>
                )}

                {/* Optional Booking Context */}
                {!activeAlert && (
                    <View style={styles.bookingBadge}>
                        <Feather name="film" size={16} color={Theme.colors.primary.default} />
                        <Text style={styles.bookingBadgeText}>During Your Cinema Booking</Text>
                    </View>
                )}

                {/* 2. Emergency Action Section */}
                <Animated.View style={[styles.panicButtonWrapper, animatedPanicStyle]}>
                    <TouchableOpacity
                        style={styles.panicButtonCard}
                        activeOpacity={0.9}
                        onPress={() => setSelectedIncident({ title: 'Emergency Dispatch' })}
                    >
                        <Feather name="alert-triangle" size={40} color="#FFFFFF" />
                        <Text style={styles.panicText}>Emergency Dispatch</Text>
                        <Text style={styles.panicSubtext}>Notify on-site security immediately</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* 3. Quick Report Grid */}
                <Text style={styles.sectionTitle}>Quick Report</Text>
                <View style={styles.grid}>
                    {INCIDENT_TYPES.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            style={styles.gridItemWrapper}
                            activeOpacity={0.7}
                            onPress={() => setSelectedIncident(type)}
                        >
                            <Card style={styles.gridItem}>
                                <View style={[styles.iconCircle, { backgroundColor: `${type.color}15` }]}>
                                    <Feather name={type.icon as any} size={28} color={type.color} />
                                </View>
                                <Text style={styles.gridItemTitle}>{type.title}</Text>
                                <Text style={styles.gridItemSubtext}>Dispatch immediately</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Advanced Optional Features */}
                <View style={styles.advancedFeaturesWrapper}>
                    <TouchableOpacity style={styles.actionCardRow}>
                        <View style={styles.actionIconWrapper}>
                            <Feather name="phone-call" size={20} color={Theme.colors.text.default} />
                        </View>
                        <Text style={styles.actionText}>Call Security Hub</Text>
                        <Feather name="chevron-right" size={20} color={Theme.colors.text.muted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCardRow}>
                        <View style={styles.actionIconWrapper}>
                            <Feather name="users" size={20} color={Theme.colors.text.default} />
                        </View>
                        <Text style={styles.actionText}>Request Night Escort</Text>
                        <Feather name="chevron-right" size={20} color={Theme.colors.text.muted} />
                    </TouchableOpacity>
                </View>

                {/* 6. Incident History */}
                <Text style={[styles.sectionTitle, { marginTop: Theme.spacing.lg }]}>Incident History</Text>
                {PREVIOUS_INCIDENTS.map(incident => (
                    <TouchableOpacity key={incident.id} activeOpacity={0.7}>
                        <Card style={styles.historyCard} noPadding>
                            <View style={styles.historyRow}>
                                <View style={styles.historyStatusDot} />
                                <View style={styles.historyDetails}>
                                    <Text style={styles.historyType}>{incident.type}</Text>
                                    <View style={styles.historyMetaRow}>
                                        <Text style={styles.historyMetaText}>{incident.date} • {incident.time}</Text>
                                        <Text style={styles.historyMetaDot}>•</Text>
                                        <Text style={styles.historyMetaText}>{incident.location}</Text>
                                    </View>
                                </View>
                                <View style={styles.historyChip}>
                                    <Text style={styles.historyChipText}>{incident.status}</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                {/* 8. Safety Transparency */}
                <Text style={[styles.sectionTitle, { marginTop: Theme.spacing.lg }]}>Security Performance</Text>
                <Card style={styles.transparencyCard}>
                    <View style={styles.transparencyMetric}>
                        <Text style={styles.transparencyValue}>4<Text style={styles.transparencyValueUnit}> min</Text></Text>
                        <Text style={styles.transparencyLabel}>Avg. Response Time</Text>
                    </View>
                    <View style={styles.transparencyDivider} />
                    <View style={styles.transparencyMetric}>
                        <Text style={styles.transparencyValue}>12</Text>
                        <Text style={styles.transparencyLabel}>Resolved This Month</Text>
                    </View>
                </Card>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* 4. Simulated Alert Flow - Confirm & Success BottomSheet */}
            <BottomSheet visible={!!selectedIncident} onClose={() => {
                setSelectedIncident(null);
                setSuccessView(false);
            }}>
                <View style={styles.sheetContent}>
                    {!successView ? (
                        <>
                            <View style={styles.sheetHeaderIcon}>
                                <Feather name="alert-triangle" size={36} color={Theme.colors.danger.default} />
                            </View>
                            <Text style={styles.sheetTitle}>Confirm Dispatch</Text>
                            <Text style={styles.sheetSubtitle}>
                                For incident type: <Text style={{ fontWeight: '700' }}>{selectedIncident?.title}</Text>
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Location Context (Auto-detected)</Text>
                                <View style={styles.locationBadge}>
                                    <Feather name="map-pin" size={14} color="#059669" />
                                    <Text style={styles.locationBadgeText}>Precise GPS active</Text>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>This is happening at:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                    {AMENITIES.map(loc => (
                                        <TouchableOpacity
                                            key={loc}
                                            style={[styles.chipItem, selectedLocation === loc && styles.chipItemActive]}
                                            onPress={() => setSelectedLocation(loc)}
                                        >
                                            <Text style={[styles.chipText, selectedLocation === loc && styles.chipTextActive]}>{loc}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Optional Notes for Security</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Near the main entrance..."
                                    placeholderTextColor={Theme.colors.text.muted}
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>

                            <View style={styles.toggleRow}>
                                <View>
                                    <Text style={styles.toggleTitle}>Share live location</Text>
                                    <Text style={styles.toggleSubtitle}>Helps response team find you</Text>
                                </View>
                                <Switch
                                    value={shareLocation}
                                    onValueChange={setShareLocation}
                                    trackColor={{ false: '#E2E8F0', true: Theme.colors.primary.default }}
                                />
                            </View>

                            <Button
                                title="Dispatch Security"
                                variant="danger"
                                style={{ marginTop: Theme.spacing.md, marginBottom: Theme.spacing.sm, width: '100%' }}
                                onPress={dispatchSecurity}
                            />
                            <Button
                                title="Cancel"
                                variant="ghost"
                                style={{ width: '100%' }}
                                onPress={() => setSelectedIncident(null)}
                            />
                        </>
                    ) : (
                        <View style={styles.successState}>
                            <View style={styles.successIconCircle}>
                                <Feather name="check" size={40} color="#FFFFFF" />
                            </View>
                            <Text style={styles.successTitle}>Security Has Been Notified</Text>
                            <Text style={styles.successSubtitle}>Help is on the way. Please stay safe.</Text>

                            <View style={styles.incidentDetailsBox}>
                                <View style={styles.incidentRow}>
                                    <Text style={styles.incidentLabel}>Incident ID</Text>
                                    <Text style={styles.incidentDatum}>INC-4829</Text>
                                </View>
                                <View style={styles.incidentRow}>
                                    <Text style={styles.incidentLabel}>Reported</Text>
                                    <Text style={styles.incidentDatum}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                            </View>

                            <Button
                                title="Track Status"
                                variant="primary"
                                style={{ marginTop: Theme.spacing.xl, width: '100%' }}
                                onPress={confirmSuccessAndClose}
                            />
                        </View>
                    )}
                </View>
            </BottomSheet>
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
    bannerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.lg,
        marginBottom: Theme.spacing.lg,
    },
    bannerSafe: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    bannerDanger: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    bannerIconWrapper: {
        marginRight: Theme.spacing.sm,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        ...Theme.typography.bodyLg,
        fontWeight: '700',
        color: '#065F46',
    },
    bannerSubtext: {
        ...Theme.typography.bodySm,
        color: '#047857',
        marginTop: 2,
    },

    bookingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: `${Theme.colors.primary.default}15`,
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: Theme.spacing.lg,
    },
    bookingBadgeText: {
        ...Theme.typography.caption,
        color: Theme.colors.primary.default,
        fontWeight: '600',
        marginLeft: 6,
    },

    activeAlertCard: {
        marginBottom: Theme.spacing.xl,
        borderColor: '#FEF2F2',
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
    },
    activeAlertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Theme.spacing.sm,
    },
    activeAlertTitle: {
        ...Theme.typography.bodyLg,
        fontWeight: '700',
        color: '#B91C1C',
    },
    activeAlertTime: {
        ...Theme.typography.caption,
        color: Theme.colors.text.secondary,
        marginTop: 4,
    },
    activeAlertChip: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeAlertChipText: {
        ...Theme.typography.caption,
        color: '#B91C1C',
        fontWeight: '700',
    },
    activeAlertDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Theme.spacing.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Theme.colors.border,
        marginVertical: Theme.spacing.md,
    },
    activeAlertDetailText: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.default,
        marginLeft: 6,
    },
    activeAlertDetailDot: {
        color: Theme.colors.text.muted,
        marginHorizontal: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Theme.spacing.xs,
        paddingHorizontal: Theme.spacing.xs,
    },
    progressStepWrapper: {
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 2,
    },
    progressDotActive: {
        backgroundColor: '#B91C1C',
    },
    progressDotInactive: {
        backgroundColor: '#E2E8F0',
    },
    progressLine: {
        position: 'absolute',
        top: 5,
        left: '50%',
        width: '100%',
        height: 2,
        zIndex: 1,
    },
    progressLineActive: {
        backgroundColor: '#B91C1C',
    },
    progressLineInactive: {
        backgroundColor: '#E2E8F0',
    },
    progressText: {
        ...Theme.typography.caption,
        fontSize: 10,
        marginTop: 6,
        textAlign: 'center',
    },
    progressTextActive: {
        color: '#B91C1C',
        fontWeight: '600',
    },
    progressTextInactive: {
        color: Theme.colors.text.muted,
    },

    panicButtonWrapper: {
        marginBottom: Theme.spacing.xl,
        shadowColor: '#F04438',
        shadowOffset: { width: 0, height: 4 },
    },
    panicButtonCard: {
        backgroundColor: '#F04438',
        borderRadius: Theme.radius.xl,
        padding: Theme.spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    panicText: {
        ...Theme.typography.h2,
        color: '#FFFFFF',
        marginTop: Theme.spacing.lg,
    },
    panicSubtext: {
        ...Theme.typography.body,
        color: '#FFE4E2',
        marginTop: 4,
    },

    sectionTitle: {
        ...Theme.typography.h3,
        marginBottom: Theme.spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -Theme.spacing.xs,
        marginBottom: Theme.spacing.md,
    },
    gridItemWrapper: {
        width: '50%',
        padding: Theme.spacing.xs,
    },
    gridItem: {
        alignItems: 'center',
        paddingVertical: Theme.spacing.xl,
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.md,
    },
    gridItemTitle: {
        ...Theme.typography.bodyLg,
        fontWeight: '600',
        textAlign: 'center',
    },
    gridItemSubtext: {
        ...Theme.typography.caption,
        color: Theme.colors.text.muted,
        marginTop: 4,
        textAlign: 'center',
    },

    advancedFeaturesWrapper: {
        gap: Theme.spacing.sm,
    },
    actionCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.md,
        ...Theme.shadows.card,
    },
    actionIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.md,
    },
    actionText: {
        ...Theme.typography.bodyLg,
        fontWeight: '600',
        flex: 1,
    },

    historyCard: {
        marginBottom: Theme.spacing.sm,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
    },
    historyStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.success.default,
        marginRight: Theme.spacing.md,
    },
    historyDetails: {
        flex: 1,
    },
    historyType: {
        ...Theme.typography.bodyLg,
        fontWeight: '600',
    },
    historyMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    historyMetaText: {
        ...Theme.typography.caption,
        color: Theme.colors.text.secondary,
    },
    historyMetaDot: {
        ...Theme.typography.caption,
        color: Theme.colors.text.muted,
        marginHorizontal: 6,
    },
    historyChip: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    historyChipText: {
        ...Theme.typography.caption,
        color: Theme.colors.text.secondary,
        fontWeight: '600',
    },

    transparencyCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: Theme.spacing.xl,
    },
    transparencyMetric: {
        alignItems: 'center',
    },
    transparencyValue: {
        ...Theme.typography.h1,
        color: Theme.colors.primary.default,
    },
    transparencyValueUnit: {
        ...Theme.typography.h3,
        color: Theme.colors.primary.default,
    },
    transparencyLabel: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
        marginTop: 4,
    },
    transparencyDivider: {
        width: 1,
        height: 40,
        backgroundColor: Theme.colors.border,
    },

    sheetContent: {
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: Theme.spacing.xl,
        width: '100%',
    },
    sheetHeaderIcon: {
        alignSelf: 'center',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Theme.colors.danger.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.md,
    },
    sheetTitle: {
        ...Theme.typography.h2,
        textAlign: 'center',
        marginBottom: 4,
    },
    sheetSubtitle: {
        ...Theme.typography.body,
        textAlign: 'center',
        color: Theme.colors.text.secondary,
        marginBottom: Theme.spacing.xl,
    },
    formGroup: {
        marginBottom: Theme.spacing.lg,
    },
    label: {
        ...Theme.typography.bodySm,
        fontWeight: '600',
        marginBottom: 8,
        color: Theme.colors.text.default,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: Theme.radius.sm,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    locationBadgeText: {
        ...Theme.typography.caption,
        color: '#065F46',
        fontWeight: '600',
        marginLeft: 6,
    },
    chipScroll: {
        flexDirection: 'row',
    },
    chipItem: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipItemActive: {
        backgroundColor: `${Theme.colors.primary.default}15`,
        borderColor: Theme.colors.primary.default,
    },
    chipText: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
    },
    chipTextActive: {
        color: Theme.colors.primary.default,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        padding: Theme.spacing.md,
        ...Theme.typography.body,
        height: 80,
        textAlignVertical: 'top',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.xl,
        paddingTop: Theme.spacing.md,
        borderTopWidth: 1,
        borderColor: Theme.colors.border,
    },
    toggleTitle: {
        ...Theme.typography.bodyLg,
        fontWeight: '600',
    },
    toggleSubtitle: {
        ...Theme.typography.caption,
        color: Theme.colors.text.muted,
        marginTop: 2,
    },
    successState: {
        alignItems: 'center',
        paddingTop: Theme.spacing.lg,
    },
    successIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.lg,
    },
    successTitle: {
        ...Theme.typography.h2,
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        ...Theme.typography.body,
        textAlign: 'center',
        color: Theme.colors.text.secondary,
        marginBottom: Theme.spacing.xl,
    },
    incidentDetailsBox: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: Theme.radius.md,
        padding: Theme.spacing.lg,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    incidentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    incidentLabel: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
    },
    incidentDatum: {
        ...Theme.typography.body,
        fontWeight: '700',
    },
});
