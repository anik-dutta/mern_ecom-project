// external imports
import { useSelector } from "react-redux";
import axios from "axios";
import { loadScript } from "@paypal/paypal-js";

// internal import
import UserOrderDetailsPageComponent from "./userPageComponents/UserOrderDetailsPageComponent";

const getUser = async (userId) => {
    const { data } = await axios.get(`/api/users/profile/${userId}`);
    return data;
};

const getOrder = async (orderId) => {
    const { data } = await axios.get(`/api/orders/user/${orderId}`);
    return data;
};

const loadPayPalScript = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
    loadScript({ 'client-id': 'AZ1it_RbQniW9ck15SCXu25OyKQGxZv8d2UgNxxqa94pWTGrLVwzQdwtGxAxqOorO9pMx1xIu_doO-lz' })
        .then(paypal => {
            paypal
                .Buttons(buttons(cartSubtotal, cartItems, orderId, updateStateAfterOrder))
                .render('#paypal-container-element');

        })
        .catch(err => {
            console.error("failed to load the PayPal JS SDK script", err);
        });
};

const buttons = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
    return {
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: cartSubtotal,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: cartSubtotal,
                                }
                            }
                        },
                        items: cartItems.map(product => {
                            return {
                                name: product.name,
                                unit_amount: {
                                    currency_code: "USD",
                                    value: product.price,
                                },
                                quantity: product.quantity,
                            };
                        })
                    }
                ]
            });
        },
        onCancel: onCancelHandler,
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {
                var transaction = orderData.purchase_units[0].payments.captures[0];

                if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubtotal)) {
                    updateOrder(orderId).then(result => {
                        if (result.isPaid) {
                            updateStateAfterOrder(result.paidAt);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        },
        onError: onErrorHandler,
    };
};

const onCancelHandler = function () {
    console.log("cancel");
};

const onErrorHandler = function (err) {
    console.log("error");
};

const updateOrder = async (orderId) => {
    const { data } = await axios.put(`/api/orders/paid/${orderId}`);
    return data;
};

export default function UserOrderDetailsPage() {
    const userInfo = useSelector(state => state.userRegisterLogin.userInfo);

    return <UserOrderDetailsPageComponent userInfo={userInfo} getUser={getUser} getOrder={getOrder} loadPayPalScript={loadPayPalScript} />;
}