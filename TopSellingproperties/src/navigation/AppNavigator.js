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
import PropertiesScreen from '../screens/PropertiesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import AgentsScreen from '../screens/AgentsScreen';
import AgentDetailsScreen from '../screens/AgentDetailsScreen';
import AgencyDetailsScreen from '../screens/AgencyDetailsScreen';
import MoreScreen from '../screens/MoreScreen';
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
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
            <Stack.Screen name="FindMyAgent" component={FindMyAgentScreen} />
            <Stack.Screen name="AgentDetails" component={AgentDetailsScreen} />
            <Stack.Screen name="PostProperty" component={PostPropertyScreen} />
            <Stack.Screen name="PostPropertyWhatsApp" component={PostPropertyWhatsAppScreen} />
        </Stack.Navigator>
    );
};

const PropertiesStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PropertiesMain" component={PropertiesScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
            <Stack.Screen name="AgentDetails" component={AgentDetailsScreen} />
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
                name="Properties"
                component={PropertiesStack}
                options={{
                    tabBarLabel: 'Properties',
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

const AppNavigator = () => {
    return (
        <NavigationContainer>
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
        </NavigationContainer>
    );
};

export default AppNavigator;
