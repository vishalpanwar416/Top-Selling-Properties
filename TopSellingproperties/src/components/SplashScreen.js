import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const CustomSplashScreen = ({ onFinish }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Hide native splash screen and show custom one
        const prepare = async () => {
            try {
                await SplashScreen.hideAsync();
                setIsReady(true);
            } catch (e) {
                console.warn(e);
            }
        };

        prepare();
    }, []);

    useEffect(() => {
        if (isReady) {
            // Show custom splash for 2 seconds
            const timer = setTimeout(() => {
                if (onFinish) {
                    onFinish();
                }
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isReady, onFinish]);

    if (!isReady) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Subtle grid pattern background */}
            <View style={styles.gridContainer}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <View 
                        key={`h-${i}`} 
                        style={[styles.gridLineHorizontal, { top: (i + 1) * (height / 16) }]} 
                    />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                    <View 
                        key={`v-${i}`} 
                        style={[styles.gridLineVertical, { left: (i + 1) * (width / 11) }]} 
                    />
                ))}
            </View>
            
            {/* Blurred chart shapes at bottom */}
            <View style={styles.chartShapes}>
                <View style={[styles.chartBar, styles.chartBar1]} />
                <View style={[styles.chartBar, styles.chartBar2]} />
                <View style={[styles.chartBar, styles.chartBar3]} />
                <View style={[styles.chartBar, styles.chartBar4]} />
            </View>
            
            {/* Logo Container */}
            <View style={styles.logoContainer}>
                <View style={styles.logoSquare}>
                    {/* Building silhouettes icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.buildingsContainer}>
                            <View style={[styles.building, styles.building1]} />
                            <View style={[styles.building, styles.building2]} />
                            <View style={[styles.building, styles.building3]} />
                        </View>
                        <View style={styles.arrowContainer}>
                            <Text style={styles.arrow}>↗</Text>
                        </View>
                    </View>
                    <Text style={styles.logoText}>TOP SELLING</Text>
                    <Text style={styles.logoSubtext}>PROPERTY</Text>
                </View>
            </View>

            {/* App Name */}
            <View style={styles.appNameContainer}>
                <Text style={styles.appNameTop}>TOP SELLING</Text>
                <Text style={styles.appNameBottom}>PROPERTY</Text>
            </View>

            {/* Tagline */}
            <Text style={styles.tagline}>
                REAL ESTATE <Text style={styles.taglineDot}>•</Text> GROWTH PARTNER
            </Text>

            {/* Loading Indicator */}
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.maroon} />
            </View>

            {/* Version */}
            <Text style={styles.version}>V 2.0.1</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    gridContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
    },
    gridLineHorizontal: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.gray,
    },
    gridLineVertical: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: colors.gray,
    },
    chartShapes: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        opacity: 0.15,
        paddingHorizontal: 40,
    },
    chartBar: {
        backgroundColor: colors.gray,
        marginHorizontal: 8,
        borderRadius: 4,
    },
    chartBar1: {
        width: 30,
        height: 40,
    },
    chartBar2: {
        width: 30,
        height: 60,
    },
    chartBar3: {
        width: 30,
        height: 50,
    },
    chartBar4: {
        width: 30,
        height: 45,
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logoSquare: {
        width: 120,
        height: 120,
        backgroundColor: colors.maroon,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    buildingsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 8,
    },
    building: {
        backgroundColor: colors.red,
        marginHorizontal: 2,
    },
    building1: {
        width: 12,
        height: 20,
    },
    building2: {
        width: 12,
        height: 28,
    },
    building3: {
        width: 12,
        height: 24,
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 18,
    },
    logoText: {
        color: colors.white,
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginTop: 4,
    },
    logoSubtext: {
        color: colors.white,
        fontSize: 6,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    appNameContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    appNameTop: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.darkGray,
        letterSpacing: 1,
        marginBottom: -4,
    },
    appNameBottom: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.maroon,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 12,
        color: colors.gray,
        letterSpacing: 1,
        marginBottom: 40,
        textTransform: 'uppercase',
    },
    taglineDot: {
        color: colors.maroon,
        fontSize: 8,
    },
    loadingContainer: {
        marginBottom: 12,
    },
    version: {
        fontSize: 10,
        color: colors.gray,
        letterSpacing: 0.5,
    },
});

export default CustomSplashScreen;

