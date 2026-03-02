import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import NewProjectCard from '../components/NewProjectCard';
import ProjectCardRecommended from '../components/ProjectCardRecommended';
import ProjectCardOverlay from '../components/ProjectCardOverlay';
import ProjectCardCompact from '../components/ProjectCardCompact';
import DeveloperCardClassic from '../components/DeveloperCardClassic';
import DeveloperCardHorizontal from '../components/DeveloperCardHorizontal';
import DeveloperCardStats from '../components/DeveloperCardStats';
import DeveloperCardMinimal from '../components/DeveloperCardMinimal';
import colors from '../theme/colors';
import projectsData from '../data/projects.json';
import contentData from '../data/content.json';
import homeSectionsData from '../data/homeSections.json';
import homeLoansData from '../data/homeLoans.json';

const INDIA_LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
const locationsList = Array.isArray(contentData?.locations) ? contentData.locations : INDIA_LOCATIONS;
const STICKY_THRESHOLD = 120; // When search bar becomes sticky

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLocation, setActiveLocation] = useState('Bangalore');
    const [projects, setProjects] = useState(Array.isArray(projectsData?.projects) ? projectsData.projects : []);
    const [isSticky, setIsSticky] = useState(false);

    const credaiProjects = homeSectionsData?.credaiVerifiedBuilderProjects ?? [];
    const verifiedDevelopers = homeSectionsData?.credaiVerifiedDevelopers ?? [];
    const featuredProjectsGallery = homeSectionsData?.featuredProjectsGallery ?? [];
    const topProjects = homeSectionsData?.topProjects ?? [];
    const bestOfferProjects = homeSectionsData?.bestOfferProjects ?? [];
    const trendingProjects = homeSectionsData?.trendingProjects ?? [];
    const readyToMoveProjects = homeSectionsData?.readyToMoveProjects ?? [];
    const newlyLaunchedProjects = homeSectionsData?.newlyLaunchedProjects ?? [];
    const completedProjects = homeSectionsData?.completedProjects ?? [];
    const topDevelopers = homeSectionsData?.topDevelopers ?? [];
    const featuredDevelopers = homeSectionsData?.featuredDevelopers ?? [];
    const developersInCity = (verifiedDevelopers || []).filter(
        (d) => (d.location || '').toLowerCase().includes((activeLocation || '').toLowerCase())
    );
    const homeLoanOffers = (homeLoansData?.partners || []).slice(0, 4);

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
                        {filteredProjects.length === 0 ? (
                            <View style={styles.noProjectsInLocation}>
                                <Text style={styles.noProjectsInLocationText}>There is no project in {activeLocation}</Text>
                            </View>
                        ) : (
                            <>
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
                                />
                                <TouchableOpacity
                                    style={styles.viewAllButton}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('MainTabs', { screen: 'Projects' })}
                                >
                                    <Text style={styles.viewAllText}>{contentData?.home?.viewAllProjects ?? 'View All Projects in'} {activeLocation}</Text>
                                    <Ionicons name="chevron-forward" size={18} color={colors.white} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Home Loan Options - Ad-style cards */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Home Loan Options</Text>
                        <Text style={styles.sectionSubtitleWhite}>Best rates from partner banks. Quick approval.</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.homeLoanAdsContainer}
                            nestedScrollEnabled={true}
                        >
                            {homeLoanOffers.map((offer) => (
                                <TouchableOpacity
                                    key={offer.id}
                                    style={styles.homeLoanAdCard}
                                    onPress={() => navigation.navigate('MainTabs', { screen: 'More', params: { screen: 'HomeLoan' } })}
                                    activeOpacity={0.85}
                                >
                                    <View style={styles.homeLoanAdIconWrap}>
                                        <Ionicons name="business" size={28} color={colors.white} />
                                    </View>
                                    <Text style={styles.homeLoanAdName} numberOfLines={2}>{offer.name}</Text>
                                    <Text style={styles.homeLoanAdRate}>From {offer.rate}% p.a.</Text>
                                    <View style={styles.homeLoanAdCta}>
                                        <Text style={styles.homeLoanAdCtaText}>Apply</Text>
                                        <Ionicons name="arrow-forward" size={14} color={colors.white} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.homeLoanAdCardViewAll}
                                onPress={() => navigation.navigate('MainTabs', { screen: 'More', params: { screen: 'HomeLoan' } })}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="add-circle-outline" size={32} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.homeLoanAdViewAllText}>View all</Text>
                                <Text style={styles.homeLoanAdViewAllSub}>Loans & eligibility</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* 1. Featured Projects Gallery - Recommended style */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Featured Projects Gallery</Text>
                        <FlatList
                            data={featuredProjectsGallery}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <ProjectCardRecommended project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 2. Top Developers - Horizontal card */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Top Developers</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.developersContainer} nestedScrollEnabled={true}>
                            {topDevelopers.map((dev) => (
                                <DeveloperCardHorizontal key={dev.id} developer={dev} onPress={() => navigation.navigate('DeveloperProfile', { developer: dev })} />
                            ))}
                        </ScrollView>
                    </View>

                    {/* 3. Top Projects - Overlay style */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Top Projects</Text>
                        <FlatList
                            data={topProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <ProjectCardOverlay project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 4. Credai Verified Developers - Classic translucent */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Credai Verified Developers</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.developersContainer} nestedScrollEnabled={true}>
                            {verifiedDevelopers.map((dev) => (
                                <DeveloperCardClassic key={dev.id} developer={dev} onPress={() => navigation.navigate('DeveloperProfile', { developer: dev })} />
                            ))}
                        </ScrollView>
                    </View>

                    {/* 5. Best Offer Projects - Compact strip style */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Best Offer Projects</Text>
                        <FlatList
                            data={bestOfferProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <ProjectCardCompact project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 6. Featured Developers - Stats card */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Featured Developers</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.developersContainer} nestedScrollEnabled={true}>
                            {featuredDevelopers.map((dev) => (
                                <DeveloperCardStats key={dev.id} developer={dev} onPress={() => navigation.navigate('DeveloperProfile', { developer: dev })} />
                            ))}
                        </ScrollView>
                    </View>

                    {/* 7. Trending Projects - Default card */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Trending Projects</Text>
                        <FlatList
                            data={trendingProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <NewProjectCard project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 8. Ready to Move Projects - Recommended style */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Ready to Move Projects</Text>
                        <FlatList
                            data={readyToMoveProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <ProjectCardRecommended project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 9. Developers in [City] - with location pills */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Developers in {activeLocation || 'Bangalore'}</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.developerPillsContainer}
                            contentContainerStyle={styles.developerPillsContent}
                        >
                            {(locationsList || INDIA_LOCATIONS).map((loc) => (
                                <TouchableOpacity
                                    key={loc}
                                    style={[
                                        styles.developerPill,
                                        (activeLocation || 'Bangalore') === loc && styles.developerPillActive
                                    ]}
                                    onPress={() => setActiveLocation(loc)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.developerPillText,
                                        (activeLocation || 'Bangalore') === loc && styles.developerPillTextActive
                                    ]}>
                                        {loc}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.developersContainer} nestedScrollEnabled={true}>
                            {developersInCity.length > 0 ? developersInCity.map((dev) => (
                                <DeveloperCardMinimal key={dev.id} developer={dev} onPress={() => navigation.navigate('DeveloperProfile', { developer: dev })} />
                            )) : (
                                <View style={styles.emptyDevelopers}>
                                    <Text style={styles.emptyDevelopersText}>No developers in {activeLocation || 'Bangalore'}. Try another city.</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* 10. Credai Verified Projects - Overlay style */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Credai Verified Projects</Text>
                        <FlatList
                            data={credaiProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <ProjectCardOverlay project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 11. Newly Launched Projects - Compact strip style */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Newly Launched Projects</Text>
                        <FlatList
                            data={newlyLaunchedProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <ProjectCardCompact project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
                    </View>

                    {/* 12. Completed / Sold Out Projects */}
                    <View style={styles.verifiedSection}>
                        <Text style={styles.sectionTitleWhite}>Completed / Sold Out Projects</Text>
                        <FlatList
                            data={completedProjects}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.projectCardsContainer}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <NewProjectCard project={item} onPress={() => handleProjectPress(item)} />
                            )}
                        />
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
    sectionSubtitleWhite: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        marginTop: -8,
        marginBottom: 12,
        paddingHorizontal: 20,
        fontFamily: 'Lato_400Regular',
    },
    homeLoanAdsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 8,
        gap: 12,
    },
    homeLoanAdCard: {
        width: 160,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: 16,
        padding: 14,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    homeLoanAdIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    homeLoanAdName: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 4,
    },
    homeLoanAdRate: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 10,
    },
    homeLoanAdCta: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    homeLoanAdCtaText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
    },
    homeLoanAdCardViewAll: {
        width: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        padding: 14,
        marginRight: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeLoanAdViewAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
        marginTop: 8,
    },
    homeLoanAdViewAllSub: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
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
    noProjectsInLocation: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProjectsInLocationText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        textAlign: 'center',
    },
    verifiedSection: {
        marginTop: 24,
        paddingBottom: 8,
    },
    developerPillsContainer: {
        marginBottom: 10,
    },
    developerPillsContent: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        gap: 8,
    },
    developerPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    developerPillActive: {
        backgroundColor: colors.white,
        borderColor: colors.white,
    },
    developerPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    developerPillTextActive: {
        color: colors.primary,
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
    emptyDevelopers: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        minWidth: 200,
        justifyContent: 'center',
    },
    emptyDevelopersText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

export default HomeScreen;
