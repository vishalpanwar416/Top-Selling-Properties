import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';
import agenciesData from '../data/agencies.json';
import ContactActions from '../components/ContactActions';

const { width, height } = Dimensions.get('window');

const AgentDetailsScreen = ({ route, navigation }) => {
    const { agent } = route.params || {};
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('About');
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!agent) {
        return (
            <View style={styles.container}>
                <Text>Agent not found</Text>
            </View>
        );
    }

    // Get agency information
    const agency = agenciesData.agencies.find(a => a.name === agent.agencyName) || null;

    // Get properties listed by this agent
    const agentProperties = propertiesData.properties.filter(
        property => property.agentId === agent.id
    );


    const handleShare = () => {
        // Share functionality
    };

    // Format expertise/specialization
    const expertise = agent.specialization
        ? agent.specialization.split(',').map(e => e.trim())
        : ['Residential Sales', 'Residential Leasing'];

    // Get properties for sale count
    const saleProperties = agentProperties.filter(p => p.transactionType === 'Buy' || p.status === 'For Sale');
    const saleCount = saleProperties.length;

    // Agent description
    const agentDescription = agent.description || `${agent.name} is an honest, hardworking, and transparent agent for both buyers and sellers. With over ${agent.experience || '4 years'} of experience in ${agent.serviceAreas?.[0] || 'his chosen area'}, ${agent.name} has built a reputation for delivering exceptional results and providing personalized service to each client.`;

    // Extract years from experience string
    const experienceYears = agent.experience ? agent.experience.replace(/\D/g, '') : '4';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Gradient Header Background */}
                <LinearGradient
                    colors={['#2D5F5D', '#4A8B87', '#356B68']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientHeader, { paddingTop: insets.top + 12 }]}
                >
                    {/* Header Action Buttons */}
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="chevron-back" size={26} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleShare}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="share-social-outline" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* TruBroker Branding */}
                    <View style={styles.brandingContainer}>
                        <Text style={styles.brandingText}>TruBroker™</Text>
                    </View>
                </LinearGradient>

                {/* Profile Section with Overlap */}
                <View style={styles.profileSection}>
                    {/* Profile Image - Overlapping on Left */}
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImageWrapper}>
                            <Image
                                source={{ uri: agent.image || 'https://via.placeholder.com/150' }}
                                style={styles.profileImage}
                            />
                        </View>
                    </View>

                    {/* Agent Information */}
                    <View style={styles.agentInfoSection}>
                        <Text style={styles.agentName}>{agent.name}</Text>
                        <Text style={styles.agencyName}>
                            {agent.agencyName || agent.serviceAreas?.[0] || 'Dubai'}
                        </Text>

                        {/* Badges */}
                        <View style={styles.badgesContainer}>
                            <View style={[styles.badge, styles.badgePrimary]}>
                                <Text style={styles.badgeTextPrimary}>TruBroker™</Text>
                            </View>
                            <View style={[styles.badge, styles.badgeBlue]}>
                                <Ionicons name="diamond" size={11} color="#4299E1" />
                                <Text style={styles.badgeTextBlue}>Quality Lister</Text>
                            </View>
                            <View style={[styles.badge, styles.badgePurple]}>
                                <Ionicons name="call" size={11} color="#9F7AEA" />
                                <Text style={styles.badgeTextPurple}>Responsive Broker</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>

                    {/* Navigation Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'About' && styles.tabActive]}
                            onPress={() => setActiveTab('About')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabText, activeTab === 'About' && styles.tabTextActive]}>
                                About
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Properties' && styles.tabActive]}
                            onPress={() => setActiveTab('Properties')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabText, activeTab === 'Properties' && styles.tabTextActive]}>
                                Properties
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Transactions' && styles.tabActive]}
                            onPress={() => setActiveTab('Transactions')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabText, activeTab === 'Transactions' && styles.tabTextActive]}>
                                Transactions
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    {activeTab === 'About' && (
                        <View style={styles.tabContent}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Language(s):</Text>
                                <Text style={styles.infoValue}>
                                    {agent.languages?.join(', ') || 'English'}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Expertise:</Text>
                                <Text style={styles.infoValue}>
                                    {expertise.join(', ')}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Service Areas:</Text>
                                <Text style={styles.infoValue}>
                                    {agent.serviceAreas?.join(', ') || 'Dubai'}
                                </Text>
                            </View>
                            {saleCount > 0 && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Properties:</Text>
                                    <TouchableOpacity
                                        style={styles.propertiesButton}
                                        onPress={() => setActiveTab('Properties')}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.propertiesButtonText}>
                                            {saleCount} for Sale
                                        </Text>
                                        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Description:</Text>
                                <Text style={styles.infoValue} numberOfLines={showFullDescription ? undefined : 3}>
                                    {agentDescription}
                                </Text>
                                {agentDescription.length > 100 && (
                                    <TouchableOpacity
                                        onPress={() => setShowFullDescription(!showFullDescription)}
                                        style={styles.readMoreButton}
                                    >
                                        <Text style={styles.readMoreText}>
                                            {showFullDescription ? 'Read less' : 'Read more'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.infoRow}>
                                <View style={styles.infoLabelRow}>
                                    <Text style={styles.infoLabel}>BRN:</Text>
                                    <Ionicons name="information-circle-outline" size={16} color={colors.primary} style={styles.infoIcon} />
                                </View>
                                <Text style={styles.infoValue}>
                                    {agent.brn || '46063'}
                                </Text>
                            </View>
                            <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                                <Text style={styles.infoLabel}>Experience:</Text>
                                <Text style={styles.infoValue}>
                                    {experienceYears} {experienceYears === '1' ? 'Year' : 'Years'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {activeTab === 'Properties' && (
                        <View style={styles.tabContent}>
                            {agentProperties.length > 0 ? (
                                <View style={styles.propertiesGrid}>
                                    {agentProperties.map((property) => (
                                        <TouchableOpacity
                                            key={property.id}
                                            style={styles.propertyCard}
                                            onPress={() => navigation.navigate('PropertyDetails', { property })}
                                            activeOpacity={0.8}
                                        >
                                            <Image
                                                source={{ uri: property.images?.[0] || 'https://via.placeholder.com/200' }}
                                                style={styles.propertyImage}
                                            />
                                            <View style={styles.propertyInfo}>
                                                <Text style={styles.propertyTitle} numberOfLines={2}>
                                                    {property.title}
                                                </Text>
                                                <Text style={styles.propertyPrice}>
                                                    AED {property.price?.toLocaleString()}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyState}>
                                    <Ionicons name="home-outline" size={48} color={colors.textTertiary} />
                                    <Text style={styles.emptyStateText}>No properties listed yet</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {activeTab === 'Transactions' && (
                        <View style={styles.tabContent}>
                            <View style={styles.emptyState}>
                                <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
                                <Text style={styles.emptyStateText}>No transactions available</Text>
                            </View>
                        </View>
                    )}

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Bottom Contact Buttons */}
            <ContactActions
                phone={agent.phone}
                email={agent.email}
                whatsappMessage={`Hi ${agent.name}, I'm interested in your services`}
                emailSubject={`Inquiry about ${agent.name}`}
                contactName={agent.name}
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
    gradientHeader: {
        height: 200,
        paddingHorizontal: 20,
        paddingBottom: 20,
        position: 'relative',
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 100,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    brandingContainer: {
        position: 'absolute',
        right: 20,
        bottom: 24,
    },
    brandingText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 0.3,
    },
    profileSection: {
        backgroundColor: colors.white,
        paddingTop: 70,
        paddingHorizontal: 20,
        paddingBottom: 24,
        alignItems: 'flex-start',
    },
    profileImageContainer: {
        position: 'absolute',
        top: -70,
        left: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    profileImageWrapper: {
        borderRadius: 80,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: colors.white,
        backgroundColor: colors.white,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    agentInfoSection: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    contentSection: {
        paddingHorizontal: 20,
        paddingTop: 24,
        backgroundColor: colors.white,
    },
    agentName: {
        fontSize: 28,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.textPrimary,
        marginBottom: 4,
        letterSpacing: -0.5,
        textAlign: 'left',
    },
    agencyName: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 10,
        fontFamily: 'Poppins_500Medium',
        textAlign: 'left',
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    badgePrimary: {
        backgroundColor: '#2D5F5D',
    },
    badgeBlue: {
        backgroundColor: '#EBF5FF',
        borderWidth: 0,
    },
    badgePurple: {
        backgroundColor: '#F5EDFF',
        borderWidth: 0,
    },
    badgeTextPrimary: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: colors.white,
    },
    badgeTextBlue: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    badgeTextPurple: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: 24,
        marginTop: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        marginBottom: -1,
    },
    tabActive: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 0.2,
    },
    tabTextActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    tabContent: {
        minHeight: 200,
        paddingTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 24,
        letterSpacing: -0.3,
    },
    infoRow: {
        marginBottom: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F7FA',
    },
    infoRowLast: {
        marginBottom: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
        fontWeight: '500',
    },
    infoLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        marginLeft: 6,
    },
    propertiesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 4,
    },
    propertiesButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
        marginRight: 8,
    },
    readMoreButton: {
        marginTop: 8,
    },
    readMoreText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
    },
    propertiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 4,
    },
    propertyCard: {
        width: (width - 52) / 2,
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    propertyImage: {
        width: '100%',
        height: 150,
        backgroundColor: colors.lightGray,
    },
    propertyInfo: {
        padding: 14,
    },
    propertyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
        lineHeight: 20,
    },
    propertyPrice: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -0.3,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default AgentDetailsScreen;
