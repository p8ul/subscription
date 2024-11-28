import React, { useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const FloatingHeader: React.FC<{children: React.ReactNode}> = ({children}) => {
  // Set up animated value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate scroll value to animate header translateY
  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  return (
    <>
      {/* Floating Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <Text style={styles.headerText}>Floating Header</Text>
      </Animated.View>

      {/* Content with scroll listener */}
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Replace this section with your screen content */}
        <View style={styles.scrollContent}>
          {children}
        </View>
      </Animated.ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    paddingTop: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingTop: 100, // Ensures content doesn't go under the header
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 24,
    marginVertical: 8,
  },
});

export default FloatingHeader;
