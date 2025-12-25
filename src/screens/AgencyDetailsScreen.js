import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import colors from '../theme/colors';
import agentsData from '../data/agents.json';
import propertiesData from '../data/properties.json';
import LikeButton from '../components/LikeButton';

const { width, height } = Dimensions.get('window');
const RED_SHADE = '#B91C1C'; // Red shade (primary)
const RED_LIGHT = '#FEE2E2'; // Light red background
const RED_HEADER = '#C41E3A'; // Red header color (slightly lighter red)

const AgencyDetailsScreen = ({ route, navigation }) => {
    const { agency } = route.params || {};
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('About');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showFullServiceAreas, setShowFullServiceAreas] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [propertyType, setPropertyType] = useState('All');
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    if (!agency) {
        return (
            <View style={styles.container}>
                <Text>Agency not found</Text>
            </View>
        );
    }

    // Get agents from this agency
    const agencyAgents = agentsData.agents.filter(
        agent => agent.agencyName === agency.name
    );

    // Get properties from agency agents
    const agencyProperties = propertiesData.properties.filter(
        property => {
            const agent = agentsData.agents.find(a => a.id === property.agentId);
            return agent && agent.agencyName === agency.name;
        }
    );

    const totalProperties = agency.totalListings || agencyProperties.length;
    const saleProperties = agency.saleListings || agencyProperties.filter(p => p.transactionType === 'Buy').length;
    const rentProperties = agency.rentListings || agencyProperties.filter(p => p.transactionType === 'Rent').length;

    const handleCall = () => {
        const phone = agency.phone || '+97141234567';
        Linking.openURL(`tel:${phone}`);
    };

    const handleEmail = () => {
        const email = agency.email || 'info@topsellingproperties.ae';
        Linking.openURL(`mailto:${email}?subject=Inquiry about ${agency.name}`);
    };

    const handleSMS = () => {
        const phone = agency.phone || '+97141234567';
        Linking.openURL(`sms:${phone}`);
    };

    const handleWhatsApp = (property) => {
        const phone = agency.phone || '+97141234567';
        const message = `Hi, I'm interested in ${property?.title || 'this property'}`;
        Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`);
    };

    const description = agency.description || 'No description available.';
    const displayDescription = showFullDescription ? description : description.substring(0, 150);
    const hasMoreDescription = description.length > 150;

    const serviceAreas = agency.serviceAreas || [];
    const displayServiceAreas = showFullServiceAreas ? serviceAreas : serviceAreas.slice(0, 5);
    const hasMoreServiceAreas = serviceAreas.length > 5;

    const propertyTypes = agency.specializations || [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Red Header with Gradient */}
            <LinearGradient
                colors={[colors.maroon, colors.primary]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={[styles.topHeader, { paddingTop: insets.top }]}
            >
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Company Profile Header Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileCardContent}>
                        <Image
                            source={{ uri: agency.logo || 'https://via.placeholder.com/80' }}
                            style={styles.companyLogo}
                        />
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyName}>{agency.name}</Text>
                            <TouchableOpacity style={styles.propertyCountButton}>
                                <Text style={styles.propertyCountText}>{totalProperties} PROPERTIES</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Navigation Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'About' && styles.activeTab]}
                        onPress={() => setActiveTab('About')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>
                            About
                        </Text>
                        {activeTab === 'About' && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Properties' && styles.activeTab]}
                        onPress={() => setActiveTab('Properties')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'Properties' && styles.activeTabText]}>
                            Properties
                        </Text>
                        {activeTab === 'Properties' && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Agents' && styles.activeTab]}
                        onPress={() => setActiveTab('Agents')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'Agents' && styles.activeTabText]}>
                            Agents
                        </Text>
                        {activeTab === 'Agents' && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                </View>

                {/* Content Based on Active Tab */}
                {activeTab === 'About' && (
                    <View style={styles.contentSection}>
                        <Text style={styles.aboutHeading}>About</Text>

                        {/* Description */}
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoLabel}>Description</Text>
                            <Text style={styles.infoText}>
                                {displayDescription}
                                {hasMoreDescription && !showFullDescription && '...'}
                            </Text>
                            {hasMoreDescription && (
                                <TouchableOpacity
                                    onPress={() => setShowFullDescription(!showFullDescription)}
                                    style={styles.readMoreButton}
                                >
                                    <Text style={styles.readMoreText}>
                                        {showFullDescription ? 'Read less' : 'Read more'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Property Listings Summary */}
                        <View style={styles.propertyListingsContainer}>
                            <TouchableOpacity
                                style={styles.propertyListingButton}
                                onPress={() => setActiveTab('Properties')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.propertyListingText}>{saleProperties} for Sale</Text>
                                                            <Ionicons name="chevron-forward" size={20} color={RED_SHADE} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.propertyListingButton}
                                onPress={() => setActiveTab('Properties')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.propertyListingText}>{rentProperties} for Rent</Text>
                                                            <Ionicons name="chevron-forward" size={20} color={RED_SHADE} />
                            </TouchableOpacity>
                        </View>

                        {/* Service Areas */}
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoLabel}>Service Areas</Text>
                            <Text style={styles.infoText}>
                                {displayServiceAreas.join(', ')}
                                {hasMoreServiceAreas && !showFullServiceAreas && '...'}
                            </Text>
                            {hasMoreServiceAreas && (
                                <TouchableOpacity
                                    onPress={() => setShowFullServiceAreas(!showFullServiceAreas)}
                                    style={styles.readMoreButton}
                                >
                                    <Text style={styles.readMoreText}>
                                        {showFullServiceAreas ? 'Read less' : 'Read more'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Property Types */}
                        {propertyTypes.length > 0 && (
                            <View style={styles.infoBlock}>
                                <Text style={styles.infoLabel}>Property Types</Text>
                                <Text style={styles.infoText}>
                                    {propertyTypes.join(', ')}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'Properties' && (
                    <View style={styles.propertiesContentSection}>
                        {/* Search and Filter Section */}
                        <View style={styles.searchFilterSection}>
                            <View style={styles.locationSearchContainer}>
                                <Ionicons name="location" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                                <Text style={styles.locationSearchText}>
                                    {selectedLocation || 'Select Locations'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.filtersButton} activeOpacity={0.8}>
                                <Ionicons name="filter" size={18} color={colors.white} />
                                <Text style={styles.filtersButtonText}>Filters</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Property Type Buttons */}
                        <View style={styles.propertyTypeContainer}>
                            {['All', 'Buy', 'Rent'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.propertyTypeButton,
                                        propertyType === type && styles.activePropertyTypeButton
                                    ]}
                                    onPress={() => setPropertyType(type)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.propertyTypeText,
                                        propertyType === type && styles.activePropertyTypeText
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Properties List */}
                        {agencyProperties.length > 0 ? (
                            <View style={styles.propertiesListContainer}>
                                {agencyProperties
                                    .filter(property => {
                                        if (propertyType === 'All') return true;
                                        if (propertyType === 'Buy') return property.transactionType === 'Buy';
                                        if (propertyType === 'Rent') return property.transactionType === 'Rent';
                                        return true;
                                    })
                                    .map((property) => {
                                        const images = property.images || [];
                                        const currentIndex = currentImageIndex[property.id] || 0;
                                        const currentImage = images[currentIndex] || 'https://via.placeholder.com/400';

                                        return (
                                            <TouchableOpacity
                                                key={property.id}
                                                style={styles.propertyListingCard}
                                                onPress={() => navigation.navigate('PropertyDetails', { property })}
                                                activeOpacity={0.9}
                                            >
                                                {/* Image Container */}
                                                <View style={styles.propertyImageContainer}>
                                                    <Image
                                                        source={{ uri: currentImage }}
                                                        style={styles.propertyListingImage}
                                                    />
                                                    
                                                    {/* TruCheck Badge */}
                                                    <View style={styles.truCheckBadge}>
                                                        <Ionicons name="checkmark-circle" size={16} color={colors.white} />
                                                        <Text style={styles.truCheckText}>TSPCheck™</Text>
                                                    </View>

                                                    {/* TruBroker Badge */}
                                                    <View style={styles.truBrokerImageBadge}>
                                                        <Image
                                                            source={{ uri: property.agent?.image || 'https://via.placeholder.com/40' }}
                                                            style={styles.brokerAvatar}
                                                        />
                                                        <View style={styles.truBrokerTextBadge}>
                                                            <Text style={styles.truBrokerTextSmall}>TSPBroker™</Text>
                                                        </View>
                                                    </View>

                                                    {/* Favorite Icon */}
                                                    <LikeButton
                                                        size={24}
                                                        unlikedColor={colors.white}
                                                        buttonStyle={styles.favoriteButton}
                                                    />

                                                    {/* Image Navigation */}
                                                    {images.length > 1 && (
                                                        <>
                                                            {currentIndex > 0 && (
                                                                <TouchableOpacity
                                                                    style={styles.imageNavButton}
                                                                    onPress={(e) => {
                                                                        e.stopPropagation();
                                                                        setCurrentImageIndex({
                                                                            ...currentImageIndex,
                                                                            [property.id]: currentIndex - 1
                                                                        });
                                                                    }}
                                                                >
                                                                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                                                                </TouchableOpacity>
                                                            )}
                                                            {currentIndex < images.length - 1 && (
                                                                <TouchableOpacity
                                                                    style={[styles.imageNavButton, styles.imageNavButtonRight]}
                                                                    onPress={(e) => {
                                                                        e.stopPropagation();
                                                                        setCurrentImageIndex({
                                                                            ...currentImageIndex,
                                                                            [property.id]: currentIndex + 1
                                                                        });
                                                                    }}
                                                                >
                                                                    <Ionicons name="chevron-forward" size={24} color={colors.white} />
                                                                </TouchableOpacity>
                                                            )}
                                                            {/* Pagination Dots */}
                                                            <View style={styles.paginationDots}>
                                                                {images.slice(0, 5).map((_, index) => (
                                                                    <View
                                                                        key={index}
                                                                        style={[
                                                                            styles.paginationDot,
                                                                            index === currentIndex && styles.paginationDotActive
                                                                        ]}
                                                                    />
                                                                ))}
                                                            </View>
                                                        </>
                                                    )}
                                                </View>

                                                {/* Property Details */}
                                                <View style={styles.propertyListingInfo}>
                                                    <Text style={styles.propertyListingPrice}>
                                                        AED {property.price?.toLocaleString()}
                                                    </Text>
                                                    
                                                    <View style={styles.propertyDetailsRow}>
                                                        <View style={styles.propertyDetailItem}>
                                                            <Ionicons name="bed" size={16} color={colors.textSecondary} />
                                                            <Text style={styles.propertyDetailText}>{property.bedrooms || 'N/A'}</Text>
                                                        </View>
                                                        <View style={styles.propertyDetailItem}>
                                                            <Ionicons name="water" size={16} color={colors.textSecondary} />
                                                            <Text style={styles.propertyDetailText}>{property.bathrooms || 'N/A'}</Text>
                                                        </View>
                                                        <View style={styles.propertyDetailItem}>
                                                            <Ionicons name="grid" size={16} color={colors.textSecondary} />
                                                            <Text style={styles.propertyDetailText}>{property.area || 'N/A'} sqft</Text>
                                                        </View>
                                                    </View>

                                                    {property.tags && property.tags.length > 0 && (
                                                        <Text style={styles.propertyDescription}>
                                                            {property.tags.slice(0, 3).join(' | ')}
                                                        </Text>
                                                    )}

                                                    <Text style={styles.propertyLocation} numberOfLines={1}>
                                                        {property.location || 'Location not specified'}
                                                    </Text>

                                                    {/* Contact Buttons */}
                                                    <View style={styles.propertyContactButtons}>
                                                        <TouchableOpacity
                                                            style={styles.propertyContactButton}
                                                            onPress={(e) => {
                                                                e.stopPropagation();
                                                                handleEmail();
                                                            }}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Ionicons name="mail" size={18} color={RED_SHADE} />
                                                            <Text style={styles.propertyContactButtonText}>Email</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={styles.propertyContactButton}
                                                            onPress={(e) => {
                                                                e.stopPropagation();
                                                                handleCall();
                                                            }}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Ionicons name="call" size={18} color={RED_SHADE} />
                                                            <Text style={styles.propertyContactButtonText}>Call</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={styles.propertyContactButton}
                                                            onPress={(e) => {
                                                                e.stopPropagation();
                                                                handleWhatsApp(property);
                                                            }}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Ionicons name="logo-whatsapp" size={20} color={RED_SHADE} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>No properties available</Text>
                        )}
                    </View>
                )}

                {activeTab === 'Agents' && (
                    <View style={styles.contentSection}>
                        <Text style={styles.aboutHeading}>Agents</Text>
                        {agencyAgents.length > 0 ? (
                            <View style={styles.agentsGrid}>
                                {agencyAgents.map((agent) => (
                                    <TouchableOpacity
                                        key={agent.id}
                                        style={styles.agentCard}
                                        onPress={() => navigation.navigate('AgentDetails', { agent })}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{ uri: agent.image || 'https://via.placeholder.com/100' }}
                                            style={styles.agentCardImage}
                                        />
                                        <Text style={styles.agentCardName} numberOfLines={1}>
                                            {agent.name}
                                        </Text>
                                        <Text style={styles.agentCardTitle}>
                                            {agent.specialization || 'Agent'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>No agents available</Text>
                        )}
                    </View>
                )}

                {/* Bottom Spacing for Action Bar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.actionBar, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity
                    style={styles.actionBarButton}
                    onPress={handleEmail}
                    activeOpacity={0.8}
                >
                    <Ionicons name="mail" size={22} color={RED_SHADE} />
                    <Text style={styles.actionBarButtonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBarButton}
                    onPress={handleCall}
                    activeOpacity={0.8}
                >
                    <Ionicons name="call" size={22} color={RED_SHADE} />
                    <Text style={styles.actionBarButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBarButton}
                    onPress={handleSMS}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chatbubble" size={22} color={RED_SHADE} />
                    <Text style={styles.actionBarButtonText}>SMS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const handleShare = () => {
    // Share functionality
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    topHeader: {
        backgroundColor: RED_HEADER,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: colors.white,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    companyLogo: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    companyInfo: {
        flex: 1,
    },
    companyName: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    propertyCountButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: RED_SHADE,
        backgroundColor: RED_LIGHT,
    },
    propertyCountText: {
        fontSize: 12,
        fontWeight: '700',
        color: RED_SHADE,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginTop: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        position: 'relative',
    },
    activeTab: {
        // Active state handled by text color
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeTabText: {
        color: RED_SHADE,
        fontWeight: '700',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: RED_SHADE,
    },
    contentSection: {
        backgroundColor: colors.white,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
    },
    aboutHeading: {
        fontSize: 24,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    infoBlock: {
        marginBottom: 24,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.textSecondary,
    },
    readMoreButton: {
        marginTop: 8,
    },
    readMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: RED_SHADE,
    },
    propertyListingsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    propertyListingButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    propertyListingText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    propertiesContentSection: {
        backgroundColor: colors.white,
        marginTop: 20,
        paddingBottom: 20,
    },
    searchFilterSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        gap: 12,
    },
    locationSearchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    locationSearchText: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
    },
    filtersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: RED_SHADE,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    filtersButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    propertyTypeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 12,
    },
    propertyTypeButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    activePropertyTypeButton: {
        backgroundColor: RED_LIGHT,
        borderColor: RED_SHADE,
    },
    propertyTypeText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activePropertyTypeText: {
        color: RED_SHADE,
    },
    propertiesListContainer: {
        paddingHorizontal: 20,
    },
    propertyListingCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    propertyImageContainer: {
        width: '100%',
        height: 280,
        position: 'relative',
    },
    propertyListingImage: {
        width: '100%',
        height: '100%',
    },
    truCheckBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: RED_SHADE,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    truCheckText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.white,
    },
    truBrokerImageBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brokerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white,
    },
    truBrokerTextBadge: {
        backgroundColor: RED_SHADE,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    truBrokerTextSmall: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.white,
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageNavButton: {
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: [{ translateY: -20 }],
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageNavButtonRight: {
        left: 'auto',
        right: 12,
    },
    paginationDots: {
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: [{ translateX: -30 }],
        flexDirection: 'row',
        gap: 6,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        backgroundColor: colors.white,
        width: 20,
    },
    propertyListingInfo: {
        padding: 16,
    },
    propertyListingPrice: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    propertyDetailsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    propertyDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    propertyDetailText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    propertyDescription: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
        marginBottom: 8,
    },
    propertyLocation: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    propertyContactButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    propertyContactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    propertyContactButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    agentsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    agentCard: {
        width: (width - 52) / 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border,
    },
    agentCardImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    agentCardName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center',
    },
    agentCardTitle: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 40,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    actionBarButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 4,
        gap: 8,
    },
    actionBarButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});

export default AgencyDetailsScreen;
