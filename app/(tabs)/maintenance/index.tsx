import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from '../../../components/ui/BottomSheet';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { Theme } from '../../../constants/Theme';
import { AMENITY_HEALTH, MAINTENANCE_TICKETS } from '../../../data/misc';

const STATUS_COLORS: Record<string, string> = {
    'Reported': '#8B5CF6', // Purple
    'Under Review': '#3B82F6', // Blue
    'In Progress': '#F97316', // Orange
    'Awaiting Parts': '#F59E0B', // Amber
    'Resolved': '#10B981', // Green
};

const HEALTH_COLORS: Record<string, string> = {
    'green': '#10B981',
    'yellow': '#F59E0B',
    'red': '#EF4444',
};

const AMENITIES = ['All Amenities', 'Cinema', 'Clubhouse', 'Pool', 'Gym', 'Braai Area', 'Meeting Room'];
const ISSUE_TYPES = ['Electrical', 'Cleanliness', 'Structural', 'Equipment', 'Safety', 'Other'];
const TABS = ['Open', 'In Progress', 'Resolved'];

export default function MaintenanceScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Open');
    const [selectedAmenityFilter, setSelectedAmenityFilter] = useState('All Amenities');

    // New Ticket State
    const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
    const [newTicketStep, setNewTicketStep] = useState(1);
    const [newTicketAmenity, setNewTicketAmenity] = useState('');
    const [newTicketType, setNewTicketType] = useState('');
    const [newTicketDesc, setNewTicketDesc] = useState('');

    const filteredTickets = useMemo(() => {
        return MAINTENANCE_TICKETS.filter(ticket => {
            // Apply Amenity filter
            if (selectedAmenityFilter !== 'All Amenities' && ticket.amenity !== selectedAmenityFilter) return false;

            // Apply Tab filter
            if (activeTab === 'Open') {
                return ['Reported', 'Under Review'].includes(ticket.status);
            } else if (activeTab === 'In Progress') {
                return ['In Progress', 'Awaiting Parts'].includes(ticket.status);
            } else {
                return ticket.status === 'Resolved';
            }
        });
    }, [activeTab, selectedAmenityFilter]);

    const handleIssuePress = (id: string) => {
        router.push(`/maintenance/${id}`);
    };

    const renderHealthOverview = () => (
        <View style={styles.healthContainer}>
            <Text style={styles.sectionTitle}>Amenity Condition Overview</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.healthScroll}>
                {AMENITY_HEALTH.map((item, index) => (
                    <Card key={index} style={styles.healthCard}>
                        <View style={styles.healthHeader}>
                            <View style={[styles.healthDot, { backgroundColor: HEALTH_COLORS[item.indicator] }]} />
                            <Text style={styles.healthAmenity}>{item.amenity}</Text>
                        </View>
                        <Text style={styles.healthStatus}>{item.status}</Text>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {TABS.map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.tabActive]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderFilters = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
            {AMENITIES.map(amenity => (
                <TouchableOpacity
                    key={amenity}
                    style={[styles.filterChip, selectedAmenityFilter === amenity && styles.filterChipActive]}
                    onPress={() => setSelectedAmenityFilter(amenity)}
                >
                    <Text style={[styles.filterText, selectedAmenityFilter === amenity && styles.filterTextActive]}>{amenity}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderNewTicketModal = () => (
        <BottomSheet visible={isNewTicketOpen} onClose={() => {
            setIsNewTicketOpen(false);
            setTimeout(() => setNewTicketStep(1), 300); // Reset after close
        }}>
            <View style={styles.sheetContent}>
                {newTicketStep === 1 && (
                    <>
                        <Text style={styles.sheetTitle}>Select Amenity</Text>
                        <View style={styles.optionsGrid}>
                            {AMENITIES.filter(a => a !== 'All Amenities').map(a => (
                                <TouchableOpacity
                                    key={a}
                                    style={[styles.optionCard, newTicketAmenity === a && styles.optionCardActive]}
                                    onPress={() => setNewTicketAmenity(a)}
                                >
                                    <Text style={[styles.optionText, newTicketAmenity === a && styles.optionTextActive]}>{a}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button
                            title="Next"
                            disabled={!newTicketAmenity}
                            onPress={() => setNewTicketStep(2)}
                            style={styles.stepButton}
                        />
                    </>
                )}
                {newTicketStep === 2 && (
                    <>
                        <Text style={styles.sheetTitle}>Select Issue Type</Text>
                        <View style={styles.optionsGrid}>
                            {ISSUE_TYPES.map(t => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.optionCard, newTicketType === t && styles.optionCardActive]}
                                    onPress={() => setNewTicketType(t)}
                                >
                                    <Text style={[styles.optionText, newTicketType === t && styles.optionTextActive]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalActions}>
                            <Button title="Back" variant="outline" onPress={() => setNewTicketStep(1)} style={styles.halfBtn} />
                            <Button title="Next" disabled={!newTicketType} onPress={() => setNewTicketStep(3)} style={styles.halfBtn} />
                        </View>
                    </>
                )}
                {newTicketStep === 3 && (
                    <>
                        <Text style={styles.sheetTitle}>Describe Issue</Text>
                        <Input
                            label="Description"
                            placeholder="What seems to be the problem?"
                            value={newTicketDesc}
                            onChangeText={setNewTicketDesc}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, textAlignVertical: 'top' }}
                        />
                        <View style={styles.modalActions}>
                            <Button title="Back" variant="outline" onPress={() => setNewTicketStep(2)} style={styles.halfBtn} />
                            <Button title="Next" disabled={!newTicketDesc} onPress={() => setNewTicketStep(4)} style={styles.halfBtn} />
                        </View>
                    </>
                )}
                {newTicketStep === 4 && (
                    <>
                        <Text style={styles.sheetTitle}>Attach Photo</Text>
                        <TouchableOpacity style={styles.photoUploadArea}>
                            <Feather name="camera" size={32} color={Theme.colors.text.muted} />
                            <Text style={styles.photoUploadText}>Tap to upload photo (Optional)</Text>
                        </TouchableOpacity>
                        <View style={styles.modalActions}>
                            <Button title="Back" variant="outline" onPress={() => setNewTicketStep(3)} style={styles.halfBtn} />
                            <Button title="Submit Issue" onPress={() => setNewTicketStep(5)} style={styles.halfBtn} />
                        </View>
                    </>
                )}
                {newTicketStep === 5 && (
                    <View style={styles.successState}>
                        <View style={styles.successCircle}>
                            <Feather name="check" size={32} color={Theme.colors.primary.default} />
                        </View>
                        <Text style={styles.successTitle}>Issue Successfully Reported</Text>
                        <Text style={styles.successDesc}>Ticket ID: #TK-{Math.floor(Math.random() * 10000)}</Text>
                        <Button title="Done" onPress={() => {
                            setIsNewTicketOpen(false);
                            setTimeout(() => setNewTicketStep(1), 300);
                        }} style={{ width: '100%', marginTop: 24 }} />
                    </View>
                )}
            </View>
        </BottomSheet>
    );

    return (
        <View style={styles.container}>
            <Header
                title="Amenity Maintenance"
                showBack={false}
                rightElement={
                    <TouchableOpacity onPress={() => {
                        setNewTicketAmenity('');
                        setNewTicketType('');
                        setNewTicketDesc('');
                        setNewTicketStep(1);
                        setIsNewTicketOpen(true);
                    }}>
                        <Feather name="plus-circle" size={24} color={Theme.colors.primary.default} />
                    </TouchableOpacity>
                }
            />

            {renderHealthOverview()}
            {renderTabs()}
            {renderFilters()}

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {filteredTickets.map(ticket => (
                    <TouchableOpacity key={ticket.id} activeOpacity={0.8} onPress={() => handleIssuePress(ticket.id)}>
                        <View style={[styles.issueCard, { borderLeftColor: STATUS_COLORS[ticket.status] }]}>
                            <View style={styles.issueContent}>
                                <Image source={ticket.image} style={styles.issueThumbnail} />
                                <View style={styles.issueDetails}>
                                    <Text style={styles.issueAmenity}>{ticket.amenity}</Text>
                                    <Text style={styles.issueTitle}>{ticket.title}</Text>
                                    <Text style={styles.issueDesc} numberOfLines={2}>{ticket.description}</Text>
                                    <View style={styles.issueMeta}>
                                        <Feather name="clock" size={12} color={Theme.colors.text.muted} />
                                        <Text style={styles.issueDate}>
                                            Submitted {new Date(ticket.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.statusChip, { backgroundColor: STATUS_COLORS[ticket.status] + '15' }]}>
                                <Text style={[styles.statusText, { color: STATUS_COLORS[ticket.status] }]}>{ticket.status}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredTickets.length === 0 && (
                    <View style={styles.emptyState}>
                        <Feather name="check-circle" size={48} color={Theme.colors.text.muted} style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyTitle}>No open issues</Text>
                        <Text style={styles.emptyDesc}>Awesome! There are no issues matching this filter.</Text>
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {renderNewTicketModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background.app,
    },
    sectionTitle: {
        ...Theme.typography.h4,
        paddingHorizontal: Theme.spacing.md,
        marginBottom: Theme.spacing.sm,
    },
    healthContainer: {
        paddingVertical: Theme.spacing.md,
    },
    healthScroll: {
        paddingHorizontal: Theme.spacing.md,
        gap: Theme.spacing.sm,
    },
    healthCard: {
        padding: Theme.spacing.md,
        width: 160,
        backgroundColor: '#fff',
    },
    healthHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    healthDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    healthAmenity: {
        ...Theme.typography.body,
        fontWeight: '600',
    },
    healthStatus: {
        ...Theme.typography.caption,
        color: Theme.colors.text.secondary,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: Theme.spacing.md,
        marginBottom: Theme.spacing.sm,
        backgroundColor: '#E2E8F0', // Light gray background for pill container
        borderRadius: Theme.radius.full,
        marginHorizontal: Theme.spacing.md,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: Theme.radius.full,
    },
    tabActive: {
        backgroundColor: '#fff',
        ...Theme.shadows.soft,
    },
    tabText: {
        ...Theme.typography.bodySm,
        fontWeight: '500',
        color: Theme.colors.text.secondary,
    },
    tabTextActive: {
        color: Theme.colors.text.primary,
        fontWeight: '600',
    },
    filterScroll: {
        maxHeight: 48,
    },
    filterContainer: {
        paddingHorizontal: Theme.spacing.md,
        gap: Theme.spacing.sm,
        paddingVertical: 4,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Theme.radius.full,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    filterChipActive: {
        backgroundColor: Theme.colors.primary.default,
        borderColor: Theme.colors.primary.default,
    },
    filterText: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
    list: {
        padding: Theme.spacing.md,
        gap: Theme.spacing.md,
    },
    issueCard: {
        backgroundColor: '#fff',
        borderRadius: Theme.radius.md,
        padding: Theme.spacing.md,
        borderLeftWidth: 4,
        ...Theme.shadows.soft,
    },
    issueContent: {
        flexDirection: 'row',
        marginBottom: Theme.spacing.sm,
    },
    issueThumbnail: {
        width: 60,
        height: 60,
        borderRadius: Theme.radius.sm,
        marginRight: Theme.spacing.md,
    },
    issueDetails: {
        flex: 1,
    },
    issueAmenity: {
        ...Theme.typography.caption,
        color: Theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    issueTitle: {
        ...Theme.typography.body,
        fontWeight: '600',
        marginBottom: 4,
    },
    issueDesc: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
        marginBottom: 8,
    },
    issueMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    issueDate: {
        ...Theme.typography.caption,
        marginLeft: 4,
    },
    statusChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: Theme.radius.sm,
        marginTop: 4,
    },
    statusText: {
        ...Theme.typography.caption,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Theme.spacing.xxl,
    },
    emptyTitle: {
        ...Theme.typography.h3,
        marginBottom: Theme.spacing.xs,
    },
    emptyDesc: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
        textAlign: 'center',
    },
    sheetContent: {
        paddingHorizontal: Theme.spacing.lg,
        paddingBottom: Theme.spacing.xl,
    },
    sheetTitle: {
        ...Theme.typography.h3,
        marginBottom: Theme.spacing.lg,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Theme.spacing.sm,
        marginBottom: Theme.spacing.lg,
    },
    optionCard: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: Theme.radius.sm,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        backgroundColor: '#fff',
    },
    optionCardActive: {
        borderColor: Theme.colors.primary.default,
        backgroundColor: Theme.colors.primary.default + '10',
    },
    optionText: {
        ...Theme.typography.body,
        color: Theme.colors.text.primary,
    },
    optionTextActive: {
        color: Theme.colors.primary.default,
        fontWeight: '600',
    },
    stepButton: {
        marginTop: Theme.spacing.md,
    },
    modalActions: {
        flexDirection: 'row',
        gap: Theme.spacing.md,
        marginTop: Theme.spacing.md,
    },
    halfBtn: {
        flex: 1,
    },
    photoUploadArea: {
        height: 120,
        borderWidth: 2,
        borderColor: Theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: Theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        marginBottom: Theme.spacing.lg,
    },
    photoUploadText: {
        ...Theme.typography.bodySm,
        color: Theme.colors.text.secondary,
        marginTop: Theme.spacing.sm,
    },
    successState: {
        alignItems: 'center',
        paddingVertical: Theme.spacing.xl,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.colors.primary.default + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Theme.spacing.lg,
    },
    successTitle: {
        ...Theme.typography.h3,
        marginBottom: Theme.spacing.xs,
    },
    successDesc: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
    }
});
