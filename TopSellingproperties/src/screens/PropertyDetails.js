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
                        style={[styles.backButton, { top: insets.top + 10 }]}
                        onPress={() => navigation.goBack()}
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
                    <Text style={styles.price}>{formatPrice(property.price)}</Text>
                    <Text style={styles.title}>{property.title}</Text>

                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.location}>{property.location}</Text>
                    </View>

                    {/* Property Features */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🛏</Text>
                            <Text style={styles.featureValue}>{property.bedrooms || 'Studio'}</Text>
                            <Text style={styles.featureLabel}>Bedrooms</Text>
                        </View>
                        <View style={styles.featureDivider} />
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🚿</Text>
                            <Text style={styles.featureValue}>{property.bathrooms}</Text>
                            <Text style={styles.featureLabel}>Bathrooms</Text>
                        </View>
                        <View style={styles.featureDivider} />
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📐</Text>
                            <Text style={styles.featureValue}>{property.area.toLocaleString()}</Text>
                            <Text style={styles.featureLabel}>{property.areaUnit}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {/* Amenities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Amenities</Text>
                        <View style={styles.amenitiesGrid}>
                            {property.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Text style={styles.amenityCheck}>✓</Text>
                                    <Text style={styles.amenityText}>{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Agent */}
                    {property.agent && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contact Agent</Text>
                            <View style={styles.agentCard}>
                                <View style={styles.agentAvatar}>
                                    <Text style={styles.agentInitial}>{property.agent.name ? property.agent.name[0] : 'A'}</Text>
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

            {/* Bottom Action Buttons */}
            <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 10 }]}>
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Text style={styles.callButtonText}>📞 Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
                    <Text style={styles.emailButtonText}>✉️ Email</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: width,
        height: 300,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    imageIndicators: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: colors.white,
        width: 24,
    },
    typeBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: colors.maroon,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 4,
    },
    typeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    content: {
        padding: 20,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.maroon,
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    location: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    featuresContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    featureItem: {
        flex: 1,
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    featureValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    featureLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    featureDivider: {
        width: 1,
        backgroundColor: colors.border,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.textSecondary,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 12,
    },
    amenityCheck: {
        fontSize: 14,
        color: colors.red,
        marginRight: 8,
        fontWeight: 'bold',
    },
    amenityText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    agentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        padding: 16,
    },
    agentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.maroon,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    agentInitial: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    agentInfo: {
        flex: 1,
    },
    agentName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    agentPhone: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    callButton: {
        flex: 1,
        backgroundColor: colors.red,
        paddingVertical: 16,
        borderRadius: 12,
        marginRight: 8,
        alignItems: 'center',
    },
    callButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    emailButton: {
        flex: 1,
        backgroundColor: colors.maroon,
        paddingVertical: 16,
        borderRadius: 12,
        marginLeft: 8,
        alignItems: 'center',
    },
    emailButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PropertyDetails;
