import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useAppContext } from "@/context/AppContext";
import { get } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const { height, width } = Dimensions.get("window");

const MPesaQRCode = ({ amount }) => {
  const [visible, setVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const { settings } = useAppContext();
  const navigation = useNavigation();

  const [qrCodeString, setQrCodeString] = useState(
    `BG|${get(settings, "tillNumber")}|${amount}`
  );

  useEffect(() => {
    if (currentTab === 0) {
      setQrCodeString(`BG|${get(settings, "tillNumber")}|${amount}`);
    } else if (currentTab === 1) {
      setQrCodeString(
        `PB|${get(settings, "paybillNumber")}|${amount}|${get(settings, "accountNumber")}`
      );
    } else {
      setQrCodeString(`SM|${get(settings, "phoneNumber")}|${amount}`);
    }
  }, [currentTab]);

  const isTabConfigured = () => {
    if (currentTab === 0) return get(settings, "tillNumber");
    if (currentTab === 1) return get(settings, "paybillNumber");
    if (currentTab === 2) return get(settings, "phoneNumber");
    return false;
  };

  return (
    <>
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={30}
            color="#4CAF50"
          />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Scan with M-Pesa App</Text>

            {/* Segmented Control */}
            <SegmentedControl
              values={["Buy Goods", "Paybill", "Send Money"]}
              style={styles.segmentedControl}
              selectedIndex={currentTab}
              onChange={(event) =>
                setCurrentTab(event.nativeEvent.selectedSegmentIndex)
              }
            />

            {isTabConfigured() ? (
              <>
                {/* QR Code Display */}
                <QRCode value={qrCodeString} size={200} />

                {/* Payment Details */}
                <View style={styles.details}>
                  {currentTab === 0 && (
                    <>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Till Number:</Text>{" "}
                        {get(settings, "tillNumber")}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Amount:</Text> KSH {amount}
                      </Text>
                    </>
                  )}
                  {currentTab === 1 && (
                    <>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Paybill Number:</Text>{" "}
                        {get(settings, "paybillNumber")}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Account Number:</Text>{" "}
                        {get(settings, "accountNumber")}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Amount:</Text> KSH {amount}
                      </Text>
                    </>
                  )}
                  {currentTab === 2 && (
                    <>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Phone Number:</Text>{" "}
                        {get(settings, "phoneNumber")}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.label}>Amount:</Text> KSH {amount}
                      </Text>
                    </>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Missing Payment Details */}
                <Text style={styles.warningText}>
                  Payment details for this option are not configured.
                </Text>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => {
                    setVisible(false);
                    router.push("/settings");
                  }}
                >
                  <Text style={styles.settingsButtonText}>
                    Go to Settings
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  segmentedControl: {
    width: width / 1.5,
    marginBottom: 20,
  },
  details: {
    marginTop: 20,
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 16,
    color: "#FF5252",
    textAlign: "center",
    marginBottom: 20,
    minHeight: height / 3 - 100,
    justifyContent: "center",
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    alignSelf: 'center',
    paddingTop: 80
  },
  settingsButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    color: '#fff'
  },
  settingsButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MPesaQRCode;