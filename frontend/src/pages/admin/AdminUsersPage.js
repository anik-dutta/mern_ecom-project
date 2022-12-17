// external import
import axios from 'axios';

// internal import
import UsersPageComponent from './adminPageComponents/UsersPageComponent';

const fetchUsers = async (abctrl) => {
    const { data } = await axios.get('/api/users', {
        signal: abctrl.signal
    });
    return data;
};

const deleteUser = async (userId) => {
    const { data } = await axios.delete(`/api/users/${userId}`);
    return data;
};

export default function AdminUsersPage() {
    return <UsersPageComponent fetchUsers={fetchUsers} deleteUser={deleteUser} />;
};