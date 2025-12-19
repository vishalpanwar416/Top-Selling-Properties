import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import Header from '../components/Header';
import colors from '../theme/colors';

const ContactScreen = ({ navigation }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = () => {
        if (!name || !email || !message) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        Alert.alert('Success', 'Your message has been sent! We will contact you soon.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
    };

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Contact Us</Text>
                <Text style={styles.subtitle}>Have questions? We'd love to hear from you.</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your name"
                        placeholderTextColor={colors.gray}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        placeholderTextColor={colors.gray}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+971 50 123 4567"
                        placeholderTextColor={colors.gray}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Message *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="How can we help you?"
                        placeholderTextColor={colors.gray}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Send Message</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contactInfo}>
                    <Text style={styles.infoTitle}>Other Ways to Reach Us</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📞</Text>
                        <Text style={styles.infoText}>+971 4 123 4567</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>✉️</Text>
                        <Text style={styles.infoText}>info@topsellingproperties.ae</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <Text style={styles.infoText}>Dubai Marina, Dubai, UAE</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 24,
    },
    form: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 16,
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    submitButton: {
        backgroundColor: colors.red,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    contactInfo: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIcon: {
        fontSize: 20,
        marginRight: 14,
    },
    infoText: {
        fontSize: 15,
        color: colors.textSecondary,
    },
});

export default ContactScreen;
