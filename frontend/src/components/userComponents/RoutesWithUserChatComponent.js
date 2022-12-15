// external import
import { Outlet } from 'react-router-dom';

// internal import
import UserChatComponent from './UserChatComponent';

export default function RoutesWithUserChatComponent() {
    return (<><UserChatComponent /><Outlet /></>);
}