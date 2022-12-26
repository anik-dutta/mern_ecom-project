// external imports
import { Toast, Button, Form } from "react-bootstrap";
import { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// internal import
import { setMessageReceived } from "../../redux/actions/chatActions";

export default function AdminChatRoomComponent({ chatRoom, roomIndex, socket, socketUser }) {
    const dispatch = useDispatch();

    [window["toast" + roomIndex], window["closeToast" + roomIndex]] = useState(true);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const chatMessages = document.querySelector(`.chat-msg${socketUser}`);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    const close = (socketId) => {
        window["closeToast" + roomIndex](false);
        socket.emit("admin closes chat", socketId);
    };

    const adminSubmitChatMsg = (e, elem) => {
        e.preventDefault();
        if (e.keyCode && e.keyCode !== 13) {
            return;
        }
        const msg = document.getElementById(elem);
        let v = msg.value.trim();
        if (v === "" || v === null || v === false || !v) {
            return;
        }
        chatRoom[1].push({ admin: msg.value });
        socket.emit("admin sends message", {
            user: socketUser,
            message: v,
        });
        setRerender(!rerender);
        msg.focus();
        dispatch(setMessageReceived(false));
        setTimeout(() => {
            msg.value = "";
            const chatMessages = document.querySelector(`.chat-msg${socketUser}`);
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 200);
    };

    return (
        <>
            <Toast show={'toast' + roomIndex} onClose={() => close(chatRoom[0])} className="admin-toast">
                <Toast.Header className="chat-header" closeVariant="white">
                    <strong className="me-auto"></strong>
                </Toast.Header>
                <Toast.Body>
                    <div className={`chat-msg${socketUser}`} style={{ maxHeight: "300px", overflow: "auto" }}>
                        {chatRoom[1].map((msg, idx) => (
                            <Fragment key={idx}>
                                {msg.client && (
                                    <h6 className="me-5 chat-text" key={idx}>
                                        User<p className="mb-1 mt-2 text-light">{msg.client}</p>
                                    </h6>
                                )}
                                {msg.admin && (
                                    <h6 className="ms-5 chat-text">
                                        You<p className="mb-1 mt-2 text-light">{msg.admin}</p>
                                    </h6>
                                )}
                            </Fragment>
                        ))}
                    </div>
                    <Form>
                        <Form.Group
                            className="mb-3" controlId={`adminChatMsg${roomIndex}`}>
                            <Form.Control onKeyUp={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} className="mt-3" as="textarea" rows={2} placeholder="Message" />
                        </Form.Group>
                        <Button onClick={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} className="admin-chat-send" type="submit">Send</Button>
                    </Form>
                </Toast.Body>
            </Toast>
        </>
    );
};