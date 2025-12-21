import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    FlatList,
    Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const { width } = Dimensions.get('window');

const filterTabs = ['All', 'Ready', 'Off-Plan'];
const categoryTabs = ['Residential', 'Commercial'];

const STICKY_THRESHOLD = 120; // When search bar becomes sticky

const ProjectsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [showBuyDropdown, setShowBuyDropdown] = useState(false);
    const [buyType, setBuyType] = useState('Buy');
    const [showSortModal, setShowSortModal] = useState(false);
    const [sortBy, setSortBy] = useState('Latest');
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [isSticky, setIsSticky] = useState(false);
    const [projects] = useState(propertiesData.properties);

    // Filter projects based on filters
    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (project.location && project.location.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = activeFilter === 'All' ||
            (activeFilter === 'Ready' && project.completion === 'Ready') ||
            (activeFilter === 'Off-Plan' && project.completion === 'Off-Plan');

        return matchesSearch && matchesFilter;
    });

    // Featured project (first one for expanded view)
    const featuredProject = filteredProjects[0];

    const handleProjectPress = (project) => {
        navigation.navigate('PropertyDetails', { property: project });
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    };

    const handleWhatsApp = (project) => {
        const message = `Hi, I'm interested in ${project.title}`;
        const phoneNumber = '+971500000000';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert('WhatsApp is not installed');
        });
    };

    const handleCall = () => {
        Linking.openURL('tel:+971500000000');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:info@properties.ae');
    };

    const formatPrice = (price) => {
        if (!price) return 'AED N/A';
        return `AED ${price.toLocaleString()}`;
    };

    const sortOptions = [
        { label: 'Latest', value: 'Latest' },
        { label: 'Price: Low to High', value: 'PriceLow' },
        { label: 'Price: High to Low', value: 'PriceHigh' },
        { label: 'Most Popular', value: 'Popular' },
    ];

    // TruBroker Stories data
    const truBrokerStories = [
        { id: '1', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', agent: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: '2', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', agent: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: '3', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', agent: 'https://randomuser.me/api/portraits/women/68.jpg' },
        { id: '4', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400', agent: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ];

    const renderExpandedProjectCard = () => {
        if (!featuredProject) return null;

        return (
            <View style={styles.expandedCard}>
                {/* Project Header */}
                <View style={styles.expandedHeader}>
                    <View style={styles.expandedTitleRow}>
                        <View style={styles.expandedTitleContainer}>
                            <Text style={styles.expandedTitle}>{featuredProject.title?.split(' in ')[0] || 'Takaya Tower B'}</Text>
                            <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
                        </View>
                    </View>
                    <Text style={styles.expandedType}>Apartments</Text>
                    <Text style={styles.expandedDeveloper}>by Union Properties</Text>

                    {/* Status Badges */}
                    <View style={styles.statusBadgeRow}>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>Under Construction</Text>
                        </View>
                        <View style={styles.statusBadgeSecondary}>
                            <Text style={styles.statusBadgeTextSecondary}>2% Completed</Text>
                        </View>
                    </View>

                    {/* Payment Plan & Unit Types */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionButtonIcon}>
                                <Text style={styles.aedText}>AED</Text>
                            </View>
                            <Text style={styles.actionButtonText}>Payment Plan</Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionButtonIconBlue}>
                                <Ionicons name="grid-outline" size={14} color="#3B82F6" />
                            </View>
                            <Text style={styles.actionButtonText}>Unit Types</Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* View More Details */}
                    <TouchableOpacity
                        style={styles.viewMoreButton}
                        onPress={() => handleProjectPress(featuredProject)}
                    >
                        <Text style={styles.viewMoreText}>View more details</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderTruBrokerStories = () => (
        <View style={styles.storiesSection}>
            <View style={styles.storiesHeader}>
                <Ionicons name="play-circle" size={20} color={colors.primary} />
                <Text style={styles.storiesTitle}>
                    <Text style={styles.truBrokerText}>TruBroker</Text>
                    <Text style={styles.storiesTitleRest}>™ Stories in Motor City and nearby loc...</Text>
                </Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesContent}
            >
                {truBrokerStories.map((story) => (
                    <TouchableOpacity key={story.id} style={styles.storyCard}>
                        <Image source={{ uri: story.image }} style={styles.storyImage} />
                        <View style={styles.agentAvatar}>
                            <Image source={{ uri: story.agent }} style={styles.agentImage} />
                        </View>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.nextArrow}>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    const renderPropertyCard = (property, index) => {
        const images = property.images || [];
        const currentIndex = currentImageIndex[property.id] || 0;

        return (
            <View key={property.id} style={styles.propertyCard}>
                {/* Image Carousel */}
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => handleProjectPress(property)}
                >
                    <View style={styles.imageCarousel}>
                        <Image
                            source={{ uri: images[currentIndex] || 'https://via.placeholder.com/400x250' }}
                            style={styles.propertyImage}
                        />

                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.3)']}
                            locations={[0, 0.5, 1]}
                            style={styles.imageGradient}
                        />

                        {/* Off-Plan Badge */}
                        <View style={styles.topBadges}>
                            <View style={styles.truCheckBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#fff" />
                                <Text style={styles.truCheckText}>TruCheck™</Text>
                            </View>
                            {property.completion === 'Off-Plan' && (
                                <View style={styles.offPlanBadge}>
                                    <Text style={styles.offPlanText}>Off-Plan</Text>
                                </View>
                            )}
                        </View>

                        {/* TruBroker Badge */}
                        <View style={styles.truBrokerBadge}>
                            <View style={styles.truBrokerIcon}>
                                <Ionicons name="play" size={10} color="#fff" />
                            </View>
                            <Text style={styles.truBrokerBadgeText}>TruBroker™</Text>
                        </View>

                        {/* Navigation Arrows */}
                        <TouchableOpacity
                            style={[styles.navArrow, styles.navArrowLeft]}
                            onPress={() => {
                                const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                                setCurrentImageIndex(prev => ({ ...prev, [property.id]: newIndex }));
                            }}
                        >
                            <Ionicons name="chevron-back" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.navArrow, styles.navArrowRight]}
                            onPress={() => {
                                const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                                setCurrentImageIndex(prev => ({ ...prev, [property.id]: newIndex }));
                            }}
                        >
                            <Ionicons name="chevron-forward" size={18} color="#fff" />
                        </TouchableOpacity>

                        {/* Image Dots */}
                        <View style={styles.imageDots}>
                            {images.slice(0, 6).map((_, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.dot,
                                        currentIndex === idx && styles.activeDot
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Favorite Button */}
                        <TouchableOpacity style={styles.favoriteButton}>
                            <Ionicons name="heart-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                {/* Property Info */}
                <View style={styles.propertyInfo}>
                    {/* Price & Viewed Badge */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{formatPrice(property.price)}</Text>
                        <View style={styles.viewedBadge}>
                            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                            <Text style={styles.viewedText}>Viewed</Text>
                        </View>
                    </View>

                    {/* Specs */}
                    <View style={styles.specsRow}>
                        <View style={styles.specItem}>
                            <Ionicons name="bed-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.specText}>{property.bedrooms}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Ionicons name="water-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.specText}>{property.bathrooms}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Ionicons name="grid-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.specText}>{property.area?.toLocaleString()} sqft</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                        {property.bedrooms}BR with Study | Contemporary | Great Investment
                    </Text>

                    {/* Location */}
                    <Text style={styles.propertyLocation} numberOfLines={1}>
                        {property.location}
                    </Text>

                    {/* Handover & Payment Plan */}
                    <View style={styles.handoverRow}>
                        <Text style={styles.handoverLabel}>Handover: </Text>
                        <Text style={styles.handoverValue}>Q4 2027</Text>
                        <View style={styles.handoverDivider} />
                        <Text style={styles.handoverLabel}>Payment Plan: </Text>
                        <Text style={styles.handoverValue}>60/40</Text>
                        <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.contactButtons}>
                        <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
                            <Ionicons name="mail-outline" size={16} color={colors.primary} />
                            <Text style={styles.emailButtonText}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                            <Ionicons name="call-outline" size={16} color={colors.primary} />
                            <Text style={styles.callButtonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.whatsappButton}
                            onPress={() => handleWhatsApp(property)}
                        >
                            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderTruBrokerSection = () => (
        <View style={styles.truBrokerSection}>
            <View style={styles.truBrokerHeader}>
                <View style={styles.truBrokerHeaderBadge}>
                    <Ionicons name="play" size={12} color="#fff" />
                    <Text style={styles.truBrokerHeaderText}>TruBroker™</Text>
                </View>
                <View style={styles.tabButtons}>
                    <TouchableOpacity style={styles.mapTabButton}>
                        <Ionicons name="map-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.mapTabText}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sortTabButton}
                        onPress={() => setShowSortModal(true)}
                    >
                        <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
                        <Text style={styles.sortTabText}>Sort</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
                Explore top agents in Takaya Tower B
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Header */}
                <Header navigation={navigation} />

                {/* Search Bar Section */}
                <View style={[styles.searchSection, isSticky && styles.searchSectionSticky]}>
                    <View style={styles.searchRow}>
                        <SearchBar
                            placeholder="Search location..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            editable={true}
                            isSticky={isSticky}
                            style={styles.compactSearchBox}
                            containerStyle={styles.searchBarContainer}
                        />
                        <TouchableOpacity style={styles.saveButton}>
                            <Ionicons name="bookmark-outline" size={18} color={colors.primary} />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContent}
                    >
                        {/* Filter Icon */}
                        <TouchableOpacity style={styles.filterIcon}>
                            <Ionicons name="options-outline" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>

                        {/* Buy Dropdown */}
                        <TouchableOpacity
                            style={styles.buyDropdown}
                            onPress={() => setShowBuyDropdown(!showBuyDropdown)}
                        >
                            <Text style={styles.buyDropdownText}>{buyType}</Text>
                            <Ionicons name="chevron-down" size={12} color={colors.white} />
                        </TouchableOpacity>

                        {/* Filter Tabs */}
                        {filterTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.filterTab,
                                    activeFilter === tab && styles.activeFilterTab
                                ]}
                                onPress={() => setActiveFilter(tab)}
                            >
                                <Text style={[
                                    styles.filterTabText,
                                    activeFilter === tab && styles.activeFilterTabText
                                ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Category Tabs */}
                        {categoryTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.filterTab,
                                    activeCategory === tab && styles.activeCategoryTab
                                ]}
                                onPress={() => setActiveCategory(tab)}
                            >
                                <Text style={[
                                    styles.filterTabText,
                                    activeCategory === tab && styles.activeCategoryTabText
                                ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Expanded Project Card */}
                {renderExpandedProjectCard()}

                {/* TruBroker Stories */}
                {renderTruBrokerStories()}

                {/* Properties Section Title */}
                <View style={styles.propertiesHeader}>
                    <Text style={styles.propertiesTitle}>
                        Properties for sale in Takaya Tower B
                    </Text>
                </View>

                {/* Property Cards */}
                <View style={styles.propertiesContainer}>
                    {filteredProjects.slice(0, 5).map((property, index) =>
                        renderPropertyCard(property, index)
                    )}
                </View>

                {/* Bottom Padding */}
                <View style={{ height: insets.bottom + 80 }} />
            </ScrollView>

            {/* Register Interest Bar */}
            <View style={[styles.registerBar, { bottom: insets.bottom + 56 }]}>
                <Text style={styles.registerText}>Register your interest</Text>
                <TouchableOpacity style={styles.whatsappRegisterButton}>
                    <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                    <Text style={styles.whatsappRegisterText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>

            {/* Sort Modal */}
            <Modal
                visible={showSortModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSortModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortModal(false)}
                >
                    <View style={styles.sortModal}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Sort by</Text>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.sortOption,
                                    sortBy === option.value && styles.sortOptionActive
                                ]}
                                onPress={() => {
                                    setSortBy(option.value);
                                    setShowSortModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.sortOptionText,
                                    sortBy === option.value && styles.sortOptionTextActive
                                ]}>
                                    {option.label}
                                </Text>
                                {sortBy === option.value && (
                                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollView: {
        flex: 1,
    },

    // Search Section
    searchSection: {
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 6,
        zIndex: 100,
    },
    searchSectionSticky: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBarContainer: {
        flex: 1,
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    compactSearchBox: {
        height: 38,
        borderRadius: 20,
        paddingHorizontal: 12,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    saveButtonText: {
        marginLeft: 4,
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },

    // Filter Section
    filterSection: {
        backgroundColor: colors.white,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 6,
    },
    filterIcon: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        gap: 3,
    },
    buyDropdownText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    filterTab: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeFilterTab: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterTabText: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    activeFilterTabText: {
        color: colors.white,
    },
    activeCategoryTab: {
        borderColor: colors.primary,
    },
    activeCategoryTabText: {
        color: colors.primary,
    },

    // Expanded Card
    expandedCard: {
        backgroundColor: colors.white,
        marginHorizontal: 0,
        borderBottomWidth: 8,
        borderBottomColor: '#F0F0F0',
    },
    expandedHeader: {
        padding: 16,
    },
    expandedTitleRow: {
        marginBottom: 4,
    },
    expandedTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandedTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginRight: 4,
    },
    expandedType: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginBottom: 2,
    },
    expandedDeveloper: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginBottom: 12,
    },
    statusBadgeRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    statusBadge: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginRight: 8,
    },
    statusBadgeText: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    statusBadgeSecondary: {
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    statusBadgeTextSecondary: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: '#10B981',
    },
    actionButtonsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 8,
    },
    actionButtonIcon: {
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    aedText: {
        fontSize: 11,
        fontFamily: 'Poppins_700Bold',
        color: colors.primary,
    },
    actionButtonIconBlue: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        width: 24,
        height: 24,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    actionButtonText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    viewMoreText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginRight: 4,
    },

    // TruBroker Stories
    storiesSection: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        borderBottomWidth: 8,
        borderBottomColor: '#F0F0F0',
    },
    storiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    storiesTitle: {
        marginLeft: 8,
        flex: 1,
    },
    truBrokerText: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    storiesTitleRest: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    storiesContent: {
        paddingHorizontal: 16,
    },
    storyCard: {
        width: 100,
        height: 140,
        marginRight: 12,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    agentAvatar: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: colors.primary,
        overflow: 'hidden',
    },
    agentImage: {
        width: '100%',
        height: '100%',
    },
    nextArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // Properties Header
    propertiesHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    propertiesTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },

    // Property Card
    propertiesContainer: {
        paddingHorizontal: 0,
    },
    propertyCard: {
        backgroundColor: colors.white,
        borderBottomWidth: 8,
        borderBottomColor: '#F0F0F0',
    },
    imageCarousel: {
        width: '100%',
        height: 220,
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
        alignItems: 'center',
    },
    truCheckBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 6,
    },
    truCheckText: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
        marginLeft: 4,
    },
    offPlanBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    offPlanText: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    truBrokerBadge: {
        position: 'absolute',
        bottom: 36,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    truBrokerIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
    },
    truBrokerBadgeText: {
        fontSize: 11,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    navArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -18,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navArrowLeft: {
        left: 12,
    },
    navArrowRight: {
        right: 12,
    },
    imageDots: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 2,
    },
    activeDot: {
        backgroundColor: colors.white,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Property Info
    propertyInfo: {
        padding: 14,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    price: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    viewedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viewedText: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    specsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    specText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    propertyTitle: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    propertyLocation: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    handoverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    handoverLabel: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },
    handoverValue: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    handoverDivider: {
        width: 1,
        height: 12,
        backgroundColor: colors.border,
        marginHorizontal: 12,
    },
    contactButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 10,
        marginRight: 8,
    },
    emailButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginLeft: 6,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 10,
        marginRight: 8,
    },
    callButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginLeft: 6,
    },
    whatsappButton: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // TruBroker Section
    truBrokerSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
    },
    truBrokerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    truBrokerHeaderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
    },
    truBrokerHeaderText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
        marginLeft: 4,
    },
    tabButtons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapTabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    mapTabText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    sortTabButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortTabText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    viewAllText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    sectionSubtitle: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },

    // Register Bar
    registerBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    registerText: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
    },
    whatsappRegisterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#25D366',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    whatsappRegisterText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#25D366',
        marginLeft: 6,
    },

    // Sort Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sortModal: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sortOptionActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.04)',
        marginHorizontal: -20,
        paddingHorizontal: 20,
        borderBottomColor: 'transparent',
    },
    sortOptionText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
    },
    sortOptionTextActive: {
        color: colors.primary,
        fontFamily: 'Poppins_600SemiBold',
    },
});

export default ProjectsScreen;
