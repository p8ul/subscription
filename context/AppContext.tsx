import useProductQueries from "@/database/hooks/products/useProductQueries";
import useSettingsQueries from "@/database/hooks/settings/useSettingsQueries";
import { categoryQueries } from "@/database/queries/categories";
import { orderQueries } from "@/database/queries/orders";
import { productQueries } from "@/database/queries/products";
import { settingsQueries } from "@/database/queries/settings";
import { stockQueries } from "@/database/queries/stock";
import { useSQLiteContext } from "expo-sqlite";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

// Define types for each piece of state in your context
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
}

interface Order {
  id?: string;
  products: Product[];
  total: number;
  paymentType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  id: number;
  storeName: string;
  currency: string;
  timezone: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
}

interface AppState {
  searchValue: string;
  categories: Category[];
  products: Product[];
  cart: Product[];
  orders: Order[];
  order: {
    products: Product[];
    total: number;
    paymentType: string;
    createdAt: string;
    updatedAt: string;
  };
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
  addOrder: (order: Order) => int;
  fetchOrders: (limit: number, offset: number) => void;
  fetchProducts: (limit: number, offset: number) => void;
  getProductsByID: (ids: number[]) => void;
}

// Initial state
const initialState: AppState = {
  searchValue: "",
  categories: [],
  products: [],
  cart: [],
  orders: [],
  order: {
    products: [],
    total: 0,
    paymentType: "Cash",
    createdAt: "",
    updatedAt: "",
  },
  modals: {
    confirmOrder: false,
  },
  loaders: {
    orders: false,
    products: false,
  },
  settings: {
    id: 1,
    storeName: "Liquor Store",
    timezone: "Africa/Nairobi",
    currency: "KSH",
  },
};

// Define action types
const SET_SEARCH_VALUE = "SET_SEARCH_VALUE";
export const SET_CATEGORIES = "SET_CATEGORIES";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const CLEAR_CART = "CLEAR_CART";
export const ADD_ORDER = "ADD_ORDER";
export const FILTER_ORDERS_BY_DATE = "FILTER_ORDERS_BY_DATE";
const INCREMENT_CART_ITEM = "INCREMENT_CART_ITEM";
const DECREMENT_CART_ITEM = "DECREMENT_CART_ITEM";
const UPDATE_MODAL_STATE = "UPDATE_MODAL_STATE";
const UPDATE_LOADERS = "UPDATE_LOADERS";
const UPDATE_ORDER = "UPDATE_ORDER";
const SET_ORDERS = "SET_ORDERS";
const SET_CART_ITEM_QUANTITY = "SET_CART_ITEM_QUANTITY";
const SET_SETTINGS = "SET_SETTINGS";

