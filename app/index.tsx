import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import WelcomeScreen from "@/components/sections/Splash";

const IndexScreen = () => {
  useEffect(() => {
    setTimeout(() => {
      // router.navigiate("home");
    }, 3000);
  }, []);
  return (
    <Box>
      <Box
        style={{
          
        }}
      ></Box>
      <ActivityIndicator />
      <WelcomeScreen />
    </Box>
  );
};

export default IndexScreen;
