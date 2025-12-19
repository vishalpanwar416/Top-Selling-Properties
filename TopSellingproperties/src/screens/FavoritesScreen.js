import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import colors from '../theme/colors';

const FavoritesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.content}>
                <Text style={styles.icon}>❤️</Text>
                <Text style={styles.title}>No Favorites Yet</Text>
                <Text style={styles.subtitle}>
                    Properties you save will appear here
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    icon: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default FavoritesScreen;
