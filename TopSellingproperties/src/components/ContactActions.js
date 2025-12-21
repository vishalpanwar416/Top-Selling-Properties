import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const ContactActions = ({ 
    phone, 
    email, 
    whatsappMessage, 
    emailSubject,
    contactName,
    style,
    buttonStyle,
    whatsappButtonStyle
}) => {
    const insets = useSafeAreaInsets();

    const handleCall = () => {
        const phoneNumber = phone || '+971500000000';
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmail = () => {
        const emailAddress = email || 'info@topsellingproperties.ae';
        const subject = emailSubject || (contactName ? `Inquiry about ${contactName}` : 'Property Inquiry');
        Linking.openURL(`mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`);
    };

    const handleWhatsApp = () => {
        const phoneNumber = phone || '+971500000000';
        // Remove all non-digit characters except + for WhatsApp
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
        // Remove + and leading zeros, ensure it starts with country code
        const whatsappPhone = cleanPhone.replace(/^\+/, '').replace(/^0+/, '');
        const message = whatsappMessage || (contactName ? `Hi ${contactName}, I'm interested in your services` : 'Hi, I\'m interested in your services');

        // Try WhatsApp app first, fallback to web
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
        const whatsappAppUrl = `whatsapp://send?phone=${whatsappPhone}&text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(whatsappAppUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(whatsappAppUrl);
                } else {
                    return Linking.openURL(whatsappUrl);
                }
            })
            .catch((err) => {
                // Fallback to web version
                Linking.openURL(whatsappUrl);
            });
    };

    return (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }, style]}>
            <TouchableOpacity 
                style={[styles.bottomButton, buttonStyle]} 
                onPress={handleEmail}
                activeOpacity={0.8}
            >
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
                <Text style={styles.bottomButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.bottomButton, buttonStyle]} 
                onPress={handleCall}
                activeOpacity={0.8}
            >
                <Ionicons name="call-outline" size={20} color={colors.primary} />
                <Text style={styles.bottomButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.bottomButtonWhatsApp, whatsappButtonStyle]} 
                onPress={handleWhatsApp}
                activeOpacity={0.8}
            >
                <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 100,
    },
    bottomButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    bottomButtonText: {
        color: colors.primary,
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        marginLeft: 8,
    },
    bottomButtonWhatsApp: {
        width: 56,
        height: 46,
        borderRadius: 12,
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25D366',
    },
});

export default ContactActions;
