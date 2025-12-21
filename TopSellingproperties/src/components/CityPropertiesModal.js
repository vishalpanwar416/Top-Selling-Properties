import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Platform,
    StatusBar,
    TextInput,
    Easing,
    TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import NewProjectCard from './NewProjectCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10;
const HEADER_HEIGHT = 80;
const SEARCH_BAR_HEIGHT = 70;
const TOTAL_HEADER_HEIGHT = STATUS_BAR_HEIGHT + HEADER_HEIGHT + SEARCH_BAR_HEIGHT;

const SORT_OPTIONS = [
    { id: 'default', label: 'Default', icon: 'apps-outline' },
    { id: 'price_low', label: 'Price: Low to High', icon: 'trending-up-outline' },
    { id: 'price_high', label: 'Price: High to Low', icon: 'trending-down-outline' },
    { id: 'newest', label: 'Newest First', icon: 'time-outline' },
    { id: 'name_asc', label: 'Name: A to Z', icon: 'text-outline' },
];

const CityPropertiesModal = ({
    visible,
    onClose,
    city,
    properties = [],
    onPropertyPress,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSortModal, setShowSortModal] = useState(false);
    const [selectedSort, setSelectedSort] = useState('default');
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;
    const sortModalAnim = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const headerVisible = useRef(true);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            slideAnim.setValue(SCREEN_WIDTH);
            fadeAnim.setValue(0);
            headerAnim.setValue(0);
            lastScrollY.current = 0;
            headerVisible.current = true;
            setSearchQuery('');
            setSelectedSort('default');
        }
    }, [visible]);

    useEffect(() => {
        if (showSortModal) {
            Animated.spring(sortModalAnim, {
                toValue: 1,
                tension: 65,
                friction: 10,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(sortModalAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showSortModal]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: SCREEN_WIDTH,
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;
        
        if (Math.abs(diff) < 3) return;
        
        if (diff > 0 && headerVisible.current && currentScrollY > 30) {
            headerVisible.current = false;
            Animated.spring(headerAnim, {
                toValue: -(STATUS_BAR_HEIGHT + HEADER_HEIGHT),
                tension: 80,
                friction: 12,
                useNativeDriver: true,
            }).start();
        } else if (diff < 0 && !headerVisible.current) {
            headerVisible.current = true;
            Animated.spring(headerAnim, {
                toValue: 0,
                tension: 80,
                friction: 12,
                useNativeDriver: true,
            }).start();
        }
        
        lastScrollY.current = currentScrollY;
    };

    const handleSortSelect = (sortId) => {
        setSelectedSort(sortId);
        setShowSortModal(false);
    };

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch = 
            (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    // Sort properties
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        switch (selectedSort) {
            case 'price_low':
                return (a.price || 0) - (b.price || 0);
            case 'price_high':
                return (b.price || 0) - (a.price || 0);
            case 'newest':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case 'name_asc':
                return (a.title || '').localeCompare(b.title || '');
            default:
                return 0;
        }
    });

    const searchBarTranslateY = headerAnim.interpolate({
        inputRange: [-(STATUS_BAR_HEIGHT + HEADER_HEIGHT), 0],
        outputRange: [-(HEADER_HEIGHT - 12), 0],
        extrapolate: 'clamp',
    });

    const backgroundTranslateY = headerAnim.interpolate({
        inputRange: [-(STATUS_BAR_HEIGHT + HEADER_HEIGHT), 0],
        outputRange: [-(HEADER_HEIGHT - 12), 0],
        extrapolate: 'clamp',
    });

    const sortModalTranslateY = sortModalAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <Animated.View 
                style={[
                    styles.container,
                    { 
                        transform: [{ translateX: slideAnim }],
                        opacity: fadeAnim,
                    }
                ]}
            >
                {/* Animated Header Background */}
                <Animated.View
                    style={[
                        styles.headerBackground,
                        { transform: [{ translateY: backgroundTranslateY }] }
                    ]}
                >
                    <LinearGradient
                        colors={['#6B1530', colors.maroon, colors.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientFull}
                    />
                </Animated.View>

                {/* Header Title Section */}
                <Animated.View
                    style={[
                        styles.headerSection,
                        { transform: [{ translateY: headerAnim }] }
                    ]}
                >
                    <View style={styles.statusBarSpacer} />
                    
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={handleClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={28} color={colors.white} />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <View style={styles.titleRow}>
                                <Text style={styles.headerTitle}>{city}</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{sortedProperties.length}</Text>
                                </View>
                            </View>
                            <Text style={styles.headerSubtitle}>
                                Explore premium properties
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Floating Search Bar */}
                <Animated.View
                    style={[
                        styles.searchWrapper,
                        { transform: [{ translateY: searchBarTranslateY }] }
                    ]}
                >
                    <View style={styles.searchContainer}>
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by name or location..."
                                placeholderTextColor={colors.textTertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity 
                                    onPress={() => setSearchQuery('')}
                                    style={styles.clearButton}
                                >
                                    <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity 
                                style={[
                                    styles.sortIconButton,
                                    selectedSort !== 'default' && styles.sortIconButtonActive
                                ]}
                                onPress={() => setShowSortModal(true)}
                            >
                                <Ionicons 
                                    name="swap-vertical" 
                                    size={20} 
                                    color={selectedSort !== 'default' ? colors.white : colors.primary} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Properties List */}
                <ScrollView 
                    style={styles.propertiesList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.propertiesContent}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {sortedProperties.length > 0 ? (
                        sortedProperties.map((property, index) => (
                            <Animated.View 
                                key={property.id} 
                                style={[
                                    styles.cardWrapper,
                                    { opacity: fadeAnim }
                                ]}
                            >
                                <NewProjectCard
                                    project={property}
                                    fullWidth
                                    onPress={() => {
                                        handleClose();
                                        setTimeout(() => onPropertyPress(property), 300);
                                    }}
                                />
                            </Animated.View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconWrapper}>
                                <LinearGradient
                                    colors={['rgba(185, 28, 28, 0.1)', 'rgba(122, 30, 62, 0.1)']}
                                    style={styles.emptyIconBg}
                                >
                                    <Ionicons name="home-outline" size={48} color={colors.primary} />
                                </LinearGradient>
                            </View>
                            <Text style={styles.emptyTitle}>No Properties Found</Text>
                            <Text style={styles.emptySubtitle}>
                                We couldn't find any properties matching your search.{'\n'}Try different keywords.
                            </Text>
                            <TouchableOpacity 
                                style={styles.clearSearchButton}
                                onPress={() => setSearchQuery('')}
                            >
                                <Text style={styles.clearSearchText}>Clear Search</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{ height: 20 }} />
                </ScrollView>

                {/* Sort Modal */}
                {showSortModal && (
                    <TouchableWithoutFeedback onPress={() => setShowSortModal(false)}>
                        <Animated.View 
                            style={[
                                styles.sortModalOverlay,
                                { opacity: sortModalAnim }
                            ]}
                        >
                            <TouchableWithoutFeedback>
                                <Animated.View 
                                    style={[
                                        styles.sortModalContainer,
                                        { transform: [{ translateY: sortModalTranslateY }] }
                                    ]}
                                >
                                    <View style={styles.sortModalHandle} />
                                    <Text style={styles.sortModalTitle}>Sort By</Text>
                                    
                                    {SORT_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[
                                                styles.sortOption,
                                                selectedSort === option.id && styles.sortOptionActive
                                            ]}
                                            onPress={() => handleSortSelect(option.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[
                                                styles.sortOptionIcon,
                                                selectedSort === option.id && styles.sortOptionIconActive
                                            ]}>
                                                <Ionicons 
                                                    name={option.icon} 
                                                    size={20} 
                                                    color={selectedSort === option.id ? colors.white : colors.primary} 
                                                />
                                            </View>
                                            <Text style={[
                                                styles.sortOptionText,
                                                selectedSort === option.id && styles.sortOptionTextActive
                                            ]}>
                                                {option.label}
                                            </Text>
                                            {selectedSort === option.id && (
                                                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                )}
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: TOTAL_HEADER_HEIGHT + 20,
        zIndex: 1,
    },
    gradientFull: {
        flex: 1,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerSection: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    statusBarSpacer: {
        height: STATUS_BAR_HEIGHT,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: HEADER_HEIGHT,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 26,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.white,
        letterSpacing: -0.5,
    },
    countBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    countText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.75)',
        fontFamily: 'Poppins_500Medium',
        letterSpacing: 0.2,
    },
    searchWrapper: {
        position: 'absolute',
        top: STATUS_BAR_HEIGHT + HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 8,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 26,
        paddingLeft: 18,
        paddingRight: 8,
        height: 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        fontFamily: 'Poppins_500Medium',
    },
    clearButton: {
        padding: 8,
    },
    sortIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortIconButtonActive: {
        backgroundColor: colors.primary,
    },
    propertiesList: {
        flex: 1,
    },
    propertiesContent: {
        paddingHorizontal: 16,
        paddingTop: TOTAL_HEADER_HEIGHT + 28,
        paddingBottom: 20,
    },
    cardWrapper: {
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyIconWrapper: {
        marginBottom: 20,
    },
    emptyIconBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    clearSearchButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    clearSearchText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.white,
    },
    // Sort Modal Styles
    sortModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    sortModalContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    sortModalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    sortModalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: colors.lightGray,
    },
    sortOptionActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
    },
    sortOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    sortOptionIconActive: {
        backgroundColor: colors.primary,
    },
    sortOptionText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    sortOptionTextActive: {
        color: colors.primary,
    },
});

export default CityPropertiesModal;
