import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Theme } from '../../constants/Theme';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [property, setProperty] = useState('');
    const [building, setBuilding] = useState('');
    const [unit, setUnit] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = () => {
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join your estate community</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChangeText={setName}
                        />

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
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Input
                            label="Property / Estate"
                            placeholder="Select property (mock)"
                            value={property}
                            onChangeText={setProperty}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Building"
                                    placeholder="Block A"
                                    value={building}
                                    onChangeText={setBuilding}
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Unit"
                                    placeholder="e.g. 402"
                                    value={unit}
                                    onChangeText={setUnit}
                                />
                            </View>
                        </View>

                        <Button
                            title="Create Account"
                            onPress={handleSignUp}
                            loading={loading}
                            style={styles.submitButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.footerLink}>Sign In</Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    submitButton: {
        marginTop: Theme.spacing.lg,
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
