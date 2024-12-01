import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";

// Reusable Menu Popper Component
const MenuPopper = ({
  triggerIcon = "dots-three-vertical", // Default icon
  iconSize = 24,
  iconColor = "white",
  options = [],
  menuStyle = {},
  optionsWrapperStyle = {},
  optionTextStyle = {},
}) => {
  return (
    <Menu>
      {/* Menu Trigger */}
      <MenuTrigger>
        <Entypo name={triggerIcon} size={iconSize} color={iconColor} />
      </MenuTrigger>

      {/* Menu Options */}
      <MenuOptions
        customStyles={{
          optionsWrapper: { ...styles.optionsWrapper, ...optionsWrapperStyle },
        }}
      >
        {options.map((option, index) => (
          <MenuOption
            key={index}
            onSelect={option.onSelect}
            customStyles={{
              optionWrapper: { ...styles.optionWrapper, ...menuStyle },
            }}
          >
            <Text style={{ ...styles.optionText, ...optionTextStyle }}>
              {option.label}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default MenuPopper;

// Default Styles
const styles = StyleSheet.create({
  optionsWrapper: {
    backgroundColor: "#1c1b1b",
    padding: 10,
  },
  optionWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  optionText: {
    fontWeight: "bold",
    color: "#e38888",
  },
});