// Define the reducer function
const appReducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    case UPDATE_LOADERS:
      return { ...state, loaders: { ...action.payload } };
    case UPDATE_ORDER:
      return { ...state, order: action.payload };
    case UPDATE_MODAL_STATE:
      return { ...state, modals: action.payload };
    case SET_SEARCH_VALUE:
      return { ...state, searchValue: action.payload };
    case SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_PRODUCTS:
      return { ...state, products: action.payload };
    case SET_SETTINGS:
      return { ...state, settings: action.payload };
    case SET_ORDERS:
      return { ...state, orders: action.payload };
    case ADD_TO_CART:
      const existingProduct = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingProduct) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case CLEAR_CART:
      return { ...state, cart: [] };
    case ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload],
        cart: [], // Clear cart after placing an order
      };
    case FILTER_ORDERS_BY_DATE:
      return {
        ...state,
        orders: state.orders.filter((order) => order.date === action.payload),
      };
    case INCREMENT_CART_ITEM:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case SET_CART_ITEM_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case DECREMENT_CART_ITEM:
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
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

  const { getProductsByID } = useProductQueries();
  const { getSettings } = useSettingsQueries();

  useEffect(() => {
    createTables();
  }, []);

  async function createTables() {
    // await db.runAsync(`DROP TABLE IF EXISTS Setting;`)
    await db.runAsync(settingsQueries.createTable);
    await db.runAsync(settingsQueries.populateItems);
    await db.getAllAsync<Product>(categoryQueries.createTable);
    await db.runAsync(productQueries.addThreshold);
    await db.runAsync(categoryQueries.populateItems);
    await db.getAllAsync<Product>(orderQueries.createTable);
    await db.getAllAsync<Product>(productQueries.createTable);
    await db.runAsync(stockQueries.createTable);
    await db.runAsync(productQueries.updateTriggers);
    await db.getAllAsync<Product>(productQueries.createProducts);

    // await db.runAsync(productQueries.updateTable);
    // await db.runAsync(productQueries.copyData);
    // await db.runAsync(productQueries.deleteTable);
    // await db.runAsync(productQueries.renameTable);
    // await db.runAsync(productQueries.createProducts);
    // await db.runAsync(`DELETE FROM Product where name = 'Marlboro Menthol'`);
    await fetchProducts(10000, 0);
    await db.runAsync(stockQueries.createTable);
    const settings = await getSettings();
    dispatch(setSettings(settings));
  }

  const addOrder = async (order: Order) => {
    const productsJson = JSON.stringify(order.products);
    const result = await db.runAsync(orderQueries.createOrder, [
      productsJson,
      order.total,
      order.paymentType,
    ]);
    console.log(result.lastInsertRowId, result.changes);
    dispatch(clearCart());
    await fetchOrders(20, 0);

    for await (const product of order.products) {
      await db.runAsync(
        `UPDATE Product 
         SET rating = rating + ?, 
             quantity = quantity - ? 
         WHERE id = ? AND quantity > 0`, // Ensure quantity doesn't go below 0
        [product.quantity, product.quantity, product.id]
      );
    }
    fetchProducts(100, 0);

    return result.lastInsertRowId;
  };

  const fetchProducts = async (
    limit: number,
    offset: number,
    categoryId?: number // Optional category ID
  ) => {
    dispatch({
      type: UPDATE_LOADERS,
      payload: {
        loaders: {
          ...state.loaders,
          products: true,
        },
      },
    });

    await db.getAllAsync<Product>(productQueries.createTable);

    // Base query
    let query = "SELECT * FROM Product";
    const params: (number | string)[] = [];

    // Add category filter if categoryId is provided
    if (categoryId) {
      query += " WHERE category = ?";
      params.push(categoryId);
    }

    // Add ordering and pagination
    query += " ORDER BY rating DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const allRows = await db.getAllAsync(query, params);

    dispatch(setProducts(allRows));

    dispatch({
      type: UPDATE_LOADERS,
      payload: {
        loaders: {
          ...state.loaders,
          products: false,
        },
      },
    });
  };

  const fetchOrders = async (limit: number, offset: number) => {
    dispatch({
      type: UPDATE_LOADERS,
      payload: {
        loaders: {
          ...state.loaders,
          orders: true,
        },
      },
    });

    const allRows = await db.getAllAsync(
      "SELECT * FROM Orders ORDER BY id DESC LIMIT 100"
    );

    dispatch(setOrders(allRows));
    dispatch({
      type: UPDATE_LOADERS,
      payload: {
        loaders: {
          ...state.loaders,
          orders: false,
        },
      },
    });
  };

  const updateOrder = (order: Order) => {
    const productsJson = JSON.stringify(order.products);
    db.withTransactionAsync(async () => {
      db.runAsync(
        orderQueries.update,
        [productsJson, order.total, order.paymentType, order.id],
        () => {
          dispatch({ type: "UPDATE_ORDER", order });
        }
      );
    });
  };

  const deleteOrder = (orderId: string) => {
    db.withTransactionAsync(async () => {
      await db.runAsync(orderQueries.softDelete, [orderId]);
    });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        addOrder,
        fetchOrders,
        fetchProducts,
        getProductsByID,
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
export const setCategories = (categories: Category[]) => ({
  type: SET_CATEGORIES,
  payload: categories,
});
export const setProducts = (products: Product[]) => ({
  type: SET_PRODUCTS,
  payload: products,
});
export const addToCart = (product: Product) => ({
  type: ADD_TO_CART,
  payload: product,
});
export const removeFromCart = (productId: string) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});
export const clearCart = () => ({ type: CLEAR_CART });
export const addOrder = (order: Order) => ({ type: ADD_ORDER, payload: order });
export const filterOrdersByDate = (date: string) => ({
  type: FILTER_ORDERS_BY_DATE,
  payload: date,
});
export const incrementCartItem = (productId: string) => ({
  type: INCREMENT_CART_ITEM,
  payload: productId,
});
export const decrementCartItem = (productId: string) => ({
  type: DECREMENT_CART_ITEM,
  payload: productId,
});
export const updateModals = (payload: any) => ({
  type: UPDATE_MODAL_STATE,
  payload: payload,
});

export const updateOrder = (payload: any) => ({
  type: UPDATE_ORDER,
  payload: payload,
});

export const updateLoaders = (payload: any) => ({
  type: UPDATE_LOADERS,
  payload: payload,
});

export const setOrders = (payload: any) => ({
  type: SET_ORDERS,
  payload,
});

export const setCartQuantity = (payload: any) => ({
  type: SET_CART_ITEM_QUANTITY,
  payload,
});

export const setSettings = (payload: any) => ({
  type: SET_SETTINGS,
  payload,
});
