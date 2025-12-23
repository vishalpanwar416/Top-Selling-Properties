import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    TextInput,
    Switch,
    Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import StoryViewer from '../components/StoryViewer';
import LocationSelector from '../components/LocationSelector';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Filter options
const transactionTypes = ['Buy', 'Rent'];
const statusFilters = ['All', 'Ready', 'Off-Plan'];
const propertyTypeFilters = ['Residential', 'Commercial'];
const residentialTypes = [
    { id: 'apartment', name: 'Apartment', icon: 'business-outline' },
    { id: 'villa', name: 'Villa', icon: 'home-outline' },
    { id: 'townhouse', name: 'Townhouse', icon: 'grid-outline' },
    { id: 'penthouse', name: 'Penthouse', icon: 'layers-outline' },
    { id: 'duplex', name: 'Duplex', icon: 'copy-outline' },
];
const commercialTypes = [
    { id: 'office', name: 'Office', icon: 'briefcase-outline' },
    { id: 'retail', name: 'Retail', icon: 'storefront-outline' },
    { id: 'warehouse', name: 'Warehouse', icon: 'cube-outline' },
    { id: 'shop', name: 'Shop', icon: 'cart-outline' },
];
const bedsOptions = ['Studio', '1', '2', '3', '4', '5', '6', '7+'];
const priceRanges = ['Any', '< 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M+'];
const areaRanges = ['Any', '< 500 sqft', '500-1000', '1000-2000', '2000-5000', '5000+'];
const bathsOptions = ['Any', '1', '2', '3', '4', '5+'];

const STICKY_THRESHOLD = 120; // When search bar becomes sticky

const PropertiesScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTransaction, setActiveTransaction] = useState('Buy');
    const [activeStatus, setActiveStatus] = useState('All');
    const [activePropertyType, setActivePropertyType] = useState('Residential');
    const [selectedPropertySubTypes, setSelectedPropertySubTypes] = useState([]);
    const [selectedBeds, setSelectedBeds] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedBaths, setSelectedBaths] = useState('');
    const [showTruBrokerFirst, setShowTruBrokerFirst] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [properties] = useState(propertiesData.properties);

    // Modal states
    const [showBuyRentModal, setShowBuyRentModal] = useState(false);
    const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
    const [showBedsModal, setShowBedsModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [showBathsModal, setShowBathsModal] = useState(false);
    const [showStoryViewer, setShowStoryViewer] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('UAE');

    // Animation values
    const modalAnimation = useRef(new Animated.Value(0)).current;

    // Stories data with actual images
    const stories = [
        {
            id: 1,
            name: 'John D.',
            location: 'Downtown',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            time: '2h ago',
            media: [
                { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
                { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
                { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800' },
            ],
        },
        {
            id: 2,
            name: 'Sarah M.',
            location: 'Marina',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            time: '5h ago',
            media: [
                { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800' },
                { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800' },
            ],
        },
        {
            id: 3,
            name: 'Ahmed K.',
            location: 'JBR',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            time: '1d ago',
            media: [
                { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800' },
                { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' },
                { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800' },
            ],
        },
        {
            id: 4,
            name: 'Lisa P.',
            location: 'Palm',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            time: '2d ago',
            media: [
                { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800' },
                { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800' },
            ],
        },
    ];

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch =
            (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTransaction =
            (activeTransaction === 'Buy' && property.transactionType === 'Buy') ||
            (activeTransaction === 'Rent' && property.transactionType === 'Rent') ||
            !property.transactionType;

        return matchesSearch && matchesTransaction;
    });

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    };

    const openModal = (setter) => {
        setter(true);
        Animated.spring(modalAnimation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    const closeModal = (setter) => {
        Animated.timing(modalAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setter(false));
    };

    const togglePropertySubType = (typeId) => {
        if (selectedPropertySubTypes.includes(typeId)) {
            setSelectedPropertySubTypes(selectedPropertySubTypes.filter(t => t !== typeId));
        } else {
            setSelectedPropertySubTypes([...selectedPropertySubTypes, typeId]);
        }
    };

    const getPropertyTypesForCategory = () => {
        return activePropertyType === 'Residential' ? residentialTypes : commercialTypes;
    };

    // Render Bottom Sheet Modal
    const renderBottomSheet = (visible, onClose, title, children, icon) => {
        if (!visible) return null;

        return (
            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            {
                                transform: [{
                                    translateY: modalAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [300, 0],
                                    })
                                }]
                            }
                        ]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.bottomSheetHandle} />
                            {title && (
                                <View style={styles.bottomSheetHeader}>
                                    {icon && (
                                        <Ionicons name={icon} size={24} color={colors.filterRed} />
                                    )}
                                    <Text style={styles.bottomSheetTitle}>{title}</Text>
                                </View>
                            )}
                            {children}
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[2]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Hero Section with Back Button and UAE */}
                <View style={styles.heroSection}>
                    {/* Header Row with Back Button, Title, and Location */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <View style={styles.backButtonContainer}>
                                <Ionicons name="chevron-back" size={24} color="#991B1B" />
                            </View>
                        </TouchableOpacity>

                        {/* Title with Icon - Centered */}
                        <View style={styles.titleRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="home" size={24} color="#991B1B" />
                            </View>
                            <Text style={styles.welcomeTitle}>Properties</Text>
                        </View>

                        {/* Location Selector - Right Side */}
                        <LocationSelector
                            selectedLocation={selectedLocation}
                            onLocationChange={setSelectedLocation}
                        />
                    </View>
                </View>

                {/* Search Bar Section */}
                <View style={[styles.searchSection, isSticky && styles.searchSectionSticky]}>
                    <View style={styles.searchRow}>
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            editable={true}
                            isSticky={isSticky}
                            searchType="properties"
                            containerStyle={styles.searchBarContainer}
                        />
                        <TouchableOpacity style={styles.saveButton}>
                            <Ionicons name="bookmark-outline" size={18} color={colors.filterRed} />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Bar - Single Scrollable Row */}
                <View style={styles.filterBarContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterBarContent}
                    >
                        {/* Filter Icon */}
                        <TouchableOpacity style={styles.filterIconButton}>
                            <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>

                        {/* Buy/Rent Dropdown */}
                        <TouchableOpacity
                            style={styles.buyButton}
                            onPress={() => openModal(setShowBuyRentModal)}
                        >
                            <Text style={styles.buyButtonText}>{activeTransaction}</Text>
                            <Ionicons name="chevron-down" size={16} color={colors.white} />
                        </TouchableOpacity>

                        {/* Status Filters (All, Ready, Off-Plan) */}
                        {statusFilters.map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.quickFilterPill,
                                    activeStatus === filter && styles.activeQuickFilterPill
                                ]}
                                onPress={() => setActiveStatus(filter)}
                            >
                                <Text style={[
                                    styles.quickFilterText,
                                    activeStatus === filter && styles.activeQuickFilterText
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Property Type Filter (Residential) */}
                        <TouchableOpacity
                            style={[
                                styles.dropdownPill,
                                selectedPropertySubTypes.length > 0 && styles.activeDropdownPill
                            ]}
                            onPress={() => openModal(setShowPropertyTypeModal)}
                        >
                            <Text style={[
                                styles.dropdownPillText,
                                selectedPropertySubTypes.length > 0 && styles.activeDropdownPillText
                            ]}>
                                {selectedPropertySubTypes.length > 0
                                    ? `${activePropertyType} (${selectedPropertySubTypes.length})`
                                    : activePropertyType}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={14}
                                color={selectedPropertySubTypes.length > 0 ? colors.white : colors.textSecondary}
                            />
                        </TouchableOpacity>

                        {/* Beds */}
                        <TouchableOpacity
                            style={[
                                styles.dropdownPill,
                                selectedBeds && styles.activeDropdownPill
                            ]}
                            onPress={() => openModal(setShowBedsModal)}
                        >
                            <Text style={[
                                styles.dropdownPillText,
                                selectedBeds && styles.activeDropdownPillText
                            ]}>
                                {selectedBeds ? `${selectedBeds} Beds` : 'Beds'}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={14}
                                color={selectedBeds ? colors.white : colors.textSecondary}
                            />
                        </TouchableOpacity>

                        {/* Price */}
                        <TouchableOpacity
                            style={[
                                styles.dropdownPill,
                                selectedPrice && styles.activeDropdownPill
                            ]}
                            onPress={() => openModal(setShowPriceModal)}
                        >
                            <Text style={[
                                styles.dropdownPillText,
                                selectedPrice && styles.activeDropdownPillText
                            ]}>
                                {selectedPrice || 'Price'}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={14}
                                color={selectedPrice ? colors.white : colors.textSecondary}
                            />
                        </TouchableOpacity>

                        {/* Area */}
                        <TouchableOpacity
                            style={[
                                styles.dropdownPill,
                                selectedArea && styles.activeDropdownPill
                            ]}
                            onPress={() => openModal(setShowAreaModal)}
                        >
                            <Text style={[
                                styles.dropdownPillText,
                                selectedArea && styles.activeDropdownPillText
                            ]}>
                                {selectedArea || 'Area'}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={14}
                                color={selectedArea ? colors.white : colors.textSecondary}
                            />
                        </TouchableOpacity>

                        {/* Baths */}
                        <TouchableOpacity
                            style={[
                                styles.dropdownPill,
                                selectedBaths && styles.activeDropdownPill
                            ]}
                            onPress={() => openModal(setShowBathsModal)}
                        >
                            <Text style={[
                                styles.dropdownPillText,
                                selectedBaths && styles.activeDropdownPillText
                            ]}>
                                {selectedBaths ? `${selectedBaths} Baths` : 'Baths'}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={14}
                                color={selectedBaths ? colors.white : colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </ScrollView>

                    {/* TSPBroker Toggle */}
                    <View style={styles.truBrokerRow}>
                        <Text style={styles.truBrokerText}>
                            Show <Text style={styles.truBrokerBold}>TSPBroker</Text>™ listings first
                        </Text>
                        <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                        <Switch
                            value={showTruBrokerFirst}
                            onValueChange={setShowTruBrokerFirst}
                            trackColor={{ false: colors.border, true: colors.filterRedLight }}
                            thumbColor={showTruBrokerFirst ? colors.filterRed : colors.gray}
                            style={styles.truBrokerSwitch}
                        />
                    </View>
                </View>

                {/* TSPBroker Stories Section */}
                <View style={styles.storiesSection}>
                    <View style={styles.storiesHeader}>
                        <View style={styles.storiesIconContainer}>
                            <Ionicons name="play-circle" size={28} color={colors.filterRed} />
                        </View>
                        <Text style={styles.storiesTitle} numberOfLines={1}>
                            <Text style={styles.storiesBold}>TSPBroker</Text>™ Stories in Dubai and nearby...
                        </Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storiesContent}
                    >
                        {/* Story Cards */}
                        {stories.map((story, index) => (
                            <TouchableOpacity
                                key={story.id}
                                style={styles.storyCard}
                                onPress={() => {
                                    setSelectedStoryIndex(index);
                                    setShowStoryViewer(true);
                                }}
                                activeOpacity={0.9}
                            >
                                <View style={styles.storyImageContainer}>
                                    <Image
                                        source={{ uri: story.media[0].url }}
                                        style={styles.storyImage}
                                        resizeMode="cover"
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                                        style={styles.storyGradient}
                                    />
                                    {/* Live Indicator */}
                                    <View style={styles.liveIndicator}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveText}>LIVE</Text>
                                    </View>
                                    {/* Broker Avatar */}
                                    <View style={styles.brokerAvatar}>
                                        <Image
                                            source={{ uri: story.avatar }}
                                            style={styles.brokerAvatarImage}
                                        />
                                    </View>
                                    {/* Broker Name */}
                                    <Text style={styles.brokerName} numberOfLines={1}>
                                        {story.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Results Count */}
                <View style={styles.resultsSection}>
                    <Text style={styles.resultsText}>
                        {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
                    </Text>
                </View>

                {/* Properties List */}
                {filteredProperties.length > 0 ? (
                    <View style={styles.propertiesContainer}>
                        {filteredProperties.map((property) => (
                            <View key={property.id} style={styles.cardWrapper}>
                                <PropertyCard
                                    property={property}
                                    onPress={() => handlePropertyPress(property)}
                                    fullWidth={true}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="home-outline" size={64} color={colors.textTertiary} />
                        <Text style={styles.emptyTitle}>No Properties Found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try adjusting your search or filters
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Buy/Rent Modal */}
            {renderBottomSheet(
                showBuyRentModal,
                () => closeModal(setShowBuyRentModal),
                null,
                <View style={styles.transactionModalContent}>
                    <View style={styles.transactionButtonsRow}>
                        {transactionTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.transactionModalButton,
                                    activeTransaction === type && styles.activeTransactionModalButton
                                ]}
                                onPress={() => {
                                    setActiveTransaction(type);
                                    closeModal(setShowBuyRentModal);
                                }}
                            >
                                <Text style={[
                                    styles.transactionModalButtonText,
                                    activeTransaction === type && styles.activeTransactionModalButtonText
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Property Type Modal */}
            {renderBottomSheet(
                showPropertyTypeModal,
                () => closeModal(setShowPropertyTypeModal),
                'Property Types',
                <View style={styles.propertyTypeModalContent}>
                    {/* Category Tabs */}
                    <View style={styles.categoryTabsRow}>
                        {propertyTypeFilters.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryTab,
                                    activePropertyType === category && styles.activeCategoryTab
                                ]}
                                onPress={() => setActivePropertyType(category)}
                            >
                                <Text style={[
                                    styles.categoryTabText,
                                    activePropertyType === category && styles.activeCategoryTabText
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Property Type Grid */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.propertyTypeGrid}
                    >
                        {getPropertyTypesForCategory().map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.propertyTypeCard,
                                    selectedPropertySubTypes.includes(type.id) && styles.selectedPropertyTypeCard
                                ]}
                                onPress={() => togglePropertySubType(type.id)}
                            >
                                <Ionicons
                                    name={type.icon}
                                    size={28}
                                    color={selectedPropertySubTypes.includes(type.id) ? colors.filterRed : colors.textSecondary}
                                />
                                <Text style={[
                                    styles.propertyTypeCardText,
                                    selectedPropertySubTypes.includes(type.id) && styles.selectedPropertyTypeCardText
                                ]}>
                                    {type.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Apply Button */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={() => closeModal(setShowPropertyTypeModal)}
                    >
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                </View>,
                'home-outline'
            )}

            {/* Beds Modal */}
            {renderBottomSheet(
                showBedsModal,
                () => closeModal(setShowBedsModal),
                'Bedrooms',
                <View style={styles.optionsModalContent}>
                    <View style={styles.optionsGrid}>
                        {bedsOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionPill,
                                    selectedBeds === option && styles.selectedOptionPill
                                ]}
                                onPress={() => {
                                    setSelectedBeds(option === selectedBeds ? '' : option);
                                    closeModal(setShowBedsModal);
                                }}
                            >
                                <Text style={[
                                    styles.optionPillText,
                                    selectedBeds === option && styles.selectedOptionPillText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>,
                'bed-outline'
            )}

            {/* Price Modal */}
            {renderBottomSheet(
                showPriceModal,
                () => closeModal(setShowPriceModal),
                'Price Range',
                <View style={styles.optionsModalContent}>
                    <View style={styles.optionsGrid}>
                        {priceRanges.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionPill,
                                    selectedPrice === option && styles.selectedOptionPill
                                ]}
                                onPress={() => {
                                    setSelectedPrice(option === selectedPrice ? '' : option);
                                    closeModal(setShowPriceModal);
                                }}
                            >
                                <Text style={[
                                    styles.optionPillText,
                                    selectedPrice === option && styles.selectedOptionPillText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>,
                'pricetag-outline'
            )}

            {/* Area Modal */}
            {renderBottomSheet(
                showAreaModal,
                () => closeModal(setShowAreaModal),
                'Area Size',
                <View style={styles.optionsModalContent}>
                    <View style={styles.optionsGrid}>
                        {areaRanges.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionPill,
                                    selectedArea === option && styles.selectedOptionPill
                                ]}
                                onPress={() => {
                                    setSelectedArea(option === selectedArea ? '' : option);
                                    closeModal(setShowAreaModal);
                                }}
                            >
                                <Text style={[
                                    styles.optionPillText,
                                    selectedArea === option && styles.selectedOptionPillText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>,
                'resize-outline'
            )}

            {/* Baths Modal */}
            {renderBottomSheet(
                showBathsModal,
                () => closeModal(setShowBathsModal),
                'Bathrooms',
                <View style={styles.optionsModalContent}>
                    <View style={styles.optionsGrid}>
                        {bathsOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionPill,
                                    selectedBaths === option && styles.selectedOptionPill
                                ]}
                                onPress={() => {
                                    setSelectedBaths(option === selectedBaths ? '' : option);
                                    closeModal(setShowBathsModal);
                                }}
                            >
                                <Text style={[
                                    styles.optionPillText,
                                    selectedBaths === option && styles.selectedOptionPillText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>,
                'water-outline'
            )}

            {/* Story Viewer */}
            <StoryViewer
                visible={showStoryViewer}
                stories={stories}
                initialIndex={selectedStoryIndex}
                onClose={() => setShowStoryViewer(false)}
            />
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

    // Hero Section
    heroSection: {
        backgroundColor: '#FFF5F5',
        paddingTop: 44,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(185, 28, 28, 0.08)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    backButton: {
        zIndex: 1,
    },
    backButtonContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(153, 27, 27, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 0,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(153, 27, 27, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: 'Lato_700Bold',
        color: '#991B1B',
        letterSpacing: -0.3,
    },

    // Search Section
    searchSection: {
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingTop: 12,
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
        gap: 8,
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
        gap: 3,
    },
    saveButtonText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.filterRed,
    },

    // Filter Bar
    filterBarContainer: {
        backgroundColor: colors.white,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 6,
    },
    filterIconButton: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.filterRed,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        gap: 3,
    },
    buyButtonText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
    },
    quickFilterPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeQuickFilterPill: {
        backgroundColor: colors.filterRed,
        borderColor: colors.filterRed,
    },
    quickFilterText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeQuickFilterText: {
        color: colors.white,
    },
    dropdownPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 3,
    },
    activeDropdownPill: {
        backgroundColor: colors.filterRed,
        borderColor: colors.filterRed,
    },
    dropdownPillText: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeDropdownPillText: {
        color: colors.white,
    },

    // TruBroker Row
    truBrokerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colors.lightGray,
    },
    truBrokerText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginRight: 4,
    },
    truBrokerBold: {
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },
    truBrokerSwitch: {
        marginLeft: 'auto',
    },

    // Stories Section
    storiesSection: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    storiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    storiesIconContainer: {
        marginRight: 8,
    },
    storiesTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    storiesBold: {
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },
    storiesContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    storyCard: {
        width: 100,
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
    },
    storyImageContainer: {
        flex: 1,
        position: 'relative',
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    storyGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    liveIndicator: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.white,
        marginRight: 4,
    },
    liveText: {
        fontSize: 9,
        fontFamily: 'Lato_900Black',
        color: colors.white,
        letterSpacing: 0.5,
    },
    brokerAvatar: {
        position: 'absolute',
        bottom: 30,
        left: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.white,
        overflow: 'hidden',
    },
    brokerAvatarImage: {
        width: '100%',
        height: '100%',
    },
    brokerName: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // Results Section
    resultsSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
    },
    resultsText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },

    // Properties Container
    propertiesContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    cardWrapper: {
        marginBottom: 16,
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    bottomSheetTitle: {
        fontSize: 17,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },

    // Transaction Modal
    transactionModalContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    transactionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    transactionModalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeTransactionModalButton: {
        backgroundColor: colors.filterRedLight,
        borderColor: colors.filterRed,
    },
    transactionModalButtonText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeTransactionModalButtonText: {
        color: colors.filterRed,
    },

    // Property Type Modal
    propertyTypeModalContent: {
        paddingHorizontal: 20,
    },
    categoryTabsRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 12,
    },
    categoryTab: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeCategoryTab: {
        backgroundColor: colors.filterRedLight,
        borderColor: colors.filterRed,
    },
    categoryTabText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeCategoryTabText: {
        color: colors.filterRed,
    },
    propertyTypeGrid: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 20,
    },
    propertyTypeCard: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPropertyTypeCard: {
        backgroundColor: colors.filterRedLight,
        borderColor: colors.filterRed,
    },
    propertyTypeCardText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    selectedPropertyTypeCardText: {
        color: colors.filterRed,
    },
    applyButton: {
        backgroundColor: colors.filterRed,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        fontSize: 15,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
    },

    // Options Modal
    optionsModalContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedOptionPill: {
        backgroundColor: colors.filterRed,
        borderColor: colors.filterRed,
    },
    optionPillText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    selectedOptionPillText: {
        color: colors.white,
    },
});

export default PropertiesScreen;


