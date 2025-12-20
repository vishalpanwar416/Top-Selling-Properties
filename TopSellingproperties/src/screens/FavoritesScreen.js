import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import colors from '../theme/colors';

const FavoritesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="heart-outline" size={64} color={colors.secondary} />
                </View>
                <Text style={styles.title}>No Favorites Yet</Text>
                <Text style={styles.subtitle}>
                    Start exploring properties and save your favorites to see them here
                </Text>
                <TouchableOpacity 
                    style={styles.exploreButton}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.exploreButtonText}>Explore Properties</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 17,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 32,
        paddingHorizontal: 20,
        fontWeight: '400',
    },
    exploreButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    exploreButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default FavoritesScreen;
