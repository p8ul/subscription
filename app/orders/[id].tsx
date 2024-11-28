import useOrderQueries from "@/database/hooks/orders/useOrderQueries";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Receipt from "@/components/sections/Orders/Receipt";

export default function OrderScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const { getOrderById } = useOrderQueries();
  const isFocused = useIsFocused();

  const handleSetProducts = (products) => {
    try {
      setProducts(JSON.parse(products));
    } catch (error) {}
  };

  const handleFetchOrder = async () => {
    const order = await getOrderById(id);
    setOrder(order);

    handleSetProducts(order.products);
  };
  useEffect(() => {
    handleFetchOrder();
  }, [id, isFocused]);
  return <Receipt id={id as string} order={order} products={products} />;
}
