import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ExpenseListScreen from '../screens/ExpenseListScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ChartScreen from '../screens/ChartScreen';
import SettingsScreen from '../screens/SettingsScreen';

//Parameter lists for type safety in navigation
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  ExpensesTab: undefined;
  ChartTab: undefined;
  SettingsTab: undefined;
};

export type ExpensesStackParamList = {
  ExpenseList: undefined;
  ExpenseDetail: { expenseId: string };
  AddExpense: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();

//Inside stack navigator for the Expenses tab
function ExpensesStackNavigator() {
  return (
    <ExpensesStack.Navigator>
      <ExpensesStack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={{ headerShown: false }}
      />
      <ExpensesStack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{ title: '' }}
      />
      <ExpensesStack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ presentation: 'modal', headerShown: false }} //its a modal, so we can use the default back button to dismiss it
      />
    </ExpensesStack.Navigator>
  );
}

//Bottom tab navigator, user logged
function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <MainTab.Screen
        name="ExpensesTab"
        component={ExpensesStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>💰</Text>,
        }}
      />
      <MainTab.Screen
        name="ChartTab"
        component={ChartScreen}
        options={{
          tabBarLabel: 'Chart',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📊</Text>,
        }}
      />
      <MainTab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>⚙️</Text>,
        }}
      />
    </MainTab.Navigator>
  );
}

//Root navigator: decide if show login/signup or main tabs based on user authentication state
export default function AppNavigator() {
  const { user, setUser } = useAuthStore();

  return (
    <NavigationContainer>
      {user ? (
        <MainTabNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}