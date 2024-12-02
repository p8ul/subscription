import useSubscriptionQueries from "@/database/hooks/subscription/useSubscriptionQueries";
import { get } from "lodash";
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
import { useIsFocused } from "@react-navigation/native";
import EmptySubscription from "./EmptySubscription";
import SubFormModal from "./SubFormModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getFullMonthName } from "@/utils";
import MenuPopper from "@/components/Modals/MenuPopper";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const UserSubscription: React.FC<{ userId: number }> = ({ userId }) => {
  const {
    getUserSubscriptions,
    addSubscription,
    editSubscription,
    softDeleteSubscription,
    markSubscriptionAsPaid,
  } = useSubscriptionQueries();
  const [sub, setSub] = useState();
  const [selectedSub, setSelectedSub] = useState({});
  const [total, setTotal] = useState(0);
  const isFocused = useIsFocused();
  const [subFormOpen, setSubFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paidModalOpen, setPaidModalOpen] = useState(false);

  const handleFetchSubscription = async () => {
    const subs = await getUserSubscriptions({ userId });
    setSub(get(subs, "subscriptions", []));
    setTotal(get(subs, "totalAmount", 0));
  };

  const handleMarkAsPaid = async (item) => {
    setSelectedSub(item);
    setTimeout(() => {
      setPaidModalOpen(true);
    }, 500);
  };

  const markAsPaid = async () => {
    await markSubscriptionAsPaid(get(selectedSub, "id"));
    await handleFetchSubscription();
  };

  const handleAddUpdateSubscription = async (values) => {
    if (get(selectedSub, "id")) {
      await editSubscription({ ...values, id: selectedSub.id, userId });
    } else {
      await addSubscription({ ...values, userId });
    }
    await handleFetchSubscription();
  };

  const handlerEdit = (item) => {
    setSelectedSub(item);
    setTimeout(() => {
      setSubFormOpen(true);
    }, 500);
  };

  const handleDelete = async (item) => {
    await softDeleteSubscription(item?.id);
    await handleFetchSubscription();
  };

  useEffect(() => {
    handleFetchSubscription();
  }, [userId, isFocused]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.expenses}>{total}/-</Text>
        <Text style={styles.subtext}>
          Subscriptions in {getFullMonthName()}
        </Text>

        {/* Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.button} onPress={() => {
            router.push('users')
          }}>
            <Text style={styles.buttonText}>Manage subs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectedSub({});
              setTimeout(() => {
                setSubFormOpen(true);
              }, 500);
            }}
          >
            <Text style={styles.buttonText}>Add new sub</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConfirmModal
        visible={deleteModalOpen}
        onConfirm={() => {
          handleDelete(selectedSub);
        }}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Subscription"
        subTitle={`Are you sure you want to delete ${get(selectedSub, "name")}`}
      />
      <ConfirmModal
        visible={paidModalOpen}
        onConfirm={() => {
          markAsPaid();
        }}
        onClose={() => setPaidModalOpen(false)}
        title="Subscription Paid"
        subTitle={`Are you sure you want to mark ${get(selectedSub, "name")} as Paid`}
      />
      <SubFormModal
        visible={subFormOpen}
        onClose={() => setSubFormOpen(false)}
        initialValues={selectedSub}
        onSubmit={(values) => handleAddUpdateSubscription(values)}
      />
      {/* Subscriptions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Subscriptions ({get(sub, "length")})
        </Text>
        <FlatList
          data={sub}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptySubscription addProduct={() => setSubFormOpen(true)} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handlerEdit(item);
              }}
            >
              <View style={styles.listItem}>
                <View style={{ padding: 5 }}>
                  <Ionicons name="wallet-outline" size={24} color="white" />
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDate}>{item.dueDate}</Text>
                  <View
                    style={{
                      backgroundColor:
                        item.status == "pending" ? "#a83232" : "green",
                      width: 70,
                      marginTop: 2,
                      padding: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.itemAmount}>{item.amount}/-</Text>
                  <MenuPopper
                    options={[
                      {
                        label: "Edit",
                        onSelect: () => {
                          handlerEdit(item);
                        },
                      },
                      {
                        label: "Paid",
                        onSelect: () => {
                          handleMarkAsPaid(item);
                        },
                      },
                      {
                        label: "Delete",
                        onSelect: () => {
                          setSelectedSub(item);
                          setTimeout(() => {
                            setDeleteModalOpen(true);
                          }, 500);
                        },
                      },
                    ]}
                    iconColor="white"
                    optionsWrapperStyle={{ backgroundColor: "#222" }}
                    optionTextStyle={{ color: "#e3e3e3" }}
                  />
                </View>
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
    backgroundColor: "#121212",
    padding: 20,
    height,
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

export default UserSubscription;
