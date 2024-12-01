import { setUsers, useAppContext } from "@/context/AppContext";
import { get, map } from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import useUserQueries from "@/database/hooks/users/useUserQueries";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const UserSection = () => {
  const { users, dispatch } = useAppContext();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const { softDeleteUser } = useUserQueries();
  const { initializeUserTable, getUsers } = useUserQueries();
  const isFocused = useIsFocused();
  useEffect(() => {
    fetchData();
  }, [isFocused]);
  const fetchData = async () => {
    await initializeUserTable();
    const users = await getUsers();
    dispatch(setUsers(users));
  };

  const handleDeleteUser = async () => {
    await softDeleteUser(get(user, "id"));
    await fetchData();
  };

  return (
    <View style={styles.container}>
      {/* Subscriptions */}
      <ConfirmModal
        visible={open}
        onConfirm={() => {
          handleDeleteUser();
        }}
        onClose={() => setOpen(false)}
        title="Delete User"
        subTitle={`Are you sure you want to delete ${get(user, "name")}`}
      />
      <View style={styles.section}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push(`/users/${item.id}`);
              }}
            >
              <View style={styles.listItem}>
                <View
                  style={{
                    padding: 10,
                  }}
                >
                  <Ionicons name={"person-outline"} size={24} color={"white"} />
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDate}>{item.phone}</Text>
                </View>

                <Menu>
                  <MenuTrigger>
                    <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="white"
                    />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsWrapper: {
                        backgroundColor: "#1c1b1b",
                        padding: 10,
                      },
                    }}
                  >
                    <MenuOption
                      onSelect={() => {
                        setUser(item);
                        setOpen(true);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                        }}
                      >
                        <Text style={{ fontWeight: "bold", color: "#e38888" }}>
                          Delete
                        </Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    height: height + 1000,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  expenses: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  subtext: {
    color: "#aaa",
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  itemDate: {
    color: "#aaa",
    fontSize: 14,
  },
  itemAmount: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserSection;
