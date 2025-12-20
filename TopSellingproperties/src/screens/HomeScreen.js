import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import NewProjectCard from '../components/NewProjectCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';
import categoriesData from '../data/categories.json';

const propertyCategories = categoriesData.propertyCategories;
const transactionTypes = categoriesData.transactionTypes;

const uaeLocations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah'];

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [activeType, setActiveType] = useState('Rent');
    const [activeLocation, setActiveLocation] = useState('Dubai');
    const [properties, setProperties] = useState(propertiesData.properties);

    const filteredProperties = properties.filter(property =>
        (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
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

                {/* 2. Search Bar Container */}
                <View style={styles.stickySearchWrapper}>
                    <TouchableOpacity
                        style={styles.searchBox}
                        onPress={() => navigation.navigate('Search')}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
                        <Text style={[styles.searchInput, !searchQuery && styles.searchPlaceholder]}>
                            {searchQuery || 'Search for a locality, area or city'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 3. Browse New Projects Section */}
                <View style={styles.newProjectsSection}>
                    <Text style={styles.sectionTitle}>Browse New Projects in UAE</Text>
                    
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
                    <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
                        <Text style={styles.viewAllText}>View All Projects in {activeLocation}</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* 4. Filters Section */}
                <View style={styles.filtersSection}>
                    <Text style={styles.sectionTitle}>Find Properties</Text>
                    
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

                {/* 5. Property Cards Section */}
                <View style={styles.propertiesSection}>
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

                {/* Bottom Spacer */}
                <View style={{ height: 40 }} />
            </ScrollView>
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
    stickySearchWrapper: {
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    searchPlaceholder: {
        color: colors.textTertiary,
    },
    
    // New Projects Section
    newProjectsSection: {
        paddingTop: 24,
        paddingBottom: 16,
        backgroundColor: colors.white,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 25,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    activeLocationTab: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        borderColor: colors.primary,
    },
    locationTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
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
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    viewAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
        marginRight: 4,
    },

    // Filters Section
    filtersSection: {
        backgroundColor: colors.white,
        paddingTop: 24,
        paddingBottom: 20,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryContent: {
        paddingHorizontal: 20,
    },
    categoryPill: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeCategoryPill: {
        backgroundColor: colors.black,
        borderColor: colors.black,
    },
    categoryPillText: {
        fontSize: 13,
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

    // Properties Section
    propertiesSection: {
        backgroundColor: colors.lightGray,
        paddingVertical: 20,
    },
    propertyCardsContainer: {
        paddingHorizontal: 20,
    },
});

export default HomeScreen;
