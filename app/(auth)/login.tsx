import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Theme } from '../../constants/Theme';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="" showBack={true} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>Welcome back to EstateLife</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email address"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.submitButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.footerLink}>Create account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background.app,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Theme.spacing.md,
        justifyContent: 'center',
    },
    header: {
        marginBottom: Theme.spacing.xl,
    },
    title: {
        ...Theme.typography.h1,
        marginBottom: Theme.spacing.xs,
    },
    subtitle: {
        ...Theme.typography.bodyLg,
    },
    form: {
        marginBottom: Theme.spacing.xl,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: Theme.spacing.lg,
    },
    forgotPasswordText: {
        ...Theme.typography.body,
        color: Theme.colors.primary.default,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: Theme.spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: Theme.spacing.xl,
    },
    footerText: {
        ...Theme.typography.body,
    },
    footerLink: {
        ...Theme.typography.body,
        color: Theme.colors.primary.default,
        fontWeight: '600',
    },
});
