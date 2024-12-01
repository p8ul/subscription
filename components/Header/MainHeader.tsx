import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CartIconWithBadge from "./CartIconWithBadge";

interface MainHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
  showLeftComponentAsLogo?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  rightComponent,
  showLeftComponentAsLogo = false,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Component: either Back Button or Logo */}
      {showLeftComponentAsLogo ? (
        <Image source={require("../../assets/icons/64x64/2.png")} style={styles.logo} />
      ) : (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Component: defaults to Cart icon if no custom component is provided */}
      <View style={styles.rightComponent}>
        {rightComponent ? (
          rightComponent
        ) : (
          <TouchableOpacity onPress={() => router.navigate('/cart')}>
            <CartIconWithBadge color="white"/> 
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#121212",
  },
  backButton: {
    paddingRight: 16,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: 'white'
  },
  rightComponent: {
    paddingLeft: 16,
  },
});

export default MainHeader;
