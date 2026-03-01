import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { Theme } from '../../../constants/Theme';
import { AMENITIES } from '../../../data/amenities';
import { BOOKINGS } from '../../../data/bookings';

const { width, height } = Dimensions.get('window');

const TAGS = [
    'Cleanliness', 'Equipment malfunction', 'Noise management',
    'Lighting', 'Temperature', 'Furniture condition',
    'Security presence', 'Other'
];

export default function FeedbackScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const booking = BOOKINGS.find(b => b.id === id);
    const amenity = AMENITIES.find(a => a?.id === booking?.amenityId);

    const [rating, setRating] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [feedbackText, setFeedbackText] = useState('');
    const [allowContact, setAllowContact] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!booking || !amenity) return null;

    const handleTagPress = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const getFormTitle = () => {
        if (rating === 0) return '';
        if (rating <= 2) return 'We’re sorry. What went wrong?';
        if (rating === 3) return 'Tell us more about your experience.';
        return 'What stood out?';
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            // In a real app we'd update context/store here
            booking.reviewed = true;
            booking.rating = rating;
            booking.feedback = feedbackText;
            booking.issues = selectedTags;

            setTimeout(() => {
                router.replace('/(tabs)/bookings');
            }, 3000);
        }, 800);
    };

    const handleSkip = () => {
        router.back();
    };

    const tagColor = rating >= 4 ? Theme.colors.primary.default : Theme.colors.warning.default;
    const tagBgColor = rating >= 4 ? '#E7F8F0' : '#FFF4E5';
    const tagBorderColor = rating >= 4 ? '#C2E8D8' : '#FCE3B6';

    if (showSuccess) {
        return (
            <Animated.View style={[styles.successContainer, { paddingBottom: insets.bottom }]} entering={FadeIn.duration(400)} exiting={FadeOut}>
                <View style={styles.successContent}>
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <View style={styles.successIconWrapper}>
                            <Feather name="check" size={48} color={Theme.colors.primary.default} />
                        </View>
                    </Animated.View>
                    <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.successTitle}>
                        Thank you for helping improve your estate.
                    </Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.successMessage}>
                        {rating <= 3
                            ? "We’ve flagged this for management review."
                            : "Thanks for recognizing our team."}
                    </Animated.Text>
                </View>
            </Animated.View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <Feather name="x" size={24} color={Theme.colors.text.primary} onPress={handleSkip} style={styles.closeIcon} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{amenity.name}</Text>
                        <Text style={styles.headerSubtitle}>
                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {booking.timeSlot}
                        </Text>
                        <Text style={styles.headerSmallText}>Your session has ended.</Text>
                    </View>
                </View>

                {/* Rating Section */}
                <View style={styles.ratingSection}>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                selected={rating >= star}
                                onPress={() => setRating(star)}
                            />
                        ))}
                    </View>
                </View>

                {/* Conditional Form Sections */}
                {rating > 0 && (
                    <Animated.View entering={FadeInDown.springify()} style={styles.formSection}>
                        <Text style={styles.formTitle}>{getFormTitle()}</Text>

                        {/* Tags */}
                        <View style={styles.tagsContainer}>
                            {TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <TouchableOpacity
                                        key={tag}
                                        activeOpacity={0.7}
                                        onPress={() => handleTagPress(tag)}
                                        style={[
                                            styles.tag,
                                            isSelected && { backgroundColor: tagBgColor, borderColor: tagBorderColor }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.tagText,
                                            isSelected && { color: tagColor, fontWeight: '600' }
                                        ]}>{tag}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Suggestion Box */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Tell us how we can improve..."
                                placeholderTextColor={Theme.colors.text.muted}
                                multiline
                                maxLength={300}
                                value={feedbackText}
                                onChangeText={setFeedbackText}
                                textAlignVertical="top"
                            />
                            <Text style={styles.charCount}>{feedbackText.length}/300</Text>
                        </View>

                        {/* Toggle */}
                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleText}>Allow management to contact me about this</Text>
                            <Switch
                                value={allowContact}
                                onValueChange={setAllowContact}
                                trackColor={{ false: '#E2E8F0', true: Theme.colors.primary.default }}
                                thumbColor={'#FFFFFF'}
                                ios_backgroundColor="#E2E8F0"
                            />
                        </View>

                    </Animated.View>
                )}
            </ScrollView>

            {/* Bottom Actions */}
            <Animated.View style={[styles.bottomBar, { paddingBottom: insets.bottom || 24 }]}>
                <Button
                    title="Submit Feedback"
                    variant="primary"
                    onPress={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    loading={isSubmitting}
                    style={styles.submitBtn}
                />
                <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                    <Text style={styles.skipBtnText}>Skip for now</Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const Star = ({ selected, onPress }: { selected: boolean, onPress: () => void }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const handlePressIn = () => { scale.value = withSpring(0.8); };
    const handlePressOut = () => {
        scale.value = withSpring(1.2, {}, () => {
            scale.value = withSpring(1);
        });
        onPress();
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={animatedStyle}>
                <Feather
                    name="star"
                    size={44}
                    color={selected ? '#F5A623' : '#E2E8F0'}
                    style={{ marginHorizontal: 6 }}
                    solid={selected}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFD',
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    closeIcon: {
        marginBottom: 24,
    },
    headerTextContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        ...Theme.typography.h3,
        textAlign: 'center',
        marginBottom: 4,
    },
    headerSubtitle: {
        ...Theme.typography.body,
        color: Theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSmallText: {
        fontSize: 13,
        color: Theme.colors.text.muted,
        textAlign: 'center',
        fontWeight: '500',
    },
    ratingSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    formSection: {
        paddingHorizontal: 24,
    },
    formTitle: {
        ...Theme.typography.h4,
        textAlign: 'center',
        marginBottom: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 32,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    tagText: {
        fontSize: 14,
        color: Theme.colors.text.secondary,
        fontWeight: '500',
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Theme.shadows.soft,
        shadowOpacity: 0.02,
        marginBottom: 32,
    },
    textInput: {
        height: 100,
        fontSize: 16,
        color: Theme.colors.text.primary,
        lineHeight: 24,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: Theme.colors.text.muted,
        marginTop: 8,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    toggleText: {
        fontSize: 14,
        color: Theme.colors.text.primary,
        fontWeight: '500',
        flex: 1,
        marginRight: 16,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: 'rgba(252, 252, 253, 0.9)',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        alignItems: 'center',
    },
    submitBtn: {
        width: '100%',
        marginBottom: 16,
    },
    skipBtn: {
        paddingVertical: 8,
    },
    skipBtnText: {
        fontSize: 14,
        color: Theme.colors.text.muted,
        fontWeight: '500',
    },
    successContainer: {
        flex: 1,
        backgroundColor: '#FCFCFD',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    successContent: {
        alignItems: 'center',
    },
    successIconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E7F8F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        ...Theme.typography.h3,
        textAlign: 'center',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 16,
        color: Theme.colors.text.secondary,
        textAlign: 'center',
    }
});
