import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const AuthStartScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const isInitialGate = route.params?.isInitialGate === true;

    const handleSkip = () => {
        if (isInitialGate) {
            navigation.replace('Main');
        } else {
            navigation.goBack();
        }
    };

    const navParams = isInitialGate ? { isInitialGate: true } : undefined;

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 32 }]}>
            <TouchableOpacity
                style={[styles.skipBtn, { top: insets.top + 14 }]}
                onPress={handleSkip}
                activeOpacity={0.8}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.welcomeTitle}>Welcome</Text>
                <Text style={styles.welcomeSubtitle}>Your dream home starts here</Text>

                <View style={styles.hero}>
                    <Image
                        source={require('../../assets/logo.jpeg')}
                        style={styles.heroLogo}
                        resizeMode="contain"
                    />
                    <Text style={styles.heroSubtitle}>
                        Find your dream property. Log in or create an account to save favorites and get alerts.
                    </Text>
                </View>

                <Text style={styles.getStartedLabel}>Get started</Text>
                <View style={styles.actionsWrap}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Login', navParams)}
                        activeOpacity={0.88}
                    >
                        <Ionicons name="log-in-outline" size={22} color={colors.white} style={styles.btnIcon} />
                        <Text style={styles.primaryButtonText}>Log in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Signup', navParams)}
                        activeOpacity={0.88}
                    >
                        <Ionicons name="person-add-outline" size={22} color={colors.logoGreen} style={styles.btnIcon} />
                        <Text style={styles.secondaryButtonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5EDE7',
    },
    skipBtn: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: colors.logoGreen,
    },
    skipText: {
        fontSize: 15,
        color: colors.logoGreen,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.logoGreen,
        textAlign: 'center',
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    hero: {
        borderRadius: 28,
        paddingVertical: 36,
        paddingHorizontal: 28,
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: colors.logoGreen,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
    },
    heroLogo: {
        width: 200,
        height: 100,
        marginBottom: 24,
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        lineHeight: 23,
        paddingHorizontal: 4,
        maxWidth: 280,
    },
    getStartedLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textTertiary,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    actionsWrap: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.logoGreen,
        paddingVertical: 18,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.3,
    },
    btnIcon: {
        marginRight: 10,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 18,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: colors.logoGreen,
    },
    secondaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.logoGreen,
        letterSpacing: 0.3,
    },
});

export default AuthStartScreen;
