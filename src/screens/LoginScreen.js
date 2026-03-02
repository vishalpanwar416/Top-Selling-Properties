import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Demo credentials for testing (remove or replace when wiring real auth)
const DEMO_EMAIL = 'demo@credai.com';
const DEMO_PASSWORD = 'Demo@123';

const LoginScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const isInitialGate = route.params?.isInitialGate === true;

    const handleLogin = () => {
        if (!emailOrPhone.trim() || !password) return;
        const email = emailOrPhone.trim().toLowerCase();
        const isDemo = email === DEMO_EMAIL && password === DEMO_PASSWORD;
        if (isDemo) {
            if (isInitialGate) {
                navigation.replace('Main');
            } else {
                navigation.goBack();
            }
        } else {
            // TODO: call real auth API; for now show invalid
            Alert.alert('Invalid credentials', 'Use demo: ' + DEMO_EMAIL + ' / ' + DEMO_PASSWORD);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Log in</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.hero}>
                    <View style={styles.heroIconWrap}>
                        <Ionicons name="person" size={40} color="rgba(255,255,255,0.95)" />
                    </View>
                    <Text style={styles.heroTitle}>Welcome back</Text>
                    <Text style={styles.heroSubtitle}>Sign in to access your account and continue exploring properties.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Log in to your account</Text>
                    <View style={styles.demoHint}>
                        <Ionicons name="information-circle-outline" size={16} color={colors.textTertiary} />
                        <Text style={styles.demoHintText}>Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email or phone number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter email or phone"
                            placeholderTextColor={colors.textTertiary}
                            value={emailOrPhone}
                            onChangeText={setEmailOrPhone}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordWrap}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Enter password"
                                placeholderTextColor={colors.textTertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowPassword(!showPassword)}
                                hitSlop={12}
                            >
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.forgotWrap} onPress={() => {}} activeOpacity={0.7}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={handleLogin} activeOpacity={0.85}>
                        <Text style={styles.submitButtonText}>Log in</Text>
                    </TouchableOpacity>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.replace('Signup', route.params ? { isInitialGate: route.params.isInitialGate } : undefined)} activeOpacity={0.7}>
                            <Text style={styles.footerLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    placeholder: { width: 32 },
    scroll: { flex: 1 },
    scrollContent: { padding: 20, paddingTop: 20 },
    hero: {
        backgroundColor: colors.logoGreen,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    heroIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroTitle: { fontSize: 22, fontWeight: '800', color: colors.white, marginBottom: 8 },
    heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 20 },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    formTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
    demoHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        gap: 6,
    },
    demoHintText: { fontSize: 12, color: colors.textSecondary },
    inputGroup: { marginBottom: 18 },
    label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    input: {
        backgroundColor: colors.lightGray,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    passwordWrap: { position: 'relative' },
    passwordInput: { paddingRight: 48 },
    eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
    forgotWrap: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotText: { fontSize: 14, color: colors.logoGreen, fontWeight: '600' },
    submitButton: {
        backgroundColor: colors.logoGreen,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    submitButtonText: { color: colors.white, fontSize: 17, fontWeight: '700' },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
    footerText: { fontSize: 15, color: colors.textSecondary },
    footerLink: { fontSize: 15, color: colors.logoGreen, fontWeight: '700' },
});

export default LoginScreen;
