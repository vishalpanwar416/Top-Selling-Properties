import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Import expo-location - handle gracefully if not available
let Location = null;
try {
    Location = require('expo-location');
} catch (e) {
    if (__DEV__) {
        console.warn('expo-location could not be loaded. Location features will be limited.');
    }
}

const LOCATIONS = ['India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

// Map coordinates to cities (simplified for India)
const getCityFromCoordinates = (latitude, longitude) => {
    // Mumbai approximate coordinates
    if (latitude >= 18.9 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.0) {
        return 'Mumbai';
    }
    // Delhi approximate coordinates
    if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.8 && longitude <= 77.4) {
        return 'Delhi';
    }
    // Bangalore approximate coordinates
    if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 77.4 && longitude <= 77.8) {
        return 'Bangalore';
    }
    // Hyderabad approximate coordinates
    if (latitude >= 17.3 && latitude <= 17.5 && longitude >= 78.4 && longitude <= 78.6) {
        return 'Hyderabad';
    }
    // Default to Mumbai if in India region
    if (latitude >= 8.0 && latitude <= 35.0 && longitude >= 68.0 && longitude <= 97.0) {
        return 'Mumbai';
    }
    return null;
};

const LocationSelector = ({ selectedLocation, onLocationChange, style }) => {
    const [showModal, setShowModal] = useState(false);
    const [isRequestingLocation, setIsRequestingLocation] = useState(false);
    const modalAnimation = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Auto-request location on mount
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        if (!Location) {
            console.log('expo-location is not available');
            return;
        }
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                getCurrentLocation();
            }
        } catch (error) {
            console.log('Error requesting location permission:', error);
        }
    };

    const getCurrentLocation = async () => {
        if (!Location) {
            console.log('expo-location is not available');
            setIsRequestingLocation(false);
            return;
        }
        try {
            setIsRequestingLocation(true);
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            
            const city = getCityFromCoordinates(
                location.coords.latitude,
                location.coords.longitude
            );
            
            if (city && LOCATIONS.includes(city)) {
                onLocationChange(city);
            }
        } catch (error) {
            console.log('Error getting location:', error);
        } finally {
            setIsRequestingLocation(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        if (!Location) {
            Alert.alert(
                'Location Service',
                'Location services are not available. Please select a location manually.',
                [{ text: 'OK' }]
            );
            return;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            await getCurrentLocation();
            closeModal();
        } else {
            Alert.alert(
                'Location Permission',
                'Please enable location permission in settings to use your current location.',
                [{ text: 'OK' }]
            );
        }
    };

    const openModal = () => {
        setShowModal(true);
        Animated.spring(modalAnimation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setShowModal(false));
    };

    const handleLocationSelect = (location) => {
        onLocationChange(location);
        closeModal();
    };

    const renderBottomSheet = () => {
        if (!showModal) return null;

        return (
            <Modal
                visible={showModal}
                transparent
                animationType="none"
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            {
                                transform: [{
                                    translateY: modalAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [300, 0],
                                    })
                                }]
                            }
                        ]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.bottomSheetHandle} />
                            <View style={styles.bottomSheetHeader}>
                                <Ionicons name="location-outline" size={24} color={colors.filterRed} />
                                <Text style={styles.bottomSheetTitle}>Select Location</Text>
                            </View>
                            
                            {/* Use Current Location Button */}
                            <View style={styles.currentLocationSection}>
                                <TouchableOpacity
                                    style={styles.currentLocationButton}
                                    onPress={handleUseCurrentLocation}
                                    disabled={isRequestingLocation}
                                >
                                    <Ionicons 
                                        name="navigate" 
                                        size={20} 
                                        color={colors.filterRed} 
                                    />
                                    <Text style={styles.currentLocationText}>
                                        {isRequestingLocation ? 'Detecting...' : 'Use Current Location'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.optionsModalContent}>
                                <View style={styles.optionsGrid}>
                                    {LOCATIONS.map((location) => (
                                        <TouchableOpacity
                                            key={location}
                                            style={[
                                                styles.optionPill,
                                                selectedLocation === location && styles.selectedOptionPill
                                            ]}
                                            onPress={() => handleLocationSelect(location)}
                                        >
                                            <Text style={[
                                                styles.optionPillText,
                                                selectedLocation === location && styles.selectedOptionPillText
                                            ]}>
                                                {location}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.locationBadge, style]}
                onPress={openModal}
                activeOpacity={0.7}
            >
                <Ionicons name="location" size={16} color="#1B5E20" />
                <Text style={styles.locationText}>{selectedLocation}</Text>
            </TouchableOpacity>
            {renderBottomSheet()}
        </>
    );
};

const styles = StyleSheet.create({
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(153, 27, 27, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        zIndex: 1,
    },
    locationText: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: '#1B5E20',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    bottomSheetTitle: {
        fontSize: 17,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },
    currentLocationSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.filterRedLight,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.filterRed,
        gap: 8,
    },
    currentLocationText: {
        fontSize: 15,
        fontFamily: 'Lato_700Bold',
        color: colors.filterRed,
    },
    optionsModalContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedOptionPill: {
        backgroundColor: colors.filterRed,
        borderColor: colors.filterRed,
    },
    optionPillText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    selectedOptionPillText: {
        color: colors.white,
    },
});

export default LocationSelector;
