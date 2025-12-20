import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

const NewProjectCard = ({ project, onPress }) => {
    if (!project) {
        return null;
    }

    const formatPrice = (price) => {
        if (!price) return 'AED N/A';
        if (price >= 1000000) {
            return `AED ${(price / 1000000).toFixed(1)}M`;
        }
        if (price >= 1000) {
            return `AED ${(price / 1000).toFixed(0)}K`;
        }
        return `AED ${price.toLocaleString()}`;
    };

    const handleWhatsApp = () => {
        const message = `Hi, I'm interested in ${project.title}`;
        const phoneNumber = '+971500000000'; // Replace with actual number
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert('WhatsApp is not installed');
        });
    };

    return (
        <View style={styles.container}>
            {/* Image Container */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: project.images && project.images[0] ? project.images[0] : 'https://via.placeholder.com/400x250' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={1}>{project.title || 'Project Name'}</Text>
                
                {/* Property Type */}
                <Text style={styles.propertyType}>{project.type || 'Apartments'}</Text>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={16} color={colors.textSecondary} />
                    <Text style={styles.location} numberOfLines={1}>{project.location || 'Location not available'}</Text>
                </View>

                {/* Price & Handover Info */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Launch Price</Text>
                        <Text style={styles.infoValue}>{formatPrice(project.launchPrice || project.price)}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Handover</Text>
                        <Text style={styles.infoValue}>{project.handover || 'Q1 2025'}</Text>
                    </View>
                </View>

                {/* WhatsApp Button */}
                <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp} activeOpacity={0.8}>
                    <Ionicons name="logo-whatsapp" size={20} color={colors.success} />
                    <Text style={styles.whatsappText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginRight: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    propertyType: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    location: {
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
        marginLeft: 4,
        fontWeight: '400',
    },
    infoRow: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    infoDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },
    whatsappButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(72, 187, 120, 0.1)',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(72, 187, 120, 0.3)',
    },
    whatsappText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.success,
        marginLeft: 8,
    },
});

export default NewProjectCard;

