import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';
import categoriesData from '../data/categories.json';

const { width } = Dimensions.get('window');

const propertyCategories = categoriesData.propertyCategories;
const transactionTypes = categoriesData.transactionTypes;

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [activeType, setActiveType] = useState('Rent');
    const [properties, setProperties] = useState(propertiesData.properties);

    const filteredProperties = properties.filter(property =>
        (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Hero Section with Gradient Background */}
            <View style={styles.heroSection}>
                <Header navigation={navigation} transparent />
                
                <View style={styles.heroContent}>
                    {/* Welcome Text */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeTitle}>Find Your Dream Property</Text>
                        <Text style={styles.welcomeSubtitle}>Discover premium real estate in UAE</Text>
                    </View>

                    {/* Modern Search Bar */}
                    <TouchableOpacity 
                        style={styles.searchContainer}
                        onPress={() => navigation.navigate('Search')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
                            <Text style={[styles.searchInput, !searchQuery && styles.searchPlaceholder]}>
                                {searchQuery || 'Search location, area, or city'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Category Pills - Modern Design */}
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

                    {/* Transaction Types - Modern Segmented Control */}
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
            </View>

            {/* Results Header */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                    {filteredProperties.length} Properties Available
                </Text>
                <TouchableOpacity>
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={[colors.maroon, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.container, styles.gradientContainer]}
        >
            <FlatList
                data={filteredProperties}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <PropertyCard
                        property={item}
                        onPress={() => handlePropertyPress(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    headerContainer: {
        backgroundColor: colors.white,
    },
    heroSection: {
        backgroundColor: colors.white,
        paddingBottom: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    heroContent: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    welcomeSection: {
        marginBottom: 24,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '400',
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 56,
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '400',
    },
    searchPlaceholder: {
        color: colors.textTertiary,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryContent: {
        paddingRight: 20,
    },
    categoryPill: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    activeCategoryPill: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    categoryPillText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textPrimary,
        letterSpacing: 0.2,
    },
    activeCategoryPillText: {
        color: colors.white,
    },
    transactionContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 14,
        padding: 4,
    },
    transactionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    activeTransactionButton: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    transactionText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 0.3,
    },
    activeTransactionText: {
        color: colors.white,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -0.3,
    },
    filterText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
    },
    listContent: {
        paddingBottom: 24,
    },
});

export default HomeScreen;
