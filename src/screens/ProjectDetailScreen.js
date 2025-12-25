import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking,
    Animated,
    FlatList,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LikeButton from '../components/LikeButton';
import colors from '../theme/colors';
import projectsData from '../data/projects.json';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Utility Functions
const formatPrice = (price) => {
    if (!price) return 'AED N/A';
    if (price >= 1000000) {
        return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${price.toLocaleString()}`;
};

const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${area.toLocaleString()} sqft`;
};

// Property Card Component
const PropertyCard = memo(({ property, projectName, onPress, onWhatsApp, onCall }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = property.images || [];

    const handleNextImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    const handlePrevImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    return (
        <View style={styles.propertyCard}>
            {/* Image Carousel */}
            <TouchableOpacity activeOpacity={0.95} onPress={() => onPress(property)}>
                <View style={styles.imageCarousel}>
                    <Image
                        source={{ uri: images[currentImageIndex] || 'https://via.placeholder.com/400x250' }}
                        style={styles.propertyImage}
                        resizeMode="cover"
                    />

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.35)']}
                        locations={[0, 0.5, 1]}
                        style={styles.imageGradient}
                    />

                    {/* Status Badge */}
                    <View style={styles.topBadges}>
                        <View style={[styles.statusBadge, property.status === 'Available' ? styles.availableBadge : styles.soldBadge]}>
                            <Text style={styles.statusBadgeText}>{property.status}</Text>
                        </View>
                        {property.view && (
                            <View style={styles.viewBadge}>
                                <Ionicons name="eye" size={10} color="#fff" />
                                <Text style={styles.viewBadgeText}>{property.view}</Text>
                            </View>
                        )}
                    </View>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <TouchableOpacity
                                style={[styles.navArrow, styles.navArrowLeft]}
                                onPress={handlePrevImage}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="chevron-back" size={18} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.navArrow, styles.navArrowRight]}
                                onPress={handleNextImage}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="chevron-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Image Dots */}
                    <View style={styles.imageDots}>
                        {images.slice(0, 5).map((_, idx) => (
                            <View
                                key={idx}
                                style={[styles.dot, currentImageIndex === idx && styles.activeDot]}
                            />
                        ))}
                    </View>

                    {/* Favorite Button */}
                    <LikeButton
                        size={20}
                        likedColor="#FF4757"
                        unlikedColor="#fff"
                        buttonStyle={styles.favoriteButton}
                    />
                </View>
            </TouchableOpacity>

            {/* Property Info */}
            <View style={styles.propertyInfo}>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(property.price)}</Text>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{property.type}</Text>
                    </View>
                </View>

                <Text style={styles.propertyTitle} numberOfLines={2}>
                    {property.title}
                </Text>

                {/* Specs */}
                <View style={styles.specsRow}>
                    <View style={styles.specItem}>
                        <Ionicons name="bed-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.specText}>{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                        <Ionicons name="water-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.specText}>{property.bathrooms}</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                        <MaterialCommunityIcons name="vector-square" size={16} color={colors.textSecondary} />
                        <Text style={styles.specText}>{formatArea(property.area)}</Text>
                    </View>
                </View>

                {/* Floor & View */}
                <View style={styles.detailsRow}>
                    {property.floor && (
                        <View style={styles.detailItem}>
                            <Ionicons name="layers-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.detailText}>Floor: {property.floor}</Text>
                        </View>
                    )}
                </View>

                {/* Tags */}
                {property.tags && property.tags.length > 0 && (
                    <View style={styles.tagsRow}>
                        {property.tags.slice(0, 3).map((tag, idx) => (
                            <View key={idx} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.contactButtons}>
                    <TouchableOpacity style={styles.emailButton} onPress={() => onCall(property)} activeOpacity={0.8}>
                        <Ionicons name="call-outline" size={16} color={colors.primary} />
                        <Text style={styles.emailButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.whatsappButton}
                        onPress={() => onWhatsApp(property)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                        <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

// Suggestion Project Card
const SuggestionCard = memo(({ project, onPress }) => (
    <TouchableOpacity style={styles.suggestionCard} onPress={() => onPress(project)} activeOpacity={0.9}>
        <Image
            source={{ uri: project.images?.[0] || 'https://via.placeholder.com/300x200' }}
            style={styles.suggestionImage}
            resizeMode="cover"
        />
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.suggestionGradient}
        />
        <View style={styles.suggestionInfo}>
            <Text style={styles.suggestionName} numberOfLines={1}>{project.name}</Text>
            <Text style={styles.suggestionLocation} numberOfLines={1}>{project.location}</Text>
            <Text style={styles.suggestionPrice}>{project.priceRange}</Text>
        </View>
        {project.featured && (
            <View style={styles.featuredBadge}>
                <Ionicons name="star" size={10} color="#FFD700" />
            </View>
        )}
    </TouchableOpacity>
));

// Amenity Item
const AmenityItem = memo(({ amenity }) => (
    <View style={styles.amenityItem}>
        <View style={styles.amenityIcon}>
            <Ionicons name="checkmark" size={14} color={colors.primary} />
        </View>
        <Text style={styles.amenityText}>{amenity}</Text>
    </View>
));

// Nearby Place Item
const NearbyItem = memo(({ place }) => (
    <View style={styles.nearbyItem}>
        <View style={styles.nearbyIcon}>
            <Ionicons name="location" size={14} color={colors.primary} />
        </View>
        <View style={styles.nearbyInfo}>
            <Text style={styles.nearbyName}>{place.name}</Text>
            <Text style={styles.nearbyDistance}>{place.distance}</Text>
        </View>
    </View>
));

// Main Component
const ProjectDetailScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { project: passedProject } = route.params;
    const scrollY = useRef(new Animated.Value(0)).current;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('properties');

    // Get full project data with properties
    const project = useMemo(() => {
        const found = projectsData.projects.find(p => p.id === passedProject.id);
        return found || passedProject;
    }, [passedProject]);

    const images = project.images || [];

    // Get suggested projects (exclude current project)
    const suggestedProjects = useMemo(() => {
        return projectsData.projects
            .filter(p => p.id !== project.id)
            .slice(0, 4);
    }, [project.id]);

    // Header opacity animation
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Callbacks
    const handlePropertyPress = useCallback((property) => {
        navigation.navigate('PropertyDetails', {
            property: {
                ...property,
                projectName: project.name,
                projectId: project.id,
                location: project.location,
                developer: project.developer,
            }
        });
    }, [navigation, project]);

    const handleSuggestionPress = useCallback((suggestedProject) => {
        navigation.push('ProjectDetail', { project: suggestedProject });
    }, [navigation]);

    const handleWhatsApp = useCallback((property) => {
        const message = `Hi, I'm interested in ${property.title} at ${project.name}`;
        const phoneNumber = '+971500000000';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert('WhatsApp is not installed');
        });
    }, [project.name]);

    const handleCall = useCallback(() => {
        Linking.openURL('tel:+971500000000');
    }, []);

    const handleShare = useCallback(async () => {
        try {
            await Share.share({
                message: `Check out ${project.name} - ${project.priceRange}\n\n${project.description}\n\nLocation: ${project.location}`,
                title: project.name,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    }, [project]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    // Image carousel handlers
    const handleNextImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    const handlePrevImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    return (
        <View style={styles.container}>
            {/* Animated Header */}
            <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
                <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{project.name}</Text>
                <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                    <Ionicons name="share-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </Animated.View>

            {/* Static Back Button */}
            <View style={[styles.staticHeader, { paddingTop: insets.top }]}>
                <TouchableOpacity style={styles.staticHeaderButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.staticHeaderActions}>
                    <TouchableOpacity style={styles.staticHeaderButton} onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <LikeButton
                        size={24}
                        likedColor="#FF4757"
                        unlikedColor="#fff"
                        buttonStyle={styles.staticHeaderButton}
                    />
                </View>
            </View>

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Image Carousel */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: images[currentImageIndex] || 'https://via.placeholder.com/400x300' }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
                        locations={[0, 0.5, 1]}
                        style={styles.heroGradient}
                    />

                    {/* Image Navigation */}
                    {images.length > 1 && (
                        <>
                            <TouchableOpacity
                                style={[styles.heroNavArrow, styles.heroNavLeft]}
                                onPress={handlePrevImage}
                            >
                                <Ionicons name="chevron-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.heroNavArrow, styles.heroNavRight]}
                                onPress={handleNextImage}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Image Counter */}
                    <View style={styles.imageCounter}>
                        <Ionicons name="images" size={14} color="#fff" />
                        <Text style={styles.imageCounterText}>{currentImageIndex + 1}/{images.length}</Text>
                    </View>

                    {/* Hero Info */}
                    <View style={styles.heroInfo}>
                        <View style={styles.developerBadge}>
                            <Text style={styles.developerText}>by {project.developer}</Text>
                        </View>
                        <Text style={styles.heroTitle}>{project.name}</Text>
                        <View style={styles.heroLocationRow}>
                            <Ionicons name="location" size={16} color="#fff" />
                            <Text style={styles.heroLocation}>{project.location}</Text>
                        </View>
                    </View>
                </View>

                {/* Project Info Cards */}
                <View style={styles.infoCardsContainer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Starting From</Text>
                        <Text style={styles.infoCardValue}>{formatPrice(project.startingPrice)}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Handover</Text>
                        <Text style={styles.infoCardValue}>{project.handover}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Payment Plan</Text>
                        <Text style={styles.infoCardValue}>{project.paymentPlan}</Text>
                    </View>
                </View>

                {/* Status & Availability */}
                <View style={styles.statusContainer}>
                    <View style={[styles.statusChip, project.completion === 'Ready' ? styles.readyChip : styles.offPlanChip]}>
                        <Ionicons
                            name={project.completion === 'Ready' ? 'checkmark-circle' : 'construct'}
                            size={14}
                            color={project.completion === 'Ready' ? '#10B981' : colors.primary}
                        />
                        <Text style={[styles.statusChipText, project.completion === 'Ready' ? styles.readyChipText : styles.offPlanChipText]}>
                            {project.status}
                        </Text>
                    </View>
                    <View style={styles.availabilityChip}>
                        <Text style={styles.availabilityText}>
                            {project.availableUnits} of {project.totalUnits} units available
                        </Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Ionicons name="home-outline" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.statLabel}>Property Types</Text>
                        <Text style={styles.statValue}>{project.propertyTypes?.join(', ')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Ionicons name="bed-outline" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.statLabel}>Bedrooms</Text>
                        <Text style={styles.statValue}>{project.bedroomRange}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <Ionicons name="cash-outline" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.statLabel}>Price Range</Text>
                        <Text style={styles.statValue}>{project.priceRange}</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About {project.name}</Text>
                    <Text style={styles.descriptionText}>{project.description}</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
                        onPress={() => setActiveTab('properties')}
                    >
                        <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
                            Properties ({project.properties?.length || 0})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'amenities' && styles.activeTab]}
                        onPress={() => setActiveTab('amenities')}
                    >
                        <Text style={[styles.tabText, activeTab === 'amenities' && styles.activeTabText]}>
                            Amenities
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
                        onPress={() => setActiveTab('nearby')}
                    >
                        <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
                            Nearby
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'properties' && (
                    <View style={styles.propertiesSection}>
                        <Text style={styles.propertiesSectionTitle}>
                            Available Units in {project.name}
                        </Text>
                        {project.properties?.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                projectName={project.name}
                                onPress={handlePropertyPress}
                                onWhatsApp={handleWhatsApp}
                                onCall={handleCall}
                            />
                        ))}
                    </View>
                )}

                {activeTab === 'amenities' && (
                    <View style={styles.amenitiesSection}>
                        <Text style={styles.amenitiesSectionTitle}>Project Amenities</Text>
                        <View style={styles.amenitiesGrid}>
                            {project.amenities?.map((amenity, idx) => (
                                <AmenityItem key={idx} amenity={amenity} />
                            ))}
                        </View>
                    </View>
                )}

                {activeTab === 'nearby' && (
                    <View style={styles.nearbySection}>
                        <Text style={styles.nearbySectionTitle}>Nearby Places</Text>
                        {project.nearbyPlaces?.map((place, idx) => (
                            <NearbyItem key={idx} place={place} />
                        ))}
                    </View>
                )}

                {/* Suggestions Section */}
                <View style={styles.suggestionsSection}>
                    <View style={styles.suggestionsHeader}>
                        <Text style={styles.suggestionsTitle}>Similar Projects</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={suggestedProjects}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <SuggestionCard project={item} onPress={handleSuggestionPress} />
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.suggestionsContent}
                    />
                </View>

                {/* Bottom Padding */}
                <View style={{ height: insets.bottom + 100 }} />
            </Animated.ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
                <View style={styles.bottomBarContent}>
                    <View style={styles.bottomPriceInfo}>
                        <Text style={styles.bottomPriceLabel}>Starting from</Text>
                        <Text style={styles.bottomPrice}>{formatPrice(project.startingPrice)}</Text>
                    </View>
                    <View style={styles.bottomActions}>
                        <TouchableOpacity style={styles.callButtonBottom} onPress={handleCall}>
                            <Ionicons name="call" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.whatsappButtonBottom}
                            onPress={() => handleWhatsApp({ title: project.name })}
                        >
                            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                            <Text style={styles.whatsappButtonBottomText}>Enquire Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },

    // Animated Header
    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        textAlign: 'center',
        marginHorizontal: 8,
    },

    // Static Header
    staticHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        zIndex: 50,
    },
    staticHeaderButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    staticHeaderActions: {
        flexDirection: 'row',
    },

    // Hero Section
    heroContainer: {
        height: 320,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroNavArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroNavLeft: {
        left: 16,
    },
    heroNavRight: {
        right: 16,
    },
    imageCounter: {
        position: 'absolute',
        top: 100,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    imageCounterText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
    },
    heroInfo: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
    },
    developerBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    developerText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
    },
    heroTitle: {
        fontSize: 28,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
        marginBottom: 8,
    },
    heroLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    heroLocation: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
    },

    // Info Cards
    infoCardsContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: -20,
        marginBottom: 16,
        gap: 10,
    },
    infoCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    infoCardLabel: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    infoCardValue: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        textAlign: 'center',
    },

    // Status Container
    statusContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 10,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    readyChip: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    offPlanChip: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
    },
    statusChipText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
    },
    readyChipText: {
        color: '#10B981',
    },
    offPlanChipText: {
        color: colors.primary,
    },
    availabilityChip: {
        backgroundColor: colors.lightGray,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    availabilityText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },

    // Quick Stats
    quickStats: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: colors.border,
        alignSelf: 'center',
    },

    // Section
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        lineHeight: 22,
    },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    tabText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeTabText: {
        fontFamily: 'Lato_700Bold',
        color: colors.text,
    },

    // Properties Section
    propertiesSection: {
        paddingHorizontal: 16,
    },
    propertiesSectionTitle: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        marginBottom: 16,
    },

    // Property Card
    propertyCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    imageCarousel: {
        height: 180,
        position: 'relative',
    },
    propertyImage: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    topBadges: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        gap: 6,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    availableBadge: {
        backgroundColor: '#10B981',
    },
    soldBadge: {
        backgroundColor: '#EF4444',
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Lato_700Bold',
    },
    viewBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    viewBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Lato_400Regular',
    },
    navArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navArrowLeft: {
        left: 8,
    },
    navArrowRight: {
        right: 8,
    },
    imageDots: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 16,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Property Info
    propertyInfo: {
        padding: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: colors.primary,
    },
    typeBadge: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
    },
    propertyTitle: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        marginBottom: 10,
    },
    specsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    specText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    specDivider: {
        width: 1,
        height: 14,
        backgroundColor: colors.border,
        marginHorizontal: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
    },
    tag: {
        backgroundColor: colors.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontFamily: 'Lato_700Bold',
        color: colors.textSecondary,
    },
    contactButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    emailButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        gap: 6,
    },
    emailButtonText: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: colors.primary,
    },
    whatsappButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#25D366',
        gap: 6,
    },
    whatsappButtonText: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },

    // Amenities Section
    amenitiesSection: {
        paddingHorizontal: 16,
    },
    amenitiesSectionTitle: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        marginBottom: 16,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
    },
    amenityIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    amenityText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.text,
        flex: 1,
    },

    // Nearby Section
    nearbySection: {
        paddingHorizontal: 16,
    },
    nearbySectionTitle: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
        marginBottom: 16,
    },
    nearbyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        gap: 12,
    },
    nearbyIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nearbyInfo: {
        flex: 1,
    },
    nearbyName: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
    },
    nearbyDistance: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginTop: 2,
    },

    // Suggestions Section
    suggestionsSection: {
        marginTop: 24,
        paddingTop: 20,
        backgroundColor: colors.lightGray,
    },
    suggestionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    suggestionsTitle: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: colors.text,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
    },
    suggestionsContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    suggestionCard: {
        width: 200,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
        position: 'relative',
    },
    suggestionImage: {
        width: '100%',
        height: '100%',
    },
    suggestionGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    suggestionInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    suggestionName: {
        fontSize: 15,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },
    suggestionLocation: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    suggestionPrice: {
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
        color: '#FFD700',
        marginTop: 4,
    },
    featuredBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
        paddingHorizontal: 16,
    },
    bottomBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomPriceInfo: {
        flex: 1,
    },
    bottomPriceLabel: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    bottomPrice: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: colors.primary,
    },
    bottomActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    callButtonBottom: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whatsappButtonBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25D366',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 22,
        gap: 8,
    },
    whatsappButtonBottomText: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },
});

export default ProjectDetailScreen;
