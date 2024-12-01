import MainHeader from "@/components/Header/MainHeader";
import CartItem from "@/components/sections/cart/CartItem";
import HomeSection from "@/components/sections/Home/HomeSection";
import UserSection from "@/components/sections/Users/UserSection";
import { Box } from "@/components/ui/box";
import { setUsers, useAppContext } from "@/context/AppContext";
import useUserQueries from "@/database/hooks/users/useUserQueries";
import { router } from "expo-router";
import { get } from "lodash";
import React, { useEffect } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserScreen = () => {
  const { height } = Dimensions.get("screen");
  const { dispatch, users } = useAppContext();
  const { initializeUserTable, getUsers } = useUserQueries();

  return (
    <Box style={{ backgroundColor: "white", height: height }}>
      <MainHeader
        title={`Users (${get(users, "length")})`}
        showLeftComponentAsLogo
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              router.push(`/users/${0}`);
            }}
            style={{
              backgroundColor: "#333",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        }
      />
      <UserSection />
    </Box>
  );
};

export default UserScreen;
