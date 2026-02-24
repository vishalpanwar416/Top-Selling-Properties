import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NewProjectCard from '../components/NewProjectCard';
import colors from '../theme/colors';
import projectsData from '../data/projects.json';
import homeSectionsData from '../data/homeSections.json';

const DeveloperProfileScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const { developer: paramDeveloper } = route.params || {};

    const developer = useMemo(() => {
        const fromParams = paramDeveloper;
        if (!fromParams?.name) return fromParams;
        const list = homeSectionsData?.credaiVerifiedDevelopers ?? [];
        const name = (fromParams.name || '').trim().toLowerCase();
        const fromData = list.find((d) => (d.name || '').trim().toLowerCase() === name);
        return fromData ? { ...fromData, ...fromParams } : fromParams;
    }, [paramDeveloper]);

    const allProjects = useMemo(() => {
        const fromMain = Array.isArray(projectsData?.projects) ? projectsData.projects : [];
        const credai = homeSectionsData?.credaiVerifiedBuilderProjects ?? [];
        const rera = homeSectionsData?.reraVerifiedBuilderProjects ?? [];
        const combined = [...fromMain, ...credai, ...rera];
        const seen = new Set();
        return combined.filter((p) => {
            const id = p.id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, []);

    const developerProjects = useMemo(() => {
        if (!developer?.name) return [];
        const name = (developer.name || '').trim().toLowerCase();
        return allProjects.filter((p) => (p.developer || '').trim().toLowerCase() === name);
    }, [developer?.name, allProjects]);

    const completedProjects = useMemo(() => developerProjects.filter((p) => (p.completion || '').toLowerCase() === 'ready'), [developerProjects]);
    const ongoingProjects = useMemo(() => developerProjects.filter((p) => (p.completion || '').toLowerCase() === 'off-plan'), [developerProjects]);
    const upcomingProjects = useMemo(() => developerProjects.filter((p) => {
        const c = (p.completion || '').toLowerCase();
        return c !== 'ready' && c !== 'off-plan';
    }), [developerProjects]);

    const totalCount = developerProjects.length;
    const established = developer.established ?? '—';
    const experience = developer.experience ?? '—';
    const completedCount = completedProjects.length;

    const handleProjectPress = (project) => {
        navigation.navigate('ProjectDetail', { project });
    };

    const renderProjectList = (list) => (
        <View style={[styles.listContent, { paddingHorizontal: paddingH }]}>
            {list.map((item) => (
                <View key={item.id} style={[styles.cardWrap, { width: cardWidth }]}>
                    <NewProjectCard project={item} onPress={() => handleProjectPress(item)} />
                </View>
            ))}
        </View>
    );

    if (!developer) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.errorText}>Developer not found.</Text>
            </View>
        );
    }

    const paddingH = 16;
    const cardWidth = width - paddingH * 2;

    const hasAnyProjects = completedProjects.length > 0 || ongoingProjects.length > 0 || upcomingProjects.length > 0;
    const showPortfolioSections = hasAnyProjects;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero with gradient */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    style={styles.hero}
                >
                    <TouchableOpacity
                        style={[styles.backBtn, { top: insets.top + 8 }]}
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <View style={styles.heroContent}>
                        <View style={styles.logoWrap}>
                            <Image
                                source={{ uri: developer.logo || 'https://via.placeholder.com/120' }}
                                style={styles.logo}
                            />
                        </View>
                        <Text style={styles.developerName}>{developer.name}</Text>
                        {developer.location ? (
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.locationText}>{developer.location}</Text>
                            </View>
                        ) : null}
                        {developer.badge ? (
                            <View style={styles.badge}>
                                <Ionicons name="shield-checkmark" size={12} color={colors.white} />
                                <Text style={styles.badgeText}>{developer.badge}</Text>
                            </View>
                        ) : null}
                    </View>
                </LinearGradient>

                {/* Stats grid 2x2 */}
                <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{totalCount}</Text>
                            <Text style={styles.statLabel}>Total projects</Text>
                        </View>
                        <View style={[styles.statBox, styles.statBoxBorder]}>
                            <Text style={styles.statValue}>{established}</Text>
                            <Text style={styles.statLabel}>Established</Text>
                        </View>
                    </View>
                    <View style={[styles.statsRow, styles.statsRowBorder]}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{experience}</Text>
                            <Text style={styles.statLabel}>Experience</Text>
                        </View>
                        <View style={[styles.statBox, styles.statBoxBorder]}>
                            <Text style={styles.statValue}>{completedCount}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                    </View>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About the developer</Text>
                    <Text style={styles.aboutText}>
                        {developer.about || `${developer.name}${developer.location ? ` is a developer based in ${developer.location}.` : ' is a trusted real estate developer.'} ${totalCount > 0 ? `With ${totalCount} project${totalCount !== 1 ? 's' : ''} in the portfolio.` : ''}`}
                    </Text>
                </View>

                {/* Project portfolio – only show sections that have projects; one empty state otherwise */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project portfolio</Text>
                    {!showPortfolioSections ? (
                        <View style={styles.emptyPortfolio}>
                            <Ionicons name="business-outline" size={40} color={colors.gray} />
                            <Text style={styles.emptyPortfolioText}>No projects listed yet</Text>
                        </View>
                    ) : (
                        <>
                            {completedProjects.length > 0 && (
                                <>
                                    <Text style={styles.portfolioSubtitle}>Completed</Text>
                                    {renderProjectList(completedProjects)}
                                </>
                            )}
                            {ongoingProjects.length > 0 && (
                                <>
                                    <Text style={styles.portfolioSubtitle}>Ongoing</Text>
                                    {renderProjectList(ongoingProjects)}
                                </>
                            )}
                            {upcomingProjects.length > 0 && (
                                <>
                                    <Text style={styles.portfolioSubtitle}>Upcoming</Text>
                                    {renderProjectList(upcomingProjects)}
                                </>
                            )}
                        </>
                    )}
                </View>

                {/* Highlights – compact */}
                <View style={styles.highlightsWrap}>
                    <View style={styles.highlightChip}>
                        <Text style={styles.highlightChipText}>{totalCount} project{totalCount !== 1 ? 's' : ''}</Text>
                    </View>
                    {completedCount > 0 && (
                        <View style={styles.highlightChip}>
                            <Text style={styles.highlightChipText}>{completedCount} completed</Text>
                        </View>
                    )}
                    {ongoingProjects.length > 0 && (
                        <View style={styles.highlightChip}>
                            <Text style={styles.highlightChipText}>{ongoingProjects.length} ongoing</Text>
                        </View>
                    )}
                    {developer.badge && (
                        <View style={[styles.highlightChip, styles.highlightChipGreen]}>
                            <Text style={styles.highlightChipTextGreen}>{developer.badge}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    hero: {
        paddingTop: 48,
        paddingBottom: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backBtn: {
        position: 'absolute',
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    heroContent: {
        alignItems: 'center',
    },
    logoWrap: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.25)',
        padding: 3,
        marginBottom: 12,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 45,
        backgroundColor: colors.white,
    },
    developerName: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    locationText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 10,
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.white,
    },
    statsCard: {
        marginHorizontal: 16,
        marginTop: -12,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    statsRow: {
        flexDirection: 'row',
    },
    statsRowBorder: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 8,
    },
    statBoxBorder: {
        borderLeftWidth: 1,
        borderLeftColor: colors.border,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    aboutText: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    portfolioSubtitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: 16,
        marginBottom: 10,
    },
    emptyPortfolio: {
        paddingVertical: 32,
        paddingHorizontal: 24,
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        alignItems: 'center',
    },
    emptyPortfolioText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 10,
    },
    listContent: {
        paddingBottom: 8,
    },
    cardWrap: {
        marginBottom: 16,
    },
    highlightsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 24,
        marginHorizontal: 16,
    },
    highlightChip: {
        backgroundColor: colors.lightGray,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    highlightChipGreen: {
        backgroundColor: colors.tealLight,
    },
    highlightChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    highlightChipTextGreen: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    errorText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 24,
    },
});

export default DeveloperProfileScreen;
