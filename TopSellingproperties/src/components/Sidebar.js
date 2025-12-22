import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../theme/colors';

const Sidebar = (props) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();
    const [rating, setRating] = useState(0);

    const handleNavigation = (screen, nestedScreen = null) => {
        navigation.closeDrawer();
        setTimeout(() => {
            if (nestedScreen) {
                navigation.navigate('MainTabs', {
                    screen: screen,
                    params: {
                        screen: nestedScreen
                    }
                });
            } else {
                navigation.navigate('MainTabs', {
                    screen: screen
                });
            }
        }, 100);
    };

    const handleCardPress = (action) => {
        navigation.closeDrawer();
        setTimeout(() => {
            switch(action) {
                case 'post-property':
                    navigation.navigate('MainTabs', {
                        screen: 'Home',
                        params: {
                            screen: 'PostProperty'
                        }
                    });
                    break;
                case 'post-whatsapp':
                    navigation.navigate('MainTabs', {
                        screen: 'Home',
                        params: {
                            screen: 'PostPropertyWhatsApp'
                        }
                    });
                    break;
                default:
                    console.log('Card pressed:', action);
            }
        }, 100);
    };

    const renderCard = (title, subtitle, icon, iconColor, gradientColors, onPress) => (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <LinearGradient
                colors={gradientColors || [colors.white, colors.white]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
            >
                <View style={styles.cardContent}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>
                    <View style={styles.cardRightSection}>
                        <View style={[styles.cardIconContainer, { backgroundColor: iconColor + '15' }]}>
                            <MaterialCommunityIcons name={icon} size={26} color={iconColor} />
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={iconColor} style={styles.cardArrow} />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderMenuItem = (name, icon, iconType, hasNew = false, iconColor = null, onPress) => {
        const IconComponent = iconType === 'Ionicons' ? Ionicons : 
                            iconType === 'MaterialIcons' ? MaterialIcons :
                            iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
                            FontAwesome5;
        
        return (
            <TouchableOpacity
                style={styles.menuItem}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={[styles.menuIconContainer, iconColor && { backgroundColor: iconColor + '10' }]}>
                    <IconComponent 
                        name={icon} 
                        size={20} 
                        color={iconColor || colors.textPrimary} 
                    />
                </View>
                <Text style={styles.menuText}>{name}</Text>
                {hasNew && (
                    <View style={styles.newBadge}>
                        <LinearGradient
                            colors={[colors.warning, colors.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.newBadgeGradient}
                        >
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </LinearGradient>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={styles.menuArrow} />
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = (title) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.primary, colors.maroon, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.header, { paddingTop: insets.top + 12 }]}
            >
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={[colors.white, colors.filterRedLight]}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>S</Text>
                        </LinearGradient>
                        <View style={styles.avatarBadge} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.username}>sam</Text>
                        <View style={styles.profileSubtextContainer}>
                            <Text style={styles.profileSubtext}>Dealer Profile</Text>
                            <View style={styles.profileDot} />
                            <Text style={styles.profileSubtext}>Manage Profile</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <DrawerContentScrollView 
                {...props} 
                contentContainerStyle={styles.menuContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Property Posting Section */}
                {renderCard(
                    'Post Property',
                    'Sell/ Rent faster with 99acres.',
                    'home-plus',
                    colors.primary,
                    [colors.filterRedLight, colors.white],
                    () => handleCardPress('post-property')
                )}
                
                {renderCard(
                    'Post Property via Whatsapp',
                    'Faster property posting experience.',
                    'whatsapp',
                    '#25D366',
                    ['#E8F5E9', '#FFFFFF'],
                    () => handleCardPress('post-whatsapp')
                )}

                {/* Property Search Section */}
                {renderCard(
                    'Search Properties',
                    'Explore residential and commercial properties.',
                    'home-search',
                    colors.warning,
                    ['#FFF3E0', colors.white],
                    () => {
                        navigation.closeDrawer();
                        setTimeout(() => {
                            navigation.navigate('MainTabs', {
                                screen: 'Home',
                                params: {
                                    screen: 'Search'
                                }
                            });
                        }, 100);
                    }
                )}

                {/* Manage Your Property Section */}
                {renderSectionHeader('MANAGE YOUR PROPERTY')}
                
                {renderMenuItem(
                    'View Responses',
                    'message-text-outline',
                    'MaterialCommunityIcons',
                    false,
                    colors.info,
                    () => handleCardPress('view-responses')
                )}
                
                {renderMenuItem(
                    'Manage/ Edit your listings',
                    'office-building',
                    'MaterialCommunityIcons',
                    false,
                    colors.primary,
                    () => handleCardPress('manage-listings')
                )}
                
                {renderMenuItem(
                    'Self verify your property',
                    'shield-check',
                    'MaterialCommunityIcons',
                    false,
                    colors.teal,
                    () => handleCardPress('self-verify')
                )}
                
                {renderMenuItem(
                    'Upload Media',
                    'upload',
                    'MaterialCommunityIcons',
                    true,
                    colors.warning,
                    () => handleCardPress('upload-media')
                )}
                
                {renderMenuItem(
                    'Homepage',
                    'home',
                    'Ionicons',
                    false,
                    colors.primary,
                    () => handleNavigation('Home')
                )}

                {/* Plans and Services Section */}
                {renderSectionHeader('PLANS AND SERVICES')}
                
                {renderMenuItem(
                    'Dealer Plans',
                    'crown',
                    'MaterialCommunityIcons',
                    false,
                    colors.warning,
                    () => handleCardPress('dealer-plans')
                )}

                {/* Rate Our App Section */}
                <View style={styles.rateSection}>
                    <View style={styles.rateContent}>
                        <Text style={styles.rateTitle}>Rate Our App</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    activeOpacity={0.7}
                                    style={styles.starButton}
                                >
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={22}
                                        color={star <= rating ? colors.warning : colors.textTertiary}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleCardPress('rate-app')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[colors.primary, colors.maroon]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.rateButton}
                        >
                            <Ionicons name="star" size={14} color={colors.white} />
                            <Text style={styles.rateButtonText}>Rate App</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <View style={styles.divider} />
                <Text style={styles.footerText}>© 2024 Top Selling Properties</Text>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    avatarText: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.primary,
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    profileInfo: {
        flex: 1,
    },
    username: {
        fontSize: 17,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    profileSubtextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileSubtext: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255, 255, 255, 0.95)',
    },
    profileDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 6,
    },
    menuContainer: {
        paddingTop: 16,
        paddingBottom: 20,
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        marginBottom: 5,
        letterSpacing: 0.1,
    },
    cardSubtitle: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        lineHeight: 17,
    },
    cardRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    cardArrow: {
        opacity: 0.6,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        marginTop: 4,
    },
    sectionHeaderLine: {
        display: 'none',
    },
    sectionHeaderText: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginVertical: 1,
    },
    menuIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontFamily: 'Lato_400Regular',
        flex: 1,
        letterSpacing: 0.1,
    },
    menuArrow: {
        marginLeft: 8,
        opacity: 0.4,
    },
    newBadge: {
        marginLeft: 8,
        borderRadius: 6,
        overflow: 'hidden',
    },
    newBadgeGradient: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    newBadgeText: {
        fontSize: 8,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        letterSpacing: 0.6,
    },
    rateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.08)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    rateContent: {
        flex: 1,
    },
    rateTitle: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starButton: {
        marginRight: 4,
        padding: 1,
    },
    rateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        marginLeft: 10,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    rateButtonText: {
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        marginLeft: 4,
        letterSpacing: 0.2,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 12,
        backgroundColor: colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 12,
    },
    footerText: {
        fontSize: 10,
        color: colors.textSecondary,
        textAlign: 'center',
        fontFamily: 'Lato_400Regular',
        letterSpacing: 0.2,
    },
    versionText: {
        fontSize: 9,
        color: colors.textTertiary,
        textAlign: 'center',
        marginTop: 4,
        fontFamily: 'Lato_400Regular',
    },
});

export default Sidebar;
