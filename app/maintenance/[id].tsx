import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/ui/Header';
import { Theme } from '../../constants/Theme';
import { MAINTENANCE_TICKETS } from '../../data/misc';
import { MaintenanceTicket } from '../../data/types';

const STATUS_COLORS: Record<string, string> = {
    'Reported': '#8B5CF6',
    'Under Review': '#3B82F6',
    'In Progress': '#F97316',
    'Awaiting Parts': '#F59E0B',
    'Resolved': '#10B981',
};

const STAGES = ['Reported', 'Assigned', 'In Progress', 'Resolved']; // Simplified linear tracker stages

export default function MaintenanceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const ticket = MAINTENANCE_TICKETS.find(t => t.id === id) as MaintenanceTicket;

    if (!ticket) {
        return (
            <View style={styles.container}>
                <Header title="Ticket Not Found" onBack={() => router.back()} />
            </View>
        );
    }

    // Determine current step index based on status
    const getCurrentStep = () => {
        if (ticket.status === 'Resolved') return 3;
        if (ticket.status === 'In Progress' || ticket.status === 'Awaiting Parts') return 2;
        if (ticket.assignedTo && ticket.status !== 'Reported') return 1;
        return 0; // Reported / Under Review
    };

    const currentStep = getCurrentStep();

    const renderTimeline = () => (
        <View style={styles.timelineContainer}>
            <View style={styles.timelineTrack} />
            {STAGES.map((stage, index) => {
                const isCompleted = index <= currentStep;
                const isActive = index === currentStep;

                return (
                    <View key={stage} style={styles.timelineStep}>
                        <View style={[styles.timelineDot, isCompleted && styles.timelineDotActive, isActive && styles.timelineDotCurrent]}>
                            {isCompleted && !isActive && <Feather name="check" size={10} color="#fff" />}
                        </View>
                        <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>{stage}</Text>
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title={`Ticket #${ticket.id.toUpperCase()}`} onBack={() => router.back()} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={ticket.image} style={styles.heroImage} />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.amenityText}>{ticket.amenity}</Text>
                            <Text style={styles.titleText}>{ticket.title}</Text>
                        </View>
                        <View style={[styles.statusChip, { backgroundColor: STATUS_COLORS[ticket.status] + '15' }]}>
                            <Text style={[styles.statusText, { color: STATUS_COLORS[ticket.status] }]}>{ticket.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{ticket.description}</Text>

                    {renderTimeline()}

                    <View style={styles.metaGrid}>
                        {ticket.assignedTo && (
                            <View style={styles.metaItem}>
                                <Feather name="tool" size={18} color={Theme.colors.text.secondary} />
                                <View style={styles.metaTextContainer}>
                                    <Text style={styles.metaLabel}>Assigned To</Text>
                                    <Text style={styles.metaValue}>{ticket.assignedTo}</Text>
                                </View>
                            </View>
                        )}
                        {ticket.eta && (
                            <View style={styles.metaItem}>
                                <Feather name="calendar" size={18} color={Theme.colors.text.secondary} />
                                <View style={styles.metaTextContainer}>
                                    <Text style={styles.metaLabel}>Estimated Completion</Text>
                                    <Text style={styles.metaValue}>{ticket.eta}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <Text style={styles.sectionHeader}>Attachments</Text>
                    <View style={styles.attachmentBox}>
                        <Feather name="image" size={32} color={Theme.colors.text.muted} />
                        <Text style={styles.attachmentText}>Uploaded Image</Text>
                    </View>

                    <Text style={styles.sectionHeader}>Activity Log</Text>
                    <Card style={styles.logsCard}>
                        {ticket.timeline.map((event, index) => (
                            <View key={index} style={styles.logItem}>
                                <View style={styles.logBullet} />
                                <View style={styles.logContent}>
                                    <View style={styles.logHeader}>
                                        <Text style={styles.logStatus}>{event.status}</Text>
                                        <Text style={styles.logDate}>
                                            {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    {event.note && <Text style={styles.logNote}>{event.note}</Text>}
                                </View>
                            </View>
                        ))}
                    </Card>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background.app,
    },
    heroImage: {
        width: '100%',
        height: 220,
        backgroundColor: '#E2E8F0',
    },
    content: {
        padding: Theme.spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Theme.spacing.sm,
    },
    amenityText: {
        ...Theme.typography.caption,
        color: Theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    titleText: {
        ...Theme.typography.h2,
    },
    statusChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.radius.sm,
        marginLeft: Theme.spacing.md,
    },
    statusText: {
        ...Theme.typography.bodySm,
        fontWeight: '600',
    },
    description: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
        marginBottom: Theme.spacing.xl,
        lineHeight: 22,
    },
    // Timeline Styles
    timelineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.xl,
        paddingHorizontal: Theme.spacing.sm,
        position: 'relative',
    },
    timelineTrack: {
        position: 'absolute',
        top: 8,
        left: 24,
        right: 24,
        height: 2,
        backgroundColor: Theme.colors.border,
        zIndex: 0,
    },
    timelineStep: {
        alignItems: 'center',
        zIndex: 1,
        width: 70,
    },
    timelineDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: Theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    timelineDotActive: {
        backgroundColor: Theme.colors.primary.default,
        borderColor: Theme.colors.primary.default,
    },
    timelineDotCurrent: {
        borderColor: Theme.colors.primary.default,
        borderWidth: 3,
        backgroundColor: '#fff',
        width: 22,
        height: 22,
        borderRadius: 11,
        marginTop: -2,
        marginBottom: 6,
    },
    timelineText: {
        ...Theme.typography.caption,
        fontSize: 10,
        textAlign: 'center',
    },
    timelineTextActive: {
        color: Theme.colors.primary.default,
        fontWeight: '600',
    },
    // Meta section
    metaGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: Theme.radius.md,
        padding: Theme.spacing.md,
        ...Theme.shadows.soft,
        marginBottom: Theme.spacing.xl,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metaTextContainer: {
        marginLeft: Theme.spacing.sm,
    },
    metaLabel: {
        ...Theme.typography.caption,
        fontSize: 11,
        marginBottom: 2,
    },
    metaValue: {
        ...Theme.typography.bodySm,
        fontWeight: '500',
        color: Theme.colors.text.primary,
    },
    sectionHeader: {
        ...Theme.typography.h4,
        marginBottom: Theme.spacing.md,
    },
    attachmentBox: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.sm,
        padding: Theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Theme.spacing.xl,
    },
    attachmentText: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
        marginTop: Theme.spacing.sm,
    },
    logsCard: {
        paddingVertical: Theme.spacing.md,
        paddingHorizontal: Theme.spacing.lg,
    },
    logItem: {
        flexDirection: 'row',
        marginBottom: Theme.spacing.md,
    },
    logBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.border,
        marginTop: 6,
        marginRight: Theme.spacing.sm,
    },
    logContent: {
        flex: 1,
        paddingBottom: Theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    logStatus: {
        ...Theme.typography.bodySm,
        fontWeight: '600',
    },
    logDate: {
        ...Theme.typography.caption,
        fontSize: 11,
    },
    logNote: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
        fontSize: 13,
    }
});
