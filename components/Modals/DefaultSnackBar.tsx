import { Snackbar } from "react-native-paper";

const DefaultSnackBar = ({ visible, onDismiss, title, error = false }) => {
  return (
    <Snackbar
      style={{ zIndex: 5000, backgroundColor: error ? "red" : "green" }}
      visible={visible}
      onDismiss={onDismiss}
      duration={5000}
    >
      {title}
    </Snackbar>
  );
};

export default DefaultSnackBar;
