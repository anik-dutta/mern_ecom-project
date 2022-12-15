// external imports
import axios from "axios";

// internal import
import UserOrdersPageComponent from "./userPageComponents/UserOrdersPageComponent";

const getOrders = async () => {
    const { data } = await axios.get('/api/orders');
    return data;
};

export default function UserOrdersPage() {
    return <UserOrdersPageComponent getOrders={getOrders} />;
}