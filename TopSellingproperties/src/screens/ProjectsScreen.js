import React, { useState, useCallback, useMemo, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    Linking,
    Animated,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Constants
const FILTER_TABS = ['All', 'Ready', 'Off-Plan'];
const CATEGORY_TABS = ['Residential', 'Commercial'];
const STICKY_THRESHOLD = 120;

const SORT_OPTIONS = [
    { label: 'Latest', value: 'Latest', icon: 'time-outline' },
    { label: 'Price: Low to High', value: 'PriceLow', icon: 'arrow-up-outline' },
    { label: 'Price: High to Low', value: 'PriceHigh', icon: 'arrow-down-outline' },
    { label: 'Most Popular', value: 'Popular', icon: 'trending-up-outline' },
];

const TRUBROKER_STORIES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', agent: 'https://randomuser.me/api/portraits/women/44.jpg', name: 'Sarah A.' },
    { id: '2', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', agent: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'John M.' },
    { id: '3', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', agent: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Lisa K.' },
    { id: '4', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400', agent: 'https://randomuser.me/api/portraits/men/45.jpg', name: 'Mike R.' },
    { id: '5', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', agent: 'https://randomuser.me/api/portraits/women/22.jpg', name: 'Emma S.' },
];

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

// Memoized Story Card Component
const StoryCard = memo(({ story, onPress }) => (
    <TouchableOpacity style={styles.storyCard} onPress={() => onPress(story)} activeOpacity={0.9}>
        <Image source={{ uri: story.image }} style={styles.storyImage} />
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.storyGradient}
        />
        <View style={styles.agentAvatarContainer}>
            <View style={styles.agentAvatar}>
                <Image source={{ uri: story.agent }} style={styles.agentImage} />
            </View>
            <View style={styles.liveIndicator}>
                <Ionicons name="play" size={8} color="#fff" />
            </View>
        </View>
        <Text style={styles.storyAgentName}>{story.name}</Text>
    </TouchableOpacity>
));

// Memoized Filter Tab Component
const FilterTab = memo(({ tab, isActive, onPress, isCategory = false }) => (
    <TouchableOpacity
        style={[
            styles.filterTab,
            isActive && (isCategory ? styles.activeCategoryTab : styles.activeFilterTab)
        ]}
        onPress={() => onPress(tab)}
        activeOpacity={0.7}
    >
        <Text style={[
            styles.filterTabText,
            isActive && (isCategory ? styles.activeCategoryTabText : styles.activeFilterTabText)
        ]}>
            {tab}
        </Text>
    </TouchableOpacity>
));

// Memoized Project Card Component
const ProjectCard = memo(({ project, onPress, onWhatsApp, onCall, onEmail }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const images = project.images || [];

    const handleNextImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    const handlePrevImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    return (
        <View style={styles.propertyCard}>
            {/* Image Carousel */}
            <TouchableOpacity activeOpacity={0.95} onPress={() => onPress(project)}>
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

                    {/* Top Badges */}
                    <View style={styles.topBadges}>
                        <View style={styles.truCheckBadge}>
                            <Ionicons name="checkmark-circle" size={12} color="#fff" />
                            <Text style={styles.truCheckText}>TruCheck™</Text>
                        </View>
                        {project.completion === 'Off-Plan' && (
                            <View style={styles.offPlanBadge}>
                                <Text style={styles.offPlanText}>Off-Plan</Text>
                            </View>
                        )}
                    </View>

                    {/* TruBroker Badge */}
                    <View style={styles.truBrokerBadge}>
                        <View style={styles.truBrokerIcon}>
                            <Ionicons name="play" size={8} color="#fff" />
                        </View>
                        <Text style={styles.truBrokerBadgeText}>TruBroker™</Text>
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
                        {images.slice(0, 6).map((_, idx) => (
                            <View
                                key={idx}
                                style={[styles.dot, currentImageIndex === idx && styles.activeDot]}
                            />
                        ))}
                        {images.length > 6 && (
                            <Text style={styles.moreDotsText}>+{images.length - 6}</Text>
                        )}
                    </View>

                    {/* Favorite Button */}
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={20}
                            color={isFavorite ? "#FF4757" : "#fff"}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {/* Property Info */}
            <View style={styles.propertyInfo}>
                {/* Price & Viewed Badge */}
                <View style={styles.priceRow}>
                    <View>
                        <Text style={styles.price}>{formatPrice(project.price)}</Text>
                        {project.priceType && (
                            <Text style={styles.priceType}>/{project.priceType}</Text>
                        )}
                    </View>
                    <View style={styles.viewedBadge}>
                        <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.viewedText}>Recently Viewed</Text>
                    </View>
                </View>

                {/* Specs */}
                <View style={styles.specsRow}>
                    <View style={styles.specItem}>
                        <Ionicons name="bed-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.specText}>{project.bedrooms || 0}</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                        <Ionicons name="water-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.specText}>{project.bathrooms || 0}</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                        <MaterialCommunityIcons name="vector-square" size={16} color={colors.textSecondary} />
                        <Text style={styles.specText}>{formatArea(project.area)}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.propertyTitle} numberOfLines={2}>
                    {project.title || 'Property Title'}
                </Text>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={colors.primary} />
                    <Text style={styles.propertyLocation} numberOfLines={1}>
                        {project.location || 'Location not available'}
                    </Text>
                </View>

                {/* Handover & Payment Plan */}
                <View style={styles.handoverRow}>
                    <View style={styles.handoverItem}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.handoverLabel}>Handover: </Text>
                        <Text style={styles.handoverValue}>{project.handover || 'Q4 2027'}</Text>
                    </View>
                    <View style={styles.handoverDivider} />
                    <View style={styles.handoverItem}>
                        <Ionicons name="card-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.handoverLabel}>Plan: </Text>
                        <Text style={styles.handoverValue}>{project.paymentPlan || '60/40'}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.contactButtons}>
                    <TouchableOpacity style={styles.emailButton} onPress={() => onEmail(project)} activeOpacity={0.8}>
                        <Ionicons name="mail-outline" size={16} color={colors.primary} />
                        <Text style={styles.emailButtonText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callButton} onPress={() => onCall(project)} activeOpacity={0.8}>
                        <Ionicons name="call-outline" size={16} color={colors.primary} />
                        <Text style={styles.callButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.whatsappButton}
                        onPress={() => onWhatsApp(project)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

// Memoized Featured Project Component
const FeaturedProject = memo(({ project, onPress }) => {
    if (!project) return null;

    return (
        <View style={styles.expandedCard}>
            {/* Project Image */}
            <TouchableOpacity onPress={() => onPress(project)} activeOpacity={0.95}>
                <View style={styles.featuredImageContainer}>
                    <Image
                        source={{ uri: project.images?.[0] || 'https://via.placeholder.com/400x200' }}
                        style={styles.featuredImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.featuredGradient}
                    />
                    <View style={styles.featuredBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.featuredBadgeText}>Featured Project</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Project Info */}
            <View style={styles.expandedHeader}>
                <View style={styles.expandedTitleRow}>
                    <View style={styles.expandedTitleContainer}>
                        <Text style={styles.expandedTitle}>
                            {project.title?.split(' in ')[0] || 'Premium Project'}
                        </Text>
                        <TouchableOpacity style={styles.dropdownIcon}>
                            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.projectMeta}>
                    <Text style={styles.expandedType}>{project.type || 'Apartments'}</Text>
                    <Text style={styles.expandedDot}>•</Text>
                    <Text style={styles.expandedDeveloper}>by {project.developer || 'Top Developer'}</Text>
                </View>

                {/* Status Badges */}
                <View style={styles.statusBadgeRow}>
                    <View style={styles.statusBadge}>
                        <Ionicons name="construct-outline" size={14} color={colors.primary} />
                        <Text style={styles.statusBadgeText}>
                            {project.completion === 'Ready' ? 'Ready to Move' : 'Under Construction'}
                        </Text>
                    </View>
                    <View style={styles.statusBadgeSecondary}>
                        <Ionicons name="trending-up" size={14} color="#10B981" />
                        <Text style={styles.statusBadgeTextSecondary}>High Demand</Text>
                    </View>
                </View>

                {/* Action Cards */}
                <View style={styles.actionCardsRow}>
                    <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                        <View style={styles.actionCardIconContainer}>
                            <Text style={styles.aedText}>AED</Text>
                        </View>
                        <View style={styles.actionCardContent}>
                            <Text style={styles.actionCardTitle}>Payment Plan</Text>
                            <Text style={styles.actionCardSubtitle}>60/40 Available</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                        <View style={[styles.actionCardIconContainer, styles.actionCardIconBlue]}>
                            <Ionicons name="grid-outline" size={16} color="#3B82F6" />
                        </View>
                        <View style={styles.actionCardContent}>
                            <Text style={styles.actionCardTitle}>Unit Types</Text>
                            <Text style={styles.actionCardSubtitle}>1-4 Bedrooms</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* View More Button */}
                <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => onPress(project)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.viewMoreText}>View Project Details</Text>
                    <View style={styles.viewMoreIcon}>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
});

