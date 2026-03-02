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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const SignupScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isInitialGate = route.params?.isInitialGate === true;

    const handleSignup = () => {
        if (!name.trim() || !email.trim() || !password) return;
        if (password !== confirmPassword) return;
        // TODO: wire to auth
        if (isInitialGate) {
            navigation.replace('Main');
        } else {
            navigation.goBack();
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
                <Text style={styles.headerTitle}>Sign up</Text>
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
                        <Ionicons name="person-add" size={40} color="rgba(255,255,255,0.95)" />
                    </View>
                    <Text style={styles.heroTitle}>Create account</Text>
                    <Text style={styles.heroSubtitle}>Join Credai to save favorites, get alerts, and connect with agents.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Create your account</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor={colors.textTertiary}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your.email@example.com"
                            placeholderTextColor={colors.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+91 98765 43210"
                            placeholderTextColor={colors.textTertiary}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordWrap}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Create a password (min 6 characters)"
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm password</Text>
                        <View style={styles.passwordWrap}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Confirm your password"
                                placeholderTextColor={colors.textTertiary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                hitSlop={12}
                            >
                                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSignup} activeOpacity={0.85}>
                        <Text style={styles.submitButtonText}>Create account</Text>
                    </TouchableOpacity>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.replace('Login', isInitialGate ? { isInitialGate: true } : undefined)} activeOpacity={0.7}>
                            <Text style={styles.footerLink}>Log in</Text>
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
    formTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 20 },
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
    submitButton: {
        backgroundColor: colors.logoGreen,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: { color: colors.white, fontSize: 17, fontWeight: '700' },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
    footerText: { fontSize: 15, color: colors.textSecondary },
    footerLink: { fontSize: 15, color: colors.logoGreen, fontWeight: '700' },
});

export default SignupScreen;
