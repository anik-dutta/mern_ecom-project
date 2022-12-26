// external import
import axios from "axios";

// internal import
import OrdersPageComponent from "./adminPageComponents/OrdersPageComponent";

const getOrders = async () => {
    const { data } = await axios.get('/api/orders/admin');
    return data;
};

export default function AdminOrdersPage() {
    return <OrdersPageComponent getOrders={getOrders} />;
}