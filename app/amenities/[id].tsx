import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Theme } from '../../constants/Theme';
import { AMENITIES } from '../../data/amenities';

export default function AmenityDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [rulesOpen, setRulesOpen] = useState(false);

    const amenity = AMENITIES.find(a => a.id === id);

    if (!amenity) return null;

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.heroContainer}>
                    <Image source={amenity.image} style={styles.heroImage} />
                    <View style={styles.heroOverlay}>
                        <View style={styles.headerSpacer}>
                            <Header title="" showBack={true} />
                        </View>
                        <View style={styles.heroContent}>
                            <View style={{ marginBottom: 12 }}>
                                <Text style={styles.heroTitle}>{amenity.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                    <View style={styles.heroRating}>
                                        <Feather name="star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                                        <Text style={styles.heroRatingText}>{amenity.rating} <Text style={{ fontWeight: '400', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>(based on recent reviews)</Text></Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} style={{ marginLeft: 12 }}>
                                        <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '500', textDecorationLine: 'underline' }}>See Feedback Trends</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.heroBadgeRow}>
                                <View style={[
                                    styles.heroBadge,
                                    amenity.status === 'Available' ? styles.heroBadgeActive : styles.heroBadgeWarning
                                ]}>
                                    <View style={[
                                        styles.heroBadgeDot,
                                        amenity.status === 'Available' ? styles.heroBadgeDotActive : styles.heroBadgeDotWarning
                                    ]} />
                                    <Text style={[
                                        styles.heroBadgeText,
                                        amenity.status === 'Available' ? styles.heroBadgeTextActive : styles.heroBadgeTextWarning
                                    ]}>
                                        {amenity.status === 'Available' ? 'Available Now' : 'Booked next in 30 mins'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>

                    {/* Consistent Mini Cards */}
                    <View style={styles.statsCardContainer}>
                        <View style={styles.statMiniCard}>
                            <Feather name="users" size={24} color={Theme.colors.primary.default} />
                            <Text style={styles.statValue}>Up to {amenity.capacity}</Text>
                            <Text style={styles.statLabel}>Capacity</Text>
                        </View>
                        <View style={styles.statMiniCard}>
                            <Feather name="clock" size={24} color={Theme.colors.primary.default} />
                            <Text style={styles.statValue}>{amenity.maxDuration}</Text>
                            <Text style={styles.statLabel}>Duration</Text>
                        </View>
                        <View style={styles.statMiniCard}>
                            <Feather name="moon" size={24} color={Theme.colors.primary.default} />
                            <Text style={styles.statValue}>{amenity.quietHours.split(' - ')[0]}</Text>
                            <Text style={styles.statLabel}>Quiet hours</Text>
                        </View>
                    </View>

                    {/* Accordion House Rules */}
                    <View style={styles.accordionContainer}>
                        <TouchableOpacity
                            style={styles.accordionHeader}
                            activeOpacity={0.7}
                            onPress={() => setRulesOpen(!rulesOpen)}
                        >
                            <View>
                                <Text style={styles.sectionTitle}>House Rules</Text>
                                <Text style={styles.accordionPreview}>
                                    {rulesOpen ? 'Please review all rules before booking.' : `Includes ${amenity.rules.length} guidelines for use.`}
                                </Text>
                            </View>
                            <View style={styles.accordionIcon}>
                                <Feather name={rulesOpen ? "chevron-up" : "chevron-down"} size={20} color={Theme.colors.text.secondary} />
                            </View>
                        </TouchableOpacity>

                        {rulesOpen && (
                            <View style={styles.rulesList}>
                                {amenity.rules.map((rule, idx) => (
                                    <View key={idx} style={styles.ruleItem}>
                                        <View style={styles.ruleBullet}>
                                            <Feather name="check" size={14} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.ruleText}>{rule}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Usage Insights Section */}
                    <View style={styles.insightsContainer}>
                        <View style={styles.insightHeaderRow}>
                            <Text style={styles.sectionTitle}>Usage Insights</Text>
                            <View style={styles.aiIconBadge}>
                                <Feather name="bar-chart-2" size={14} color={Theme.colors.primary.default} />
                            </View>
                        </View>

                        <View style={styles.insightBox}>
                            <View style={styles.insightRow}>
                                <Feather name="calendar" size={16} color={Theme.colors.primary.default} style={styles.insightIcon} />
                                <Text style={styles.insightText}>Most booked on weekends</Text>
                            </View>
                            <View style={styles.insightDivider} />
                            <View style={styles.insightRow}>
                                <Feather name="moon" size={16} color={Theme.colors.primary.default} style={styles.insightIcon} />
                                <Text style={styles.insightText}>Evening slots fill quickly</Text>
                            </View>
                            <View style={styles.insightDivider} />
                            <View style={styles.insightRow}>
                                <Feather name="activity" size={16} color={Theme.colors.primary.default} style={styles.insightIcon} />
                                <Text style={styles.insightText}>Peak hours: 6PM–10PM</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            <View style={styles.stickyFooter}>
                <Button
                    title="Book This Amenity"
                    style={{ elevation: 4, shadowColor: Theme.colors.primary.default, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    onPress={() => router.push(`/amenities/book/date?id=${amenity.id}`)}
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
    heroContainer: {
        position: 'relative',
        height: 380,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'space-between',
    },
    headerSpacer: {
        backgroundColor: 'transparent',
    },
    heroContent: {
        padding: Theme.spacing.xl,
        paddingBottom: 40,
    },
    heroTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
        marginRight: Theme.spacing.md,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.radius.full,
        backdropFilter: 'blur(10px)',
    },
    heroRatingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    heroBadgeRow: {
        flexDirection: 'row',
        marginTop: Theme.spacing.sm,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.radius.full,
        borderWidth: 1,
    },
    heroBadgeActive: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.5)',
    },
    heroBadgeWarning: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.5)',
    },
    heroBadgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
    },
    heroBadgeDotActive: {
        backgroundColor: '#34D399',
    },
    heroBadgeDotWarning: {
        backgroundColor: '#FBBF24',
    },
    heroBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    heroBadgeTextActive: {
        color: '#A7F3D0',
    },
    heroBadgeTextWarning: {
        color: '#FDE68A',
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: Theme.spacing.xl,
    },
    statsCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statMiniCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.lg,
        padding: Theme.spacing.lg,
        marginHorizontal: 4,
        alignItems: 'center',
        ...Theme.shadows.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginTop: Theme.spacing.md,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: Theme.colors.text.secondary,
    },
    accordionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.lg,
        padding: Theme.spacing.lg,
        marginBottom: 32,
        ...Theme.shadows.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text.primary,
        marginBottom: 4,
    },
    accordionPreview: {
        fontSize: 13,
        color: Theme.colors.text.secondary,
    },
    accordionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rulesList: {
        marginTop: Theme.spacing.lg,
        paddingTop: Theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    ruleItem: {
        flexDirection: 'row',
        marginBottom: Theme.spacing.md,
        alignItems: 'flex-start',
    },
    ruleBullet: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Theme.colors.primary.default,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.md,
        marginTop: 2,
    },
    ruleText: {
        fontSize: 15,
        color: Theme.colors.text.primary,
        lineHeight: 22,
        flex: 1,
    },
    insightsContainer: {
        marginBottom: 32,
    },
    insightHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aiIconBadge: {
        marginLeft: 8,
        backgroundColor: '#F0F9FF',
        padding: 6,
        borderRadius: Theme.radius.full,
    },
    insightBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: Theme.radius.lg,
        padding: Theme.spacing.lg,
        ...Theme.shadows.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    insightIcon: {
        marginRight: 12,
        opacity: 0.8,
    },
    insightText: {
        fontSize: 15,
        color: Theme.colors.text.primary,
        fontWeight: '500',
    },
    insightDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 4,
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
