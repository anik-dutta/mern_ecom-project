// external import
import axios from 'axios';

// internal import
import OrderDetailsPageComponent from './adminPageComponents/OrderDetailsPageComponent';

const getOrder = async (orderId) => {
    const { data } = await axios.get(`/api/orders/user/${orderId}`);
    return data;
};

const markAsDelivered = async (id) => {
    const { data } = await axios.put(`/api/orders/delivered/${id}`);
    if (data) {
        return data;
    }
};

export default function AdminOrderDetailsPage() {
    return <OrderDetailsPageComponent getOrder={getOrder} markAsDelivered={markAsDelivered} />;
}