// Main Component
const ProjectsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [buyType, setBuyType] = useState('Buy');
    const [showBuyDropdown, setShowBuyDropdown] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [sortBy, setSortBy] = useState('Latest');
    const [isSticky, setIsSticky] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [projects] = useState(propertiesData.properties);

    // Memoized filtered and sorted projects
    const filteredProjects = useMemo(() => {
        let result = projects.filter(project => {
            const matchesSearch =
                !searchQuery ||
                project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.location?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = activeFilter === 'All' ||
                (activeFilter === 'Ready' && project.completion === 'Ready') ||
                (activeFilter === 'Off-Plan' && project.completion === 'Off-Plan');

            return matchesSearch && matchesFilter;
        });

        // Sort logic
        switch (sortBy) {
            case 'PriceLow':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'PriceHigh':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'Popular':
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            default:
                // Latest - keep original order
                break;
        }

        return result;
    }, [projects, searchQuery, activeFilter, sortBy]);

    const featuredProject = useMemo(() => filteredProjects[0], [filteredProjects]);

    // Callbacks
    const handleScroll = useCallback((event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    }, []);

    const handleProjectPress = useCallback((project) => {
        navigation.navigate('PropertyDetails', { property: project });
    }, [navigation]);

    const handleWhatsApp = useCallback((project) => {
        const message = `Hi, I'm interested in ${project.title}`;
        const phoneNumber = '+971500000000';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert('WhatsApp is not installed');
        });
    }, []);

    const handleCall = useCallback(() => {
        Linking.openURL('tel:+971500000000');
    }, []);

    const handleEmail = useCallback(() => {
        Linking.openURL('mailto:info@properties.ae');
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const handleStoryPress = useCallback((story) => {
        // Handle story press - could open a modal or navigate
        console.log('Story pressed:', story.name);
    }, []);

    const handleSortSelect = useCallback((value) => {
        setSortBy(value);
        setShowSortModal(false);
    }, []);

    // Render TruBroker Stories Section
    const renderStoriesSection = () => (
        <View style={styles.storiesSection}>
            <View style={styles.storiesHeader}>
                <View style={styles.storiesTitleContainer}>
                    <View style={styles.playIconContainer}>
                        <Ionicons name="play" size={12} color="#fff" />
                    </View>
                    <Text style={styles.storiesTitle}>
                        <Text style={styles.truBrokerTextBold}>TruBroker</Text>
                        <Text style={styles.trademark}>™</Text>
                        <Text style={styles.storiesTitleRest}> Stories</Text>
                    </Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <Text style={styles.storiesSubtitle}>
                Explore top agents in Motor City and nearby locations
            </Text>
            <FlatList
                horizontal
                data={TRUBROKER_STORIES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StoryCard story={item} onPress={handleStoryPress} />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesContent}
            />
        </View>
    );

    // Render Filter Section
    const renderFilterSection = () => (
        <View style={styles.filterSection}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContent}
            >
                {/* Filter Icon */}
                <TouchableOpacity style={styles.filterIconButton} activeOpacity={0.7}>
                    <Ionicons name="options-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Buy Dropdown */}
                <TouchableOpacity
                    style={styles.buyDropdown}
                    onPress={() => setShowBuyDropdown(!showBuyDropdown)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buyDropdownText}>{buyType}</Text>
                    <Ionicons name="chevron-down" size={12} color={colors.white} />
                </TouchableOpacity>

                {/* Filter Tabs */}
                {FILTER_TABS.map((tab) => (
                    <FilterTab
                        key={tab}
                        tab={tab}
                        isActive={activeFilter === tab}
                        onPress={setActiveFilter}
                    />
                ))}

                {/* Category Tabs */}
                {CATEGORY_TABS.map((tab) => (
                    <FilterTab
                        key={tab}
                        tab={tab}
                        isActive={activeCategory === tab}
                        onPress={setActiveCategory}
                        isCategory
                    />
                ))}
            </ScrollView>
        </View>
    );

    // Render Section Header
    const renderSectionHeader = () => (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>
                    Properties for sale
                </Text>
                <Text style={styles.resultCount}>
                    {filteredProjects.length} results
                </Text>
            </View>
            <View style={styles.sectionActions}>
                <TouchableOpacity style={styles.mapButton} activeOpacity={0.7}>
                    <Ionicons name="map-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.mapButtonText}>Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setShowSortModal(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
                    <Text style={styles.sortButtonText}>{sortBy}</Text>
                    <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Render Sort Modal
    const renderSortModal = () => (
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
                    {SORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sortOption,
                                sortBy === option.value && styles.sortOptionActive
                            ]}
                            onPress={() => handleSortSelect(option.value)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.sortOptionContent}>
                                <View style={[
                                    styles.sortOptionIcon,
                                    sortBy === option.value && styles.sortOptionIconActive
                                ]}>
                                    <Ionicons
                                        name={option.icon}
                                        size={18}
                                        color={sortBy === option.value ? colors.primary : colors.textSecondary}
                                    />
                                </View>
                                <Text style={[
                                    styles.sortOptionText,
                                    sortBy === option.value && styles.sortOptionTextActive
                                ]}>
                                    {option.label}
                                </Text>
                            </View>
                            {sortBy === option.value && (
                                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
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
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Header */}
                <Header navigation={navigation} />

                {/* Search Bar Section */}
                <View style={[styles.searchSection, isSticky && styles.searchSectionSticky]}>
                    <View style={styles.searchRow}>
                        <SearchBar
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            editable={true}
                            isSticky={isSticky}
                            containerStyle={styles.searchBarContainer}
                        />
                        <TouchableOpacity style={styles.saveButton} activeOpacity={0.7}>
                            <Ionicons name="bookmark-outline" size={18} color={colors.primary} />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Tabs */}
                {renderFilterSection()}

                {/* Featured Project */}
                <FeaturedProject
                    project={featuredProject}
                    onPress={handleProjectPress}
                />

                {/* TruBroker Stories */}
                {renderStoriesSection()}

                {/* Section Header */}
                {renderSectionHeader()}

                {/* Property Cards */}
                <View style={styles.propertiesContainer}>
                    {filteredProjects.slice(1, 10).map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onPress={handleProjectPress}
                            onWhatsApp={handleWhatsApp}
                            onCall={handleCall}
                            onEmail={handleEmail}
                        />
                    ))}

                    {/* Load More Indicator */}
                    {filteredProjects.length > 10 && (
                        <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.8}>
                            <Text style={styles.loadMoreText}>Load More Properties</Text>
                            <Ionicons name="chevron-down" size={18} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom Padding */}
                <View style={{ height: insets.bottom + 100 }} />
            </ScrollView>

            {/* Register Interest Bar */}
            <View style={[styles.registerBar, { bottom: insets.bottom + 56 }]}>
                <View style={styles.registerContent}>
                    <Text style={styles.registerTitle}>Interested in this project?</Text>
                    <Text style={styles.registerSubtitle}>Connect with our experts</Text>
                </View>
                <TouchableOpacity style={styles.whatsappRegisterButton} activeOpacity={0.8}>
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={styles.whatsappRegisterText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>

            {/* Sort Modal */}
            {renderSortModal()}
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

    // Search Section
    searchSection: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 10,
        zIndex: 100,
    },
    searchSectionSticky: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
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
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(185, 28, 28, 0.06)',
        borderRadius: 20,
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
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 8,
    },
    filterIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        gap: 6,
    },
    buyDropdownText: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    filterTab: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    activeFilterTab: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterTabText: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    activeFilterTabText: {
        color: colors.white,
        fontFamily: 'Poppins_600SemiBold',
    },
    activeCategoryTab: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(185, 28, 28, 0.06)',
    },
    activeCategoryTabText: {
        color: colors.primary,
        fontFamily: 'Poppins_600SemiBold',
    },

    // Featured/Expanded Card
    expandedCard: {
        backgroundColor: colors.white,
        marginHorizontal: 0,
        borderBottomWidth: 8,
        borderBottomColor: colors.lightGray,
    },
    featuredImageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    featuredBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    featuredBadgeText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    expandedHeader: {
        padding: 16,
    },
    expandedTitleRow: {
        marginBottom: 6,
    },
    expandedTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    expandedTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        flex: 1,
        letterSpacing: -0.5,
    },
    dropdownIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    expandedType: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    expandedDot: {
        fontSize: 14,
        color: colors.textTertiary,
        marginHorizontal: 8,
    },
    expandedDeveloper: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    statusBadgeRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    statusBadgeText: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    statusBadgeSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    statusBadgeTextSecondary: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: '#10B981',
    },
    actionCardsRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    actionCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    actionCardIconContainer: {
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
    },
    actionCardIconBlue: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    aedText: {
        fontSize: 11,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.primary,
    },
    actionCardContent: {
        flex: 1,
    },
    actionCardTitle: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    actionCardSubtitle: {
        fontSize: 11,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    viewMoreText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    viewMoreIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Stories Section
    storiesSection: {
        backgroundColor: colors.white,
        paddingVertical: 20,
        borderBottomWidth: 8,
        borderBottomColor: colors.lightGray,
    },
    storiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 6,
    },
    storiesTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    storiesTitle: {
        fontSize: 15,
    },
    truBrokerTextBold: {
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    trademark: {
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        fontSize: 10,
    },
    storiesTitleRest: {
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    storiesSubtitle: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: colors.textTertiary,
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    storiesContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    storyCard: {
        width: 90,
        height: 130,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    storyGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    agentAvatarContainer: {
        position: 'absolute',
        bottom: 26,
        left: 8,
    },
    agentAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 2,
        borderColor: colors.primary,
        overflow: 'hidden',
    },
    agentImage: {
        width: '100%',
        height: '100%',
    },
    liveIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    storyAgentName: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },

    // Section Header
    sectionHeader: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    resultCount: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    sectionActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 20,
        gap: 6,
    },
    mapButtonText: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 20,
        gap: 6,
    },
    sortButtonText: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },

    // Properties Container
    propertiesContainer: {
        paddingHorizontal: 0,
    },

    // Property Card
    propertyCard: {
        backgroundColor: colors.white,
        borderBottomWidth: 8,
        borderBottomColor: colors.lightGray,
    },
    imageCarousel: {
        width: '100%',
        height: 240,
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
        top: 14,
        left: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    truCheckBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        gap: 4,
    },
    truCheckText: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    offPlanBadge: {
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    offPlanText: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    truBrokerBadge: {
        position: 'absolute',
        bottom: 44,
        left: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 18,
        gap: 6,
    },
    truBrokerIcon: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    truBrokerBadgeText: {
        fontSize: 11,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    navArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    navArrowLeft: {
        left: 14,
    },
    navArrowRight: {
        right: 14,
    },
    imageDots: {
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
    },
    moreDotsText: {
        fontSize: 10,
        fontFamily: 'Poppins_500Medium',
        color: colors.white,
        marginLeft: 4,
    },
    favoriteButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Property Info
    propertyInfo: {
        padding: 16,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    priceType: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },
    viewedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        gap: 4,
    },
    viewedText: {
        fontSize: 11,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
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
    specDivider: {
        width: 1,
        height: 14,
        backgroundColor: colors.border,
        marginHorizontal: 12,
    },
    specText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
    },
    propertyTitle: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
        marginBottom: 6,
        lineHeight: 22,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 4,
    },
    propertyLocation: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
        flex: 1,
    },
    handoverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        backgroundColor: colors.lightGray,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    handoverItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    handoverLabel: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },
    handoverValue: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    handoverDivider: {
        width: 1,
        height: 16,
        backgroundColor: colors.border,
        marginHorizontal: 14,
    },
    contactButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    emailButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 12,
        gap: 6,
    },
    emailButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 12,
        gap: 6,
    },
    callButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
    },
    whatsappButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(37, 211, 102, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Load More
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 16,
        borderBottomWidth: 8,
        borderBottomColor: colors.lightGray,
        gap: 8,
    },
    loadMoreText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    registerContent: {
        flex: 1,
    },
    registerTitle: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    registerSubtitle: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },
    whatsappRegisterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25D366',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    whatsappRegisterText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#fff',
    },

    // Sort Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sortModal: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sortOptionActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.04)',
        marginHorizontal: -20,
        paddingHorizontal: 24,
        borderBottomColor: 'transparent',
        borderRadius: 12,
    },
    sortOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sortOptionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortOptionIconActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
    },
    sortOptionText: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
    },
    sortOptionTextActive: {
        color: colors.primary,
        fontFamily: 'Poppins_600SemiBold',
    },
});

export default ProjectsScreen;
