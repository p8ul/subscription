import { useSQLiteContext } from "expo-sqlite";

const useSettingsQueries = () => {
  const db = useSQLiteContext();

  // Add default settings if they don't exist
  const initializeSettings = async () => {
    try {
      await db.runAsync(
        `INSERT OR IGNORE INTO Settings (storeName, currency, timezone) VALUES (?, ?, ?)`,
        ["My Store", "KSH", "Africa/Nairobi"]
      );
      console.log("Settings initialized successfully.");
    } catch (error) {
      console.error("Error initializing settings:", error);
    }
  };

  // Get settings
  const getSettings = async () => {
    try {
      const settings = await db.getAllAsync(`SELECT * FROM Settingss LIMIT 1`);
      return settings[0] || {};
    } catch (error) {
      console.error("Error fetching settings:", error);
      return {};
    }
  };

  // Update settings
  const updateSettings = async ({
    storeName,
    currency,
    timezone,
    paybillNumber,
    accountNumber,
    tillNumber,
    phoneNumber,
    autoGenerateNextMonth,
  }) => {
    console.log(
      "await generateNextMonthSubscriptions(); :>> ",
      autoGenerateNextMonth
    );
    let autoGen = 0;
    if (autoGenerateNextMonth) {
      autoGen = 1;
    }
    try {
      await db.runAsync(
        `UPDATE Settingss SET storeName = ?, currency = ?, timezone = ?, paybillNumber = ?, accountNumber = ?, tillNumber = ?, phoneNumber = ?, autoGenerateNextMonth = ? WHERE id = 1`,
        [
          storeName,
          currency,
          timezone,
          paybillNumber || "",
          accountNumber || "",
          tillNumber || "",
          phoneNumber,
          autoGen,
        ]
      );
      console.log("Settings updated successfully.");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  // Get the timezone offset for use in date queries
  const getTimezoneOffset = async () => {
    try {
      const settings = await getSettings();
      return settings?.timezone || 3; // Default to 3 (EAT) if not found
    } catch (error) {
      console.error("Error fetching timezone offset:", error);
      return 3;
    }
  };

  // Delete all settings (if needed, generally not recommended)
  const deleteSettings = async () => {
    try {
      await db.runAsync(`DELETE FROM Settingss`);
      console.log("Settings deleted successfully.");
    } catch (error) {
      console.error("Error deleting settings:", error);
    }
  };

  return {
    initializeSettings,
    getSettings,
    updateSettings,
    getTimezoneOffset,
    deleteSettings,
  };
};

export default useSettingsQueries;
