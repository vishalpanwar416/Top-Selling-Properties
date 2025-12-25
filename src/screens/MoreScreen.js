import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import colors from '../theme/colors';

const MoreScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.title}>More</Text>
                    <Text style={styles.subtitle}>Additional options and settings</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Lato_900Black',
        color: colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        fontFamily: 'Lato_400Regular',
    },
});

export default MoreScreen;

