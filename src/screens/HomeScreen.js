import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import NewProjectCard from '../components/NewProjectCard';
import colors from '../theme/colors';
import projectsData from '../data/projects.json';
import contentData from '../data/content.json';
import homeSectionsData from '../data/homeSections.json';

const INDIA_LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
const locationsList = Array.isArray(contentData?.locations) ? contentData.locations : INDIA_LOCATIONS;
const STICKY_THRESHOLD = 120; // When search bar becomes sticky

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLocation, setActiveLocation] = useState('Mumbai');
    const [projects, setProjects] = useState(Array.isArray(projectsData?.projects) ? projectsData.projects : []);
    const [isSticky, setIsSticky] = useState(false);

    const credaiProjects = homeSectionsData?.credaiVerifiedBuilderProjects ?? [];
    const reraProjects = homeSectionsData?.reraVerifiedBuilderProjects ?? [];
    const verifiedDevelopers = homeSectionsData?.credaiVerifiedDevelopers ?? [];

    // Helper function to check if project matches location
    const matchesProjectLocation = (project, location) => {
        if (!location) return true;
        return (
            (project.city && project.city.toLowerCase() === location.toLowerCase()) ||
            (project.location && project.location.toLowerCase().includes(location.toLowerCase()))
        );
    };

    // Filter projects by location
    const filteredProjects = projects.filter(project => matchesProjectLocation(project, activeLocation));

    const handleProjectPress = (project) => {
        navigation.navigate('ProjectDetail', { project });
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
                nestedScrollEnabled={true}
                bounces={true}
            >
                {/* 1. Hero Content & Welcome */}
                <View style={styles.heroSection}>
                    <Header navigation={navigation} transparent />
                    <View style={styles.heroContent}>
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle} numberOfLines={1}>{contentData?.home?.welcomeTitle ?? 'Find Your Dream Home'}</Text>
                            <Text style={styles.welcomeSubtitle}>{contentData?.home?.welcomeSubtitle ?? 'Discover premium real estate in India'}</Text>
                        </View>
                    </View>
                </View>

                {/* 2. Sticky Search Bar - sticks to top when scrolling */}
                <SearchBar
                    onPress={() => navigation.navigate('Search')}
                    value={searchQuery}
                    isSticky={isSticky}
                    searchType="general"
                />

                {/* 3. Gradient Section with Browse New Projects */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientSection}
                >
                    {/* Browse New Projects Section */}
                    <View style={styles.newProjectsSection}>
                        <Text style={styles.sectionTitleWhite}>{contentData?.home?.browseProjectsTitle ?? 'Browse New Projects in India'}</Text>

                        {/* Location Tabs */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.locationTabsContainer}
                            contentContainerStyle={styles.locationTabsContent}
                            nestedScrollEnabled={true}
                        >
                            {(locationsList || INDIA_LOCATIONS).map((location) => (
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

                        {/* Horizontal Project Cards - Filter by active location */}
                        <FlatList
                            data={filteredProjects.slice(0, 5)}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <NewProjectCard
                                    project={item}
                                    onPress={() => handleProjectPress(item)}
                                />
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyProjectsContainer}>
                                    <Text style={styles.emptyProjectsText}>No projects in {activeLocation}</Text>
                                </View>
                            }
                        />

                        {/* View All Button - navigate to Projects tab */}
                        <TouchableOpacity
                            style={styles.viewAllButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('MainTabs', { screen: 'Projects' })}
                        >
                            <Text style={styles.viewAllText}>{contentData?.home?.viewAllProjects ?? 'View All Projects in'} {activeLocation}</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Credai Verified Builder Projects */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Credai Verified Builder Projects</Text>
                        <FlatList
                            data={credaiProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <NewProjectCard
                                    project={item}
                                    onPress={() => handleProjectPress(item)}
                                />
                            )}
                        />
                    </View>

                    {/* RERA Verified Builder Projects */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>RERA Verified Builder Projects</Text>
                        <FlatList
                            data={reraProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <NewProjectCard
                                    project={item}
                                    onPress={() => handleProjectPress(item)}
                                />
                            )}
                        />
                    </View>

                    {/* Credai Verified Developers */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Credai Verified Developers</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.developersContainer}
                            nestedScrollEnabled={true}
                        >
                            {verifiedDevelopers.map((dev) => (
                                <TouchableOpacity
                                    key={dev.id}
                                    style={styles.developerCard}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('MainTabs', { screen: 'Projects' })}
                                >
                                    <Image
                                        source={{ uri: dev.logo }}
                                        style={styles.developerLogo}
                                    />
                                    <Text style={styles.developerName} numberOfLines={2}>{dev.name}</Text>
                                    <View style={styles.developerBadge}>
                                        <Ionicons name="shield-checkmark" size={12} color={colors.white} />
                                        <Text style={styles.developerBadgeText}>{dev.badge}</Text>
                                    </View>
                                    <Text style={styles.developerCount}>{dev.projectsCount} Projects</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </LinearGradient>
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
        paddingBottom: 8,
    },
    heroContent: {
        paddingHorizontal: 20,
        marginTop: -8,
    },
    welcomeSection: {
        marginBottom: 4,
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: 'Lato_700Bold',
        color: colors.black,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    welcomeSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        fontFamily: 'Lato_400Regular',
    },

    newProjectsSection: {
        paddingBottom: 16,
    },
    sectionTitleWhite: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        marginBottom: 12,
        paddingHorizontal: 20,
        letterSpacing: -0.3,
    },
    locationTabsContainer: {
        marginBottom: 12,
    },
    locationTabsContent: {
        paddingHorizontal: 20,
    },
    locationTab: {
        paddingHorizontal: 12,
        paddingVertical: 3,
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
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
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
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    viewAllText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
        marginRight: 4,
    },
    // Gradient Section
    gradientSection: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 16,
        paddingBottom: 40,
    },
    emptyProjectsContainer: {
        width: 280,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        marginLeft: 20,
    },
    emptyProjectsText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
    },
    verifiedSection: {
        marginTop: 24,
        paddingBottom: 8,
    },
    developersContainer: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    developerCard: {
        width: 140,
        marginRight: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    developerLogo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 8,
    },
    developerName: {
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 6,
    },
    developerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 4,
    },
    developerBadgeText: {
        fontSize: 9,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        marginLeft: 4,
    },
    developerCount: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
    },
});

export default HomeScreen;
