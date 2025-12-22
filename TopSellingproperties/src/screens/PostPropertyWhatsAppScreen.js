import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const PostPropertyWhatsAppScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const handleWhatsAppPress = () => {
        // Replace with your WhatsApp business number
        const phoneNumber = '971501234567'; // UAE format
        const message = 'Hello, I would like to post my property.';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    // Fallback to web WhatsApp
                    const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    return Linking.openURL(webUrl);
                }
            })
            .catch((err) => console.error('Error opening WhatsApp:', err));
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post via WhatsApp</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="whatsapp" size={64} color="#25D366" />
                    </View>
                    <Text style={styles.title}>Post Property via WhatsApp</Text>
                    <Text style={styles.subtitle}>
                        Faster property posting experience. Chat directly with our team and get your property listed quickly.
                    </Text>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: '#25D366' }]}
                        onPress={handleWhatsAppPress}
                    >
                        <MaterialCommunityIcons name="whatsapp" size={24} color={colors.white} />
                        <Text style={[styles.buttonText, { marginLeft: 8 }]}>Open WhatsApp</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Benefits of WhatsApp Posting</Text>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Instant communication</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Share photos directly</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Quick response time</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.infoText, { marginLeft: 12 }]}>Easy property details sharing</Text>
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
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#25D366' + '15',
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
        backgroundColor: '#25D366',
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

export default PostPropertyWhatsAppScreen;

