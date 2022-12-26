// external imports
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

// internal imports
import { addToCart } from '../redux/actions/cartActions';
import ProductDetailsPageComponent from './pageComponents/ProductDetailsPageComponent';

const getProductDetails = async (id) => {
    const { data } = await axios.get(`/api/products/get-one/${id}`);
    return data;
};

const writeReviewApiRequest = async (productId, formInputs) => {
    const { data } = await axios.post(`/api/users/review/${productId}`, { ...formInputs });
    return data;
};

export default function ProductDetailsPage() {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.userRegisterLogin.userInfo);

    return <ProductDetailsPageComponent addToCartReduxAction={addToCart} reduxDispatch={dispatch} getProductDetails={getProductDetails} userInfo={userInfo} writeReviewApiRequest={writeReviewApiRequest} />;
};