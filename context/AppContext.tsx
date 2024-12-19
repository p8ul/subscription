import useProductQueries from "@/database/hooks/products/useProductQueries";
import useSettingsQueries from "@/database/hooks/settings/useSettingsQueries";
import useSubscriptionQueries from "@/database/hooks/subscription/useSubscriptionQueries";
import useUserQueries from "@/database/hooks/users/useUserQueries";
import { settingsQueries } from "@/database/queries/settings";
import { useSQLiteContext } from "expo-sqlite";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

// Define types for each piece of state in your context

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  meta: any;
  createAt: string;
}

export interface Settings {
  id: number;
  storeName: string;
  currency: string;
  timezone: string;
}

interface AppState {
  searchValue: string;
  users: User[];
  modals: {
    confirmOrder: boolean;
  };
  loaders: {
    orders: boolean;
    products: boolean;
  };
  settings: Settings;
}

interface AppContextProps extends AppState {
  dispatch: React.Dispatch<any>;
}

// Initial state
const initialState: AppState = {
  searchValue: "",
  users: [],
  modals: {
    confirmOrder: false,
  },
  loaders: {
    orders: false,
    products: false,
  },
  settings: {
    id: 1,
    storeName: "Subscription",
    timezone: "Africa/Nairobi",
    currency: "KSH",
  },
};

// Define action types
const SET_SEARCH_VALUE = "SET_SEARCH_VALUE";
const UPDATE_LOADERS = "UPDATE_LOADERS";
const SET_SETTINGS = "SET_SETTINGS";
const SET_USERS = "SET_USERS";

// Define the reducer function
const appReducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    case UPDATE_LOADERS:
      return { ...state, loaders: { ...action.payload } };
    case SET_SEARCH_VALUE:
      return { ...state, searchValue: action.payload };
    case SET_SETTINGS:
      return { ...state, settings: action.payload };
    case SET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const db = useSQLiteContext();

  const { getSettings } = useSettingsQueries();
  const { initializeUserTable, dummyUsers, getUsers } = useUserQueries();
  const { initializeSubscriptionTable, generateNextMonthSubscriptions } =
    useSubscriptionQueries();

  useEffect(() => {
    createTables();
  }, []);

  async function createTables() {
    // await db.runAsync(`DROP TABLE IF EXISTS Settingss;`);
    await initializeUserTable();
    await initializeSubscriptionTable();
    await dummyUsers();
    
    await db.runAsync(settingsQueries.createTable);
    await db.runAsync(settingsQueries.populateItems);

    const settings = await getSettings();
    if (settings?.autoGenerateNextMonth) {
      await generateNextMonthSubscriptions();
    }
    const users = await getUsers();

    dispatch(setUsers(users));

    dispatch(setSettings(settings));
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Export action creators for convenience
export const setSearchValue = (value: string) => ({
  type: SET_SEARCH_VALUE,
  payload: value,
});

export const updateLoaders = (payload: any) => ({
  type: UPDATE_LOADERS,
  payload: payload,
});

export const setSettings = (payload: any) => ({
  type: SET_SETTINGS,
  payload,
});

export const setUsers = (payload: any) => ({
  type: SET_USERS,
  payload,
});
