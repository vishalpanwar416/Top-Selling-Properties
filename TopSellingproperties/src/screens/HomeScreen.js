import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import NewProjectCard from '../components/NewProjectCard';
import CityPropertiesModal from '../components/CityPropertiesModal';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';
import categoriesData from '../data/categories.json';

const propertyCategories = categoriesData.propertyCategories;
const transactionTypes = categoriesData.transactionTypes;

const uaeLocations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah'];
const STICKY_THRESHOLD = 120; // When search bar becomes sticky

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [activeType, setActiveType] = useState('Rent');
    const [activeLocation, setActiveLocation] = useState('Dubai');
    const [properties, setProperties] = useState(propertiesData.properties);
    const [isSticky, setIsSticky] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    
    const scrollY = useRef(new Animated.Value(0)).current;

    const filteredProperties = properties.filter(property =>
        (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* 1. Hero Content & Welcome */}
                <View style={styles.heroSection}>
                    <Header navigation={navigation} transparent />
                    <View style={styles.heroContent}>
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle}>Find Your Dream Property</Text>
                            <Text style={styles.welcomeSubtitle}>Discover premium real estate in UAE</Text>
                        </View>
                    </View>
                </View>

                {/* 2. Sticky Search Bar - sticks to top when scrolling */}
                <SearchBar 
                    onPress={() => navigation.navigate('Search')}
                    value={searchQuery}
                    isSticky={isSticky}
                />

                {/* 3. Category Pills & Transaction Types */}
                <View style={styles.filtersSection}>
                    {/* Category Pills */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryContainer}
                        contentContainerStyle={styles.categoryContent}
                    >
                        {propertyCategories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryPill,
                                    activeCategory === cat && styles.activeCategoryPill
                                ]}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.categoryPillText,
                                    activeCategory === cat && styles.activeCategoryPillText
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Transaction Types */}
                    <View style={styles.transactionContainer}>
                        {transactionTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.transactionButton,
                                    activeType === type && styles.activeTransactionButton
                                ]}
                                onPress={() => setActiveType(type)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.transactionText,
                                    activeType === type && styles.activeTransactionText
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 4. Gradient Section with Browse New Projects + Featured Properties */}
                <LinearGradient
                    colors={[colors.maroon, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientSection}
                >
                    {/* Browse New Projects Section */}
                    <View style={styles.newProjectsSection}>
                        <Text style={styles.sectionTitleWhite}>Browse New Projects in UAE</Text>
                        
                        {/* Location Tabs */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.locationTabsContainer}
                            contentContainerStyle={styles.locationTabsContent}
                        >
                            {uaeLocations.map((location) => (
                                <TouchableOpacity
                                    key={location}
                                    style={[
                                        styles.locationTab,
                                        activeLocation === location && styles.activeLocationTab
                                    ]}
                                    onPress={() => setActiveLocation(location)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.locationTabText,
                                        activeLocation === location && styles.activeLocationTabText
                                    ]}>
                                        {location}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Horizontal Project Cards */}
                        <FlatList
                            data={filteredProperties.slice(0, 5)}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            renderItem={({ item }) => (
                                <NewProjectCard
                                    project={item}
                                    onPress={() => handlePropertyPress(item)}
                                />
                            )}
                        />

                        {/* View All Button */}
                        <TouchableOpacity 
                            style={styles.viewAllButton} 
                            activeOpacity={0.8}
                            onPress={() => setShowCityModal(true)}
                        >
                            <Text style={styles.viewAllText}>View All Projects in {activeLocation}</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Featured Properties Section */}
                    <View style={styles.featuredSection}>
                        <View style={styles.propertiesSectionHeader}>
                            <Text style={styles.propertiesSectionTitle}>Featured Properties</Text>
                            <TouchableOpacity style={styles.seeAllButton}>
                                <Text style={styles.seeAllText}>See All</Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.propertyCardsContainer}
                        >
                            {filteredProperties.map((item) => (
                                <PropertyCard
                                    key={item.id}
                                    property={item}
                                    onPress={() => handlePropertyPress(item)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </LinearGradient>
            </ScrollView>

            {/* City Properties Modal */}
            <CityPropertiesModal
                visible={showCityModal}
                onClose={() => setShowCityModal(false)}
                city={activeLocation}
                properties={filteredProperties}
                onPropertyPress={handlePropertyPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    heroSection: {
        backgroundColor: colors.white,
        paddingBottom: 20,
    },
    heroContent: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    welcomeSection: {
        marginBottom: 10,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.black,
        marginBottom: 4,
        letterSpacing: -0.8,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    
    // New Projects Section (inside gradient)
    newProjectsSection: {
        paddingBottom: 24,
    },
    sectionTitleWhite: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 16,
        paddingHorizontal: 20,
        letterSpacing: -0.3,
    },
    locationTabsContainer: {
        marginBottom: 20,
    },
    locationTabsContent: {
        paddingHorizontal: 20,
    },
    locationTab: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeLocationTab: {
        backgroundColor: colors.white,
        borderColor: colors.white,
    },
    locationTabText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    activeLocationTabText: {
        color: colors.primary,
    },
    projectCardsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    viewAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
        marginRight: 4,
    },
    featuredSection: {
        paddingTop: 8,
    },

    // Filters Section (below search bar)
    filtersSection: {
        backgroundColor: colors.white,
        paddingTop: 8,
        paddingBottom: 16,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryContent: {
        paddingHorizontal: 20,
    },
    categoryPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeCategoryPill: {
        backgroundColor: colors.black,
        borderColor: colors.black,
    },
    categoryPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    activeCategoryPillText: {
        color: colors.white,
    },
    transactionContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        padding: 6,
        marginHorizontal: 20,
    },
    transactionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    activeTransactionButton: {
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    transactionText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    activeTransactionText: {
        color: colors.primary,
    },

    // Properties Section with Gradient
    gradientSection: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 24,
        paddingBottom: 40,
        minHeight: Dimensions.get('window').height * 0.4,
    },
    propertiesSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    propertiesSectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -0.3,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    seeAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.white,
        marginRight: 4,
    },
    propertyCardsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});

export default HomeScreen;
