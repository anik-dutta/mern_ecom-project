// external imports
import axios from 'axios';
import socketIOClient from 'socket.io-client';

// internal import
import AnalyticsPageComponent from './adminPageComponents/AnalyticsPageComponent';

const fetchOrdersForFirstDate = async (abctrl, firstDateToCompare) => {
    const { data } = await axios.get(`/api/orders/analysis/${firstDateToCompare}`, {
        signal: abctrl.signal
    });
    return data;
};

const fetchOrdersForSecondDate = async (abctrl, secondDateToCompare) => {
    const { data } = await axios.get(`/api/orders/analysis/${secondDateToCompare}`, {
        signal: abctrl.signal
    });
    return data;
};

export default function AdminAnalyticsPage() {
    return <AnalyticsPageComponent fetchOrdersForFirstDate={fetchOrdersForFirstDate} fetchOrdersForSecondDate={fetchOrdersForSecondDate} socketIOClient={socketIOClient} />;
};