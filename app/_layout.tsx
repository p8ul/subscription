import "@/global.css";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { useCart } from "@/store/cartStore";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/store/authStore";
import CustomStripeProvider from "@/components/CustomStripeProvider";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppProvider } from "@/context/AppContext";
// import FloatingHeader from "@/components/ui/header/FloatingHeader";

// Create a client
const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

const loadDatabase = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("../assets/mySQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function RootLayout() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
        <View style={{ flex: 1 }}>
          <ActivityIndicator size={"large"} />
          <Text>Loading Database...</Text>
        </View>
      </SQLiteProvider>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <CustomStripeProvider>
        <GluestackUIProvider>
          <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
            <AppProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    {/* <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  /> */}
                  </Stack>
                </ThemeProvider>
              </SafeAreaView>
            </AppProvider>
          </SQLiteProvider>
        </GluestackUIProvider>
      </CustomStripeProvider>
    </QueryClientProvider>
  );
}
