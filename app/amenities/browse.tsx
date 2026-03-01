import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Header } from '../../components/ui/Header';
import { Theme } from '../../constants/Theme';
import { AMENITIES } from '../../data/amenities';

export default function BrowseAmenitiesScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Header title="All Amenities" showBack={true} />

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {AMENITIES.map(amenity => (
                    <TouchableOpacity
                        key={amenity.id}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/amenities/${amenity.id}`)}
                    >
                        <Card style={styles.card} noPadding>
                            <Image source={amenity.image} style={styles.image} />

                            <View style={styles.content}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.title} numberOfLines={1}>{amenity.name}</Text>
                                    <Chip
                                        label={amenity.status}
                                        variant={amenity.status === 'Clean & Ready' ? 'default' : amenity.status === 'Available' ? 'success' : 'warning'}
                                        size="sm"
                                    />
                                </View>

                                <View style={styles.tags}>
                                    {amenity.tags.map(tag => (
                                        <Text key={tag} style={styles.tagText}>#{tag}  </Text>
                                    ))}
                                </View>

                                <View style={styles.metaRow}>
                                    <Text style={styles.metaText}>Up to {amenity.capacity} guests</Text>
                                    <Text style={styles.metaText}>• {amenity.maxDuration}</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background.app,
    },
    list: {
        padding: Theme.spacing.md,
        paddingBottom: 40,
    },
    card: {
        marginBottom: Theme.spacing.lg,
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: Theme.spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.xs,
    },
    title: {
        ...Theme.typography.h3,
        flex: 1,
        marginRight: 8,
    },
    tags: {
        flexDirection: 'row',
        marginBottom: Theme.spacing.md,
    },
    tagText: {
        ...Theme.typography.caption,
        color: Theme.colors.primary.default,
    },
    metaRow: {
        flexDirection: 'row',
    },
    metaText: {
        ...Theme.typography.bodySm,
        marginRight: 8,
    },
});
