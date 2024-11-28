import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppContext, AppProvider } from "./context/AppContext";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import React from "react";
import { SQLiteProvider } from "expo-sqlite";
import { Slot } from "expo-router";

const loadDatabase = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("./assets/mySQLiteDB.db");
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

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
         <Slot />
        <View style={{ flex: 1 }}>
          <ActivityIndicator size={"large"} />
          <Text>Loading Database...</Text>
        </View>
      </SQLiteProvider>
    );

  return (
    <GluestackUIProvider mode="light">
      <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
        <AppProvider>
          <View style={styles.container}>
            <Text>Hellop wolrd!</Text>
            <StatusBar style="auto" />
            <Slot />
          </View>
        </AppProvider>
      </SQLiteProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
