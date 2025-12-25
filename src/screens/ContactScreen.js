import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import colors from '../theme/colors';

const ContactScreen = ({ navigation }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = () => {
        if (!name || !email || !message) {
            Alert.alert('Required Fields', 'Please fill in all required fields');
            return;
        }
        Alert.alert('Success', 'Your message has been sent! We will contact you soon.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Header navigation={navigation} />
            <ScrollView 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Get In Touch</Text>
                    <Text style={styles.subtitle}>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </Text>
                </View>

                {/* Contact Form */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Send us a Message</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor={colors.textTertiary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
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
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+971 50 123 4567"
                            placeholderTextColor={colors.textTertiary}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Tell us how we can help you..."
                            placeholderTextColor={colors.textTertiary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitButtonText}>Send Message</Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Other Ways to Reach Us</Text>
                    
                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="call" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>+971 4 123 4567</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="mail" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>info@topsellingproperties.ae</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="location" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Address</Text>
                            <Text style={styles.infoValue}>Dubai Marina, Dubai, UAE</Text>
                        </View>
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
    content: {
        padding: 24,
    },
    headerSection: {
        marginBottom: 32,
    },
    title: {
        fontSize: 34,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 17,
        color: colors.textSecondary,
        lineHeight: 26,
        fontFamily: 'Lato_400Regular',
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 28,
        padding: 28,
        marginBottom: 24,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    formTitle: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 24,
        letterSpacing: -0.3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        marginBottom: 10,
        letterSpacing: 0.1,
    },
    input: {
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    textArea: {
        height: 140,
        paddingTop: 16,
    },
    submitButton: {
        backgroundColor: colors.secondary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 17,
        fontFamily: 'Lato_700Bold',
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 28,
        padding: 28,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    infoTitle: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 24,
        letterSpacing: -0.3,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    infoIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: colors.textTertiary,
        marginBottom: 4,
        fontFamily: 'Lato_400Regular',
    },
    infoValue: {
        fontSize: 17,
        color: colors.textPrimary,
        fontFamily: 'Lato_400Regular',
    },
});

export default ContactScreen;
