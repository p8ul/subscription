import { Box } from "@/components/ui/box";
import React from "react";
import { ActivityIndicator, View, Dimensions } from "react-native";
import { useSQLiteContext } from "expo-sqlite/next";
import MainHeader from "@/components/Header/MainHeader";
import { useAppContext } from "@/context/AppContext";
import { get } from "lodash";
import HomeSection from "@/components/sections/Home/HomeSection";

const {height} = Dimensions.get('screen');

const HomeScreen = () => {
  const [loading, setLoading] = React.useState(true);
  const db = useSQLiteContext();
  const {settings} = useAppContext()

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Box
          style={{
            marginTop: 50,
          }}
        ></Box>
        <ActivityIndicator />
      </>
    );
  }

  return (
    <Box style={{ backgroundColor: "white", height: height }}>
      <MainHeader title={get(settings, 'storeName')} showLeftComponentAsLogo />

        <HomeSection />
    </Box>
  );
};

export default HomeScreen;
