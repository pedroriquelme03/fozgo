import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/auth/AuthProvider';
import { LocationProvider } from '../src/integrations/LocationProvider';
import { FavoritesProvider } from '../src/favorites/FavoritesProvider';
import { ReviewsProvider } from '../src/reviews/ReviewsProvider';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
        <LocationProvider>
        <FavoritesProvider>
        <ReviewsProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="explorar" options={{ animation: 'none' }} />
          <Stack.Screen name="favoritos" options={{ animation: 'none' }} />
          <Stack.Screen name="perfil" options={{ animation: 'none' }} />
          <Stack.Screen name="auth" />
          <Stack.Screen name="editar-perfil" />
          <Stack.Screen name="place/[id]" />
        </Stack>
        {!fontsLoaded && (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.teal} size="large" />
          </View>
        )}
        </ReviewsProvider>
        </FavoritesProvider>
        </LocationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    zIndex: 20,
  },
});
