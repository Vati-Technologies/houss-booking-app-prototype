import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Theme } from '../../constants/Theme';
import { AMENITIES } from '../../data/amenities';
import { BOOKINGS } from '../../data/bookings';
import { CURRENT_USER } from '../../data/misc';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;
const REC_CARD_WIDTH = width * 0.75;

const RECOMMENDATIONS = [
  {
    id: 'rec1',
    amenityId: '3',
    name: 'Private Cinema Room',
    session: 'Movie Night',
    datetime: 'Fri, 8:00 PM',
    insight: 'Popular with residents',
    image: AMENITIES.find(a => a.id === '3')?.image,
  },
  {
    id: 'rec2',
    amenityId: '1',
    name: 'Rooftop Pool & Lounge',
    session: 'Sunset Swim',
    datetime: 'Sat, 5:00 PM',
    insight: '8 residents joining',
    image: AMENITIES.find(a => a.id === '1')?.image,
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const upcomingBooking = BOOKINGS.find(b => b.status === 'Confirmed');
  const bookedAmenity = upcomingBooking ? AMENITIES.find(a => a.id === upcomingBooking.amenityId) : null;

  const needsReviewBooking = BOOKINGS.find(b => b.status === 'Completed' && b.reviewed === false);
  const reviewAmenity = needsReviewBooking ? AMENITIES.find(a => a.id === needsReviewBooking.amenityId) : null;

  // Simulate greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* TOP SECTION: Personal Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {CURRENT_USER.name.split(' ')[0]}</Text>
            <Text style={styles.subGreeting}>{CURRENT_USER.unit} · {CURRENT_USER.building}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{CURRENT_USER.name.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Dynamic Estate Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>All Systems Operational</Text>
        </View>

        {/* SECTION: Smart Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
            snapToInterval={170 + Theme.spacing.md}
            decelerationRate="fast"
          >
            {[
              { id: 'book', title: 'Book Amenity', icon: 'calendar', route: '/amenities/browse', image: require('../../assets/images/clubhouse.png'), color: Theme.colors.primary.default },
              { id: 'issue', title: 'Log Issue', icon: 'tool', route: '/(tabs)/maintenance', image: require('../../assets/images/meeting_room_1772270884890.png'), color: Theme.colors.warning.default },
              { id: 'security', title: 'Security', icon: 'shield', route: '/(tabs)/security', image: require('../../assets/images/private_cinema.png'), color: Theme.colors.danger.default },
              { id: 'bookings', title: 'My Bookings', icon: 'list', route: '/(tabs)/bookings', image: require('../../assets/images/swimming_pool_1772270867118.png'), color: Theme.colors.primary.default },
            ].map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionTabCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={action.image}
                  style={styles.actionTabImageBackground}
                  imageStyle={{ borderRadius: Theme.radius.xl }}
                >
                  <View style={styles.actionTabOverlay}>
                    <View style={styles.actionTabIconWrapper}>
                      <Feather name={action.icon as any} size={20} color={action.color} />
                    </View>
                    <Text style={styles.actionTabText}>{action.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION: Pending Feedback */}
        {needsReviewBooking && reviewAmenity && (
          <View style={styles.section}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/booking/feedback/${needsReviewBooking.id}` as any)}>
              <Card style={[styles.bookingCard, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 }]} noPadding>
                <View style={[styles.bookingHeaderSplit, { paddingVertical: 20, borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: Theme.colors.warning.default, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Needs Review</Text>
                    <Text style={styles.bookingAmenityName}>How was your {reviewAmenity.name} session?</Text>
                    <Text style={styles.bookingDateTime}>Your booking ended at {needsReviewBooking.timeSlot.split(' - ')[1]}</Text>
                  </View>
                  <View style={{ justifyContent: 'center', paddingLeft: 16 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name="star" size={20} color={Theme.colors.warning.default} />
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#F8FAFC', borderBottomLeftRadius: Theme.radius.xl, borderBottomRightRadius: Theme.radius.xl }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: Theme.colors.text.primary }}>⭐ Leave Feedback</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION: Your Upcoming Booking */}
        {upcomingBooking && bookedAmenity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Upcoming Booking</Text>
            <Card style={styles.bookingCard} noPadding>
              <View style={styles.bookingCardInner}>
                <View style={styles.bookingHeaderSplit}>
                  <View style={styles.bookingInfoLeft}>
                    <Text style={styles.bookingAmenityName}>{bookedAmenity.name}</Text>
                    <Text style={styles.bookingDateTime}>{upcomingBooking.date} • {upcomingBooking.timeSlot}</Text>
                    <View style={styles.bookingMetaRow}>
                      <Feather name="users" size={14} color={Theme.colors.text.secondary} />
                      <Text style={styles.bookingMetaText}>{upcomingBooking.guestCount} Guests</Text>
                    </View>
                  </View>
                  <View style={styles.countdownContainer}>
                    <Feather name="clock" size={16} color={Theme.colors.primary.default} style={{ marginBottom: 4 }} />
                    <Text style={styles.countdownValue}>In 5 Days</Text>
                  </View>
                </View>

                <View style={styles.bookingActionsRow}>
                  <TouchableOpacity style={styles.bookingActionBtn}>
                    <Text style={styles.bookingActionText}>Modify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bookingActionBtn}>
                    <Text style={styles.bookingActionText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bookingActionBtn, styles.bookingActionPrimary]} onPress={() => router.push(`/booking/${upcomingBooking.id}` as any)}>
                    <Feather name="grid" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={[styles.bookingActionText, { color: '#FFFFFF' }]}>Access QR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* SECTION: Amenity Intelligence Snapshot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Amenity Readiness</Text>
            <TouchableOpacity onPress={() => router.push('/amenities/browse')} activeOpacity={0.6}>
              <Text style={styles.seeAll}>View Directory</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            snapToInterval={CARD_WIDTH + Theme.spacing.md}
            decelerationRate="fast"
          >
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity.id}
                activeOpacity={0.9}
                onPress={() => router.push(`/amenities/${amenity.id}`)}
              >
                <ImageBackground
                  source={amenity.image}
                  style={styles.readinessCard}
                  imageStyle={{ borderRadius: Theme.radius.lg }}
                >
                  <View style={styles.readinessOverlay}>
                    <View style={styles.readinessTop}>
                      <Chip
                        label={amenity.status}
                        variant={amenity.status === 'Clean & Ready' ? 'default' : amenity.status === 'Available' ? 'success' : 'warning'}
                        size="sm"
                      />
                    </View>
                    <View style={styles.readinessBottom}>
                      <Text style={styles.readinessName} numberOfLines={1}>{amenity.name}</Text>
                      <View style={styles.readinessInsight}>
                        <Feather name="clock" size={12} color="#E2E8F0" />
                        <Text style={styles.readinessInsightText}>Next available: {amenity.id === '1' ? '14:00 Today' : 'Tomorrow'}</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION: Recommended for You (AI Driven) */}
        <View style={styles.section}>
          <View style={styles.recHeaderRow}>
            <View style={styles.recTitleRow}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <View style={styles.aiBadge}>
                <Feather name="zap" size={14} color={Theme.colors.primary.default} />
              </View>
            </View>
            <Text style={styles.aiInsightText}>Based on your recent activity</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            snapToInterval={REC_CARD_WIDTH + Theme.spacing.md}
            decelerationRate="fast"
          >
            {RECOMMENDATIONS.map((rec) => (
              <TouchableOpacity
                key={rec.id}
                activeOpacity={0.9}
                onPress={() => router.push(`/amenities/${rec.amenityId}`)}
              >
                <ImageBackground
                  source={rec.image}
                  style={styles.recCard}
                  imageStyle={{ borderRadius: Theme.radius.xl }}
                >
                  <View style={styles.recOverlay}>
                    <View style={styles.recTop}>
                      <View style={styles.insightPill}>
                        <Feather name="trending-up" size={12} color={Theme.colors.primary.default} />
                        <Text style={styles.insightPillText}>{rec.insight}</Text>
                      </View>
                    </View>
                    <View style={styles.recBottom}>
                      <Text style={styles.recSessionName} numberOfLines={1}>{rec.session}</Text>
                      <Text style={styles.recAmenityName} numberOfLines={1}>{rec.name}</Text>

                      <View style={styles.recFooterRow}>
                        <View style={styles.recDateTime}>
                          <Feather name="calendar" size={14} color="#E2E8F0" />
                          <Text style={styles.recDateTimeText}>{rec.datetime}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.recJoinBtn}
                          onPress={() => router.push(`/amenities/${rec.amenityId}`)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.recJoinBtnText}>Join Session</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slightly cooler background for premium feel
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subGreeting: {
    ...Theme.typography.body,
    color: Theme.colors.text.secondary,
    fontWeight: '500',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary.default,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.soft,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Theme.radius.full,
    alignSelf: 'flex-start',
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
  },
  quickActionsContainer: {
    marginHorizontal: -Theme.spacing.lg, // Make it bleed to edges
    marginBottom: 32,
  },
  quickActionsScroll: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: 4,
  },
  actionTabCard: {
    width: 170,
    height: 180, // Even larger tab size
    marginRight: Theme.spacing.md,
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    ...Theme.shadows.card,
  },
  actionTabImageBackground: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.radius.xl,
  },
  actionTabOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)', // Dark premium overlay
    padding: Theme.spacing.md,
    justifyContent: 'space-between',
    borderRadius: Theme.radius.xl,
  },
  actionTabIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White circle behind icon
  },
  actionTabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  seeAll: {
    ...Theme.typography.bodySm,
    color: Theme.colors.primary.default,
    fontWeight: '600',
    marginBottom: 2,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.radius.xl,
    ...Theme.shadows.card,
  },
  bookingCardInner: {
    padding: 0,
  },
  bookingHeaderSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bookingInfoLeft: {
    flex: 1,
  },
  bookingAmenityName: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: 6,
  },
  bookingDateTime: {
    fontSize: 14,
    color: Theme.colors.text.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  bookingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingMetaText: {
    fontSize: 13,
    color: Theme.colors.text.secondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  countdownContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    minWidth: 80,
  },
  countdownValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary.default,
  },
  bookingActionsRow: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  bookingActionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.radius.md,
    marginHorizontal: 4,
    backgroundColor: '#F8FAFC',
  },
  bookingActionPrimary: {
    backgroundColor: Theme.colors.primary.default,
    flexDirection: 'row',
    flex: 1.5,
  },
  bookingActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  horizontalScroll: {
    paddingRight: Theme.spacing.lg,
    paddingVertical: 4,
  },
  readinessCard: {
    width: CARD_WIDTH,
    height: 180,
    marginRight: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
  },
  readinessOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: Theme.spacing.md,
    justifyContent: 'space-between',
    borderRadius: Theme.radius.lg,
  },
  readinessTop: {
    alignItems: 'flex-start',
  },
  readinessBottom: {
    marginTop: 'auto',
  },
  readinessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  readinessInsight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readinessInsightText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E2E8F0',
    marginLeft: 6,
  },
  recHeaderRow: {
    marginBottom: 16,
  },
  recTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiBadge: {
    marginLeft: 8,
    backgroundColor: '#F0F9FF',
    padding: 6,
    borderRadius: Theme.radius.full,
    ...Theme.shadows.soft,
  },
  aiInsightText: {
    fontSize: 13,
    color: Theme.colors.text.secondary,
    fontWeight: '500',
  },
  recCard: {
    width: REC_CARD_WIDTH,
    height: 200,
    marginRight: Theme.spacing.md,
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    ...Theme.shadows.card,
  },
  recOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Slightly softer overlay
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
    borderRadius: Theme.radius.xl,
  },
  recTop: {
    alignItems: 'flex-start',
  },
  insightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
  },
  insightPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary.default,
    marginLeft: 6,
  },
  recBottom: {
    marginTop: 'auto',
  },
  recSessionName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  recAmenityName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
    marginBottom: 12,
  },
  recFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recDateTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  recJoinBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Theme.radius.full,
  },
  recJoinBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primary.default,
  }
});
