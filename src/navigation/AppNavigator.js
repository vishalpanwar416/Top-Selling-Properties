import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PropertyDetails from '../screens/PropertyDetails';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import SearchScreen from '../screens/SearchScreen';
import FindMyAgentScreen from '../screens/FindMyAgentScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import DeveloperProfileScreen from '../screens/DeveloperProfileScreen';
import DevelopersScreen from '../screens/DevelopersScreen';
import AgentsScreen from '../screens/AgentsScreen';
import AgentDetailsScreen from '../screens/AgentDetailsScreen';
import AgencyDetailsScreen from '../screens/AgencyDetailsScreen';
import MoreScreen from '../screens/MoreScreen';
import HomeLoanScreen from '../screens/HomeLoanScreen';
import HomeInteriorScreen from '../screens/HomeInteriorScreen';
import LegalServicesScreen from '../screens/LegalServicesScreen';
import AuthStartScreen from '../screens/AuthStartScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import PostPropertyScreen from '../screens/PostPropertyScreen';
import PostPropertyWhatsAppScreen from '../screens/PostPropertyWhatsAppScreen';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';
import colors from '../theme/colors';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    gestureEnabled: true,
                    animation: 'slide_from_bottom',
                    animationDuration: 300,
                }}
            />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
            <Stack.Screen name="DeveloperProfile" component={DeveloperProfileScreen} />
            <Stack.Screen name="Developers" component={DevelopersScreen} />
            <Stack.Screen name="FindMyAgent" component={FindMyAgentScreen} />
            <Stack.Screen name="AgentDetails" component={AgentDetailsScreen} />
            <Stack.Screen name="PostProperty" component={PostPropertyScreen} />
            <Stack.Screen name="PostPropertyWhatsApp" component={PostPropertyWhatsAppScreen} />
        </Stack.Navigator>
    );
};

const ProjectsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ProjectsMain" component={ProjectsScreen} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
            <Stack.Screen name="DeveloperProfile" component={DeveloperProfileScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
            <Stack.Screen name="AgentDetails" component={AgentDetailsScreen} />
        </Stack.Navigator>
    );
};

const AgentsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="AgentsMain" component={AgentsScreen} />
            <Stack.Screen name="FindMyAgent" component={FindMyAgentScreen} />
            <Stack.Screen name="AgentDetails" component={AgentDetailsScreen} />
            <Stack.Screen name="AgencyDetails" component={AgencyDetailsScreen} />
        </Stack.Navigator>
    );
};

const MoreStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="MoreMain" component={MoreScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="HomeLoan" component={HomeLoanScreen} />
            <Stack.Screen name="HomeInterior" component={HomeInteriorScreen} />
            <Stack.Screen name="LegalServices" component={LegalServicesScreen} />
            <Stack.Screen name="AuthStart" component={AuthStartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Projects"
                component={ProjectsStack}
                options={{
                    tabBarLabel: 'Projects',
                }}
            />
            <Tab.Screen
                name="Agents"
                component={AgentsStack}
                options={{
                    tabBarLabel: 'Agents',
                }}
            />
            <Tab.Screen
                name="More"
                component={MoreStack}
                options={{
                    tabBarLabel: 'More',
                }}
            />
        </Tab.Navigator>
    );
};

const linking = {
    prefixes: ['credai://', 'https://credai.in'],
    config: {
        screens: {
            MainTabs: {
                screens: {
                    Projects: {
                        screens: {
                            PropertyDetails: 'property/:propertyId',
                        },
                    },
                },
            },
        },
    },
};

const MainDrawer = () => (
    <Drawer.Navigator
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={{
            headerShown: false,
            drawerType: 'slide',
            drawerStyle: {
                width: 280,
            },
            overlayColor: 'rgba(0, 0, 0, 0.5)',
        }}
    >
        <Drawer.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{
                drawerLabel: () => null,
                drawerItemStyle: { display: 'none' },
            }}
        />
    </Drawer.Navigator>
);

const RootStack = () => (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="AuthStart"
    >
        <Stack.Screen name="AuthStart" component={AuthStartScreen} initialParams={{ isInitialGate: true }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainDrawer} />
    </Stack.Navigator>
);

const AppNavigator = () => {
    return (
        <NavigationContainer linking={linking}>
            <RootStack />
        </NavigationContainer>
    );
};

export default AppNavigator;
