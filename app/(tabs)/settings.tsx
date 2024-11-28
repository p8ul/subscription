import MainHeader from "@/components/Header/MainHeader";
import DefaultSnackBar from "@/components/Modals/DefaultSnackBar";
import SettingsForm from "@/components/sections/settings/SettingsForm";
import { setSettings, useAppContext } from "@/context/AppContext";
import useSettingsQueries from "@/database/hooks/settings/useSettingsQueries";
import { useIsFocused } from "@react-navigation/native";
import { View } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
const Settings = () => {
  const { getSettings, updateSettings } = useSettingsQueries();
  const { dispatch } = useAppContext();
  const isFocused = useIsFocused();
  const [settings, setSetting] = useState({});
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const handleGetSettings = async () => {
    const data = await getSettings();

    if (data) {
      setSetting({ ...data });
      dispatch(setSettings({ ...data }));
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetSettings();
  }, [isFocused]);

  const handleSubmit = async (values) => {
    await updateSettings(values);
    setVisible(true)
    await handleGetSettings();
  };

  if (!settings.storeName || loading) {
    return <ActivityIndicator size={"large"} />;
  }
  return (
    <>
      <MainHeader title="Settings" rightComponent={<View></View>} />
      <SettingsForm initialValues={settings} onSubmit={handleSubmit} />
      <DefaultSnackBar
              visible={visible}
              onDismiss={() => setVisible(false)}
              title={'Settings saved successfully.'}
            />
    </>
  );
};

export default Settings;
