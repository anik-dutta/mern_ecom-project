// external import
import axios from 'axios';

// internal import
import EditUsersPageComponent from './adminPageComponents/EditUsersPageComponent';

const fetchUser = async (userId) => {
    const { data } = await axios.get(`/api/users/${userId}`);
    return data;
};

const updateUserApiRequest = async (userId, name, lastName, email, isAdmin) => {
    const { data } = await axios.put(`/api/users/${userId}`, { name, lastName, email, isAdmin });
    return data;
};

export default function AdminEditUsersPage() {
    return <EditUsersPageComponent fetchUser={fetchUser} updateUserApiRequest={updateUserApiRequest} />;
};