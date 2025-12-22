import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const PostPropertyScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post Property</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="home" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.title}>Post Your Property</Text>
                    <Text style={styles.subtitle}>
                        Sell or rent faster with 99acres. List your property and reach thousands of potential buyers.
                    </Text>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color={colors.white} style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Why Post on 99acres?</Text>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Reach millions of property seekers</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Free listing for dealers</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Quick verification process</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Professional support</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        flex: 1,
    },
});

export default PostPropertyScreen;

