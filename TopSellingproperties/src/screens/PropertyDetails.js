import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

const PropertyDetails = ({ route, navigation }) => {
    const { property } = route.params || {};
    const insets = useSafeAreaInsets();
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    
    if (!property) {
        return (
            <View style={styles.container}>
                <Text>Property not found</Text>
            </View>
        );
    }
    
    const images = property.images && property.images.length > 0 ? property.images : ['https://via.placeholder.com/400x300'];

    const formatPrice = (price) => {
        return `AED ${price.toLocaleString()}`;
    };

    const handleCall = () => {
        if (property.agent && property.agent.phone) {
            Linking.openURL(`tel:${property.agent.phone}`);
        }
    };

    const handleEmail = () => {
        if (property.agent && property.agent.email) {
            Linking.openURL(`mailto:${property.agent.email}?subject=Inquiry about ${property.title}`);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setCurrentImageIndex(index);
                        }}
                    >
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {/* Back Button */}
                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 16 }]}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>

                    {/* Image Indicators */}
                    {images.length > 1 && (
                        <View style={styles.imageIndicators}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        currentImageIndex === index && styles.activeIndicator
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Type Badge */}
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{property.type.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Price and Title Section */}
                    <View style={styles.priceSection}>
                        <Text style={styles.price}>{formatPrice(property.price)}</Text>
                        <Text style={styles.title}>{property.title}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={18} color={colors.textSecondary} style={styles.locationIcon} />
                        <Text style={styles.location}>{property.location}</Text>
                    </View>
                    </View>

                    {/* Property Features - Modern Cards */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureCard}>
                            <Text style={styles.featureIcon}>🛏️</Text>
                            <Text style={styles.featureValue}>{property.bedrooms || 'Studio'}</Text>
                            <Text style={styles.featureLabel}>Bedrooms</Text>
                        </View>
                        <View style={styles.featureCard}>
                            <Text style={styles.featureIcon}>🚿</Text>
                            <Text style={styles.featureValue}>{property.bathrooms}</Text>
                            <Text style={styles.featureLabel}>Bathrooms</Text>
                        </View>
                        <View style={styles.featureCard}>
                            <Text style={styles.featureIcon}>📐</Text>
                            <Text style={styles.featureValue}>{property.area.toLocaleString()}</Text>
                            <Text style={styles.featureLabel}>{property.areaUnit}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About This Property</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {/* Amenities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Amenities & Features</Text>
                        <View style={styles.amenitiesGrid}>
                            {property.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityChip}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.secondary} style={styles.amenityCheck} />
                                    <Text style={styles.amenityText}>{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Agent Card */}
                    {property.agent && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contact Agent</Text>
                            <View style={styles.agentCard}>
                                <View style={styles.agentAvatar}>
                                    <Text style={styles.agentInitial}>
                                        {property.agent.name ? property.agent.name[0] : 'A'}
                                    </Text>
                                </View>
                                <View style={styles.agentInfo}>
                                    <Text style={styles.agentName}>{property.agent.name || 'Agent'}</Text>
                                    <Text style={styles.agentPhone}>{property.agent.phone || 'N/A'}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Action Buttons - Modern Design */}
            <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity 
                    style={styles.callButton} 
                    onPress={handleCall}
                    activeOpacity={0.8}
                >
                    <Text style={styles.callButtonIcon}>📞</Text>
                    <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.emailButton} 
                    onPress={handleEmail}
                    activeOpacity={0.8}
                >
                    <Text style={styles.emailButtonIcon}>✉️</Text>
                    <Text style={styles.emailButtonText}>Send Email</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    imageContainer: {
        position: 'relative',
        height: 400,
    },
    image: {
        width: width,
        height: 400,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        backgroundColor: colors.white,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    backButtonText: {
        color: colors.primary,
        fontSize: 28,
        fontWeight: '600',
    },
    imageIndicators: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: colors.white,
        width: 32,
        height: 8,
        borderRadius: 4,
    },
    typeBadge: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        backgroundColor: 'rgba(122, 30, 62, 0.95)',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    typeText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    content: {
        padding: 24,
    },
    priceSection: {
        marginBottom: 24,
    },
    price: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
        lineHeight: 32,
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: 8,
    },
    location: {
        fontSize: 17,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    featuresContainer: {
        flexDirection: 'row',
        marginBottom: 32,
        gap: 12,
    },
    featureCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    featureValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    featureLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 16,
        lineHeight: 26,
        color: colors.textSecondary,
        letterSpacing: 0.1,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    amenityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 8,
    },
    amenityCheck: {
        marginRight: 8,
    },
    amenityText: {
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    agentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    agentAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    agentInitial: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.white,
    },
    agentInfo: {
        flex: 1,
    },
    agentName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    agentPhone: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingTop: 20,
        backgroundColor: colors.white,
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 12,
        gap: 12,
    },
    callButton: {
        flex: 1,
        backgroundColor: colors.secondary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    callButtonIcon: {
        marginRight: 8,
    },
    callButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    emailButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    emailButtonIcon: {
        marginRight: 8,
    },
    emailButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default PropertyDetails;
