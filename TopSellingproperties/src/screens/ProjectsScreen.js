import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import NewProjectCard from '../components/NewProjectCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const { width } = Dimensions.get('window');
const uaeLocations = ['All', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah'];

const ProjectsScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLocation, setActiveLocation] = useState('All');
    const [projects, setProjects] = useState(propertiesData.properties);

    // Filter projects based on search and location
    const filteredProjects = projects.filter(project => {
        const matchesSearch = 
            (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (project.location && project.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (project.city && project.city.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesLocation = activeLocation === 'All' || 
            project.city === activeLocation || 
            (project.location && project.location.includes(activeLocation));
        
        return matchesSearch && matchesLocation;
    });

    const handleProjectPress = (project) => {
        navigation.navigate('PropertyDetails', { property: project });
    };

    const handleSearchPress = () => {
        navigation.navigate('Search');
    };

    const renderProjectCard = ({ item, index }) => {
        const isLastItem = index === filteredProjects.length - 1;
        return (
            <View style={[styles.cardWrapper, isLastItem && styles.lastCard]}>
                <NewProjectCard
                    project={item}
                    onPress={() => handleProjectPress(item)}
                    fullWidth={true}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Header navigation={navigation} />
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>New Projects</Text>
                        <Text style={styles.subtitle}>Discover premium real estate projects in UAE</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <SearchBar
                        onPress={handleSearchPress}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        editable={true}
                    />
                </View>

                {/* Location Filter Tabs */}
                <View style={styles.locationSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
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
                </View>

                {/* Results Count */}
                <View style={styles.resultsSection}>
                    <Text style={styles.resultsText}>
                        {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
                    </Text>
                </View>

                {/* Projects List */}
                {filteredProjects.length > 0 ? (
                    <View style={styles.projectsContainer}>
                        {filteredProjects.map((project, index) => (
                            <View key={project.id} style={styles.cardWrapper}>
                                <NewProjectCard
                                    project={project}
                                    onPress={() => handleProjectPress(project)}
                                    fullWidth={true}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="business-outline" size={64} color={colors.textTertiary} />
                        <Text style={styles.emptyTitle}>No Projects Found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try adjusting your search or location filter
                        </Text>
                    </View>
                )}
            </ScrollView>
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
    headerSection: {
        backgroundColor: colors.white,
        paddingBottom: 16,
    },
    headerContent: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.black,
        marginBottom: 6,
        letterSpacing: -0.8,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        fontFamily: 'Poppins_500Medium',
    },
    searchContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    locationSection: {
        backgroundColor: colors.white,
        paddingBottom: 16,
    },
    locationTabsContent: {
        paddingHorizontal: 20,
    },
    locationTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#F8F9FB',
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeLocationTab: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    locationTabText: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    activeLocationTabText: {
        color: colors.white,
    },
    resultsSection: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: colors.white,
    },
    resultsText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    projectsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    cardWrapper: {
        marginBottom: 20,
    },
    lastCard: {
        marginBottom: 0,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default ProjectsScreen;
