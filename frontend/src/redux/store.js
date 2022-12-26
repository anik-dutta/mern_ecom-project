// external imports
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

// internal imports
import { cartReducer } from './reducers/cartReducers';
import { userRegisterLoginReducer } from "./reducers/userReducers";
import { getCategoriesReducer } from "./reducers/categoryReducers";
import { adminChatReducer } from "./reducers/adminChatReducer";

const reducer = combineReducers({
    cart: cartReducer,
    userRegisterLogin: userRegisterLoginReducer,
    getCategories: getCategoriesReducer,
    adminChat: adminChatReducer
});

const cartItemsInLocalStorage = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

const userInfoInLocalStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {};

const INITIAL_STATE = {
    cart: {
        cartItems: cartItemsInLocalStorage,
        itemsCount: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((quantity, item) => quantity + Number(item.quantity), 0) : 0,
        cartSubtotal: cartItemsInLocalStorage ? cartItemsInLocalStorage.reduce((price, item) => price + Number(item.quantity) * Number(item.price), 0) : 0
    },
    userRegisterLogin: { userInfo: userInfoInLocalStorage }
};


const middleware = [thunk];
const store = createStore(reducer, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)));

export default store;