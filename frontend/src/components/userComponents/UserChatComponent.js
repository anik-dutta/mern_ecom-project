// external imports 
import { InputGroup, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';

// import css file
// import '../../chats.css';

export default function UserChatComponent() {
    const [socket, setSocket] = useState(false);
    const [chat, setChat] = useState([]);
    const [messageReceived, setMessageReceived] = useState(false);
    const [chatConnectionInfo, setChatConnectionInfo] = useState(false);
    const [reconnect, setReconnect] = useState(false);

    const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

    const clientChatMsg = useRef();
    const chatMsg = useRef();

    useEffect(() => {
        if (!userInfo.isAdmin) {
            setReconnect(false);
            let audio = new Audio('/audio/chat-msg.mp3');

            const socket = socketIOClient();
            socket.on('no admin', (msg) => {
                setChat((chat) => {
                    return [...chat, { admin: 'No admin is currently active' }];
                });
            });

            socket.on('server sends message from admin to client', (msg) => {
                setChat((chat) => {
                    return [...chat, { admin: msg }];
                });
                setMessageReceived(true);
                audio.play();

                const chatMessages = chatMsg.current;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
            setSocket(socket);
            socket.on('admin closed the chat', () => {
                setChat([]);
                setChatConnectionInfo('Admin closed the conversation. Type again to start a conversation.');
                setReconnect(true);
            });

            return () => socket.disconnect();
        }
    }, [userInfo.isAdmin, reconnect]);

    const clientSubmitChatMsg = (e) => {
        e.preventDefault();
        if (e.keyCode && e.keyCode !== 13) {
            return;
        }
        setChatConnectionInfo('');
        setMessageReceived(false);

        let message = clientChatMsg.current.value.trim();

        if (message === '' || message === null || message === false || !message) {
            return;
        }
        socket.emit('client sends message', message);
        setChat((chat) => {
            return [...chat, { client: message }];
        });
        clientChatMsg.current.focus();
        setTimeout(() => {
            clientChatMsg.current.value = '';
            const chatMessages = chatMsg.current;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 200);
    };

    return !userInfo.isAdmin && (
        <>
            <input type="checkbox" id="check" />
            <label className="chat-btn" htmlFor="check">
                <i className="bi bi-chat-dots-fill comment" />
                {messageReceived && <span className="position-absolute top-0 start-50 translate-middle-y border border-light rounded-circle bg-warning notification"></span>}
                <i className="bi bi-x close" />
            </label>
            <div className="chat-wrapper">
                <div className="chat-header">
                    <h6>
                        <i className="bi bi-info-circle me-1" />Support
                    </h6>
                </div>
                <div className="chat-form">
                    <div className="chat-msg" ref={chatMsg}>
                        <p>{chatConnectionInfo}</p>
                        {chat.map((item, id) => (
                            <div key={id}>
                                {item.client && (
                                    <h6 className="ms-5 chat-text">
                                        You<p className="mb-1 mt-2 text-light">{item.client}</p>
                                    </h6>
                                )}
                                {item.admin && (
                                    <h6 className="me-5 chat-text">
                                        Support<p className="mb-1 mt-2 text-light">{item.admin}</p>
                                    </h6>
                                )}
                            </div>
                        ))}
                    </div>
                    <InputGroup>
                        <textarea id="clientChatMsg" className="form-control mt-2" placeholder="Message" onKeyUp={(e) => clientSubmitChatMsg(e)} ref={clientChatMsg} />
                        <span className="mt-2 ms-1">
                            <Button className=" btn-sm mt-3" onClick={(e) => clientSubmitChatMsg(e)}>Send</Button>
                        </span>
                    </InputGroup>
                </div>
            </div>
        </>
    );
};