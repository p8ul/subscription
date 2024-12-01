import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { Box } from "@/components/ui/box";
import WelcomeScreen from "@/components/sections/Splash";

const { width, height } = Dimensions.get("screen");

const IndexScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");

        if (!hasSeenWelcome) {
          setShowWelcomeScreen(true);
          // Set the flag after showing the welcome screen
          await AsyncStorage.setItem("hasSeenWelcome", "true");
        } else {
          // If the user has already seen the welcome screen, navigate to home
          router.push("home");
        }
      } catch (error) {
        console.error("Error checking welcome screen flag:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (showWelcomeScreen) {
      setTimeout(() => {
        router.push("home");
      }, 3000); // Show the welcome screen for 3 seconds
    }
  }, [showWelcomeScreen]);

  if (isLoading) {
    return null; // Show a loading spinner or placeholder if needed
  }

  return (
    <Box
      style={{
        flex: 1,
        width,
        height,
      }}
    >
      {showWelcomeScreen && <WelcomeScreen />}
    </Box>
  );
};

export default IndexScreen;