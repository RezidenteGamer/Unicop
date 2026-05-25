import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from './lib/supabase';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PalpitesScreen from './screens/PalpitesScreen';
import RevisaoScreen from './screens/RevisaoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0c1b2a', borderTopColor: '#1e2d3d', height: 56 },
        tabBarActiveTintColor: '#f2cc2f',
        tabBarInactiveTintColor: '#8fa3b8',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
      }}
    >
      <Tab.Screen
        name="Calendário"
        component={HomeScreen}
        options={{ tabBarLabel: '📅 Calendário' }}
      />
      <Tab.Screen
        name="Palpites"
        component={PalpitesScreen}
        options={{ tabBarLabel: '🎯 Palpites' }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setVerificando(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (verificando) {
    return (
      <View style={{ flex: 1, backgroundColor: '#040b13', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f2cc2f" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Revisao" component={RevisaoScreen} options={{ presentation: 'modal', headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
