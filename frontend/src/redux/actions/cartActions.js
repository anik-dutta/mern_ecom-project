// external import
import axios from 'axios';

// internal import
import * as actionTypes from '../constants/cartConstants';

export function addToCart(productID, quantity) {
    return async function (dispatch, getState) {
        const { data } = await axios.get(`/api/products/get-one/${productID}`);

        dispatch({
            type: actionTypes.ADD_TO_CART,
            payload: {
                productID: data._id,
                name: data.name,
                price: data.price,
                image: data.images[0] ? data.images[0] : null,
                count: data.count,
                quantity
            }
        });

        localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
    };
}

export function removeFromCart(productID, quantity, price) {
    return async function (dispatch, getState) {
        dispatch({
            type: actionTypes.REMOVE_FROM_CART,
            payload: {
                productID, price, quantity
            }
        });
        localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
    };
}