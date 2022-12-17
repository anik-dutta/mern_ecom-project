// external imports
import { useSelector, useDispatch } from 'react-redux';

// internal imports
import CartPageComponent from './pageComponents/CartPageComponent';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

export default function CartPage() {
    const cartItems = useSelector(state => state.cart.cartItems);
    const cartSubtotal = useSelector(state => state.cart.cartSubtotal);
    const itemsCount = useSelector(state => state.cart.itemsCount);
    const reduxDispatch = useDispatch();

    return <CartPageComponent addToCart={addToCart} removeFromCart={removeFromCart} cartItems={cartItems} cartSubtotal={cartSubtotal} reduxDispatch={reduxDispatch} itemsCount={itemsCount} />;
}