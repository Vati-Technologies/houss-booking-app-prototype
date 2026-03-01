import { Link, Stack, useRouter } from 'expo-router';
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Theme } from '../../constants/Theme';

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ImageBackground
                source={require('../../assets/images/welcome_bg_1772270903887.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={[styles.content, { paddingBottom: Math.max(Theme.spacing.xxl, insets.bottom + Theme.spacing.lg) }]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Welcome to EstateLife</Text>
                            <Text style={styles.subtitle}>Book amenities. Stay safe. Live better.</Text>
                        </View>

                        <View style={styles.actions}>
                            <Link href="/(auth)/login" asChild>
                                <Button
                                    title="Get Started"
                                    style={styles.button}
                                />
                            </Link>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    content: {
        padding: Theme.spacing.xl,
        paddingBottom: Theme.spacing.xxl,
    },
    textContainer: {
        marginBottom: Theme.spacing.xxl,
    },
    title: {
        ...Theme.typography.h1,
        color: '#FFFFFF',
        marginBottom: Theme.spacing.sm,
    },
    subtitle: {
        ...Theme.typography.bodyLg,
        color: '#E2E8F0',
        opacity: 0.9,
    },
    actions: {
        width: '100%',
    },
    button: {
        width: '100%',
    },
});
