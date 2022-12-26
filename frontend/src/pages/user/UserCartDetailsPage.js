// external imports
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// internal imports
import UserCartDetailsPageComponent from "./userPageComponents/UserCartDetailsPageComponent";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";

const getUser = async (userId) => {
    const { data } = await axios.get(`/api/users/profile/${userId}`);
    return data;
};

const createOrder = async (orderData) => {
    const { data } = await axios.post('/api/orders', { ...orderData });
    return data;
};

export default function UserCartDetailsPage() {
    const cartItems = useSelector(state => state.cart.cartItems);
    const cartSubtotal = useSelector(state => state.cart.cartSubtotal);
    const itemsCount = useSelector(state => state.cart.itemsCount);
    const userInfo = useSelector(state => state.userRegisterLogin.userInfo);

    const reduxDispatch = useDispatch();

    return <UserCartDetailsPageComponent cartItems={cartItems} cartSubtotal={cartSubtotal} itemsCount={itemsCount} reduxDispatch={reduxDispatch} addToCart={addToCart} removeFromCart={removeFromCart} userInfo={userInfo} getUser={getUser} createOrder={createOrder} />;
}