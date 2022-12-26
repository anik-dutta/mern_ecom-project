// external imports
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');

// internal imports
const apiRoutes = require('./routes/apiRoutes');
const connectDB = require('./config/db');

// starting app
const app = express();

// use helmet as middleware
app.use(helmet());

// create server instance
const httpServer = createServer(app);
global.io = new Server(httpServer);

// database connection
connectDB();

// using parser, cookieParser, fileUpload
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

let admins = [];
let activeChats = [];

function get_random(array) {
    return array[Math.floor(Math.random() * array.length)];
}

io.on("connection", (socket) => {
    socket.on("admin connected with server", (adminName) => {
        admins.push({ id: socket.id, admin: adminName });
    });
    socket.on("client sends message", (msg) => {
        if (admins.length === 0) {
            socket.emit("no admin", "");
        } else {
            let client = activeChats.find((client) => client.clientId === socket.id);
            let targetAdminId;
            if (client) {
                targetAdminId = client.adminId;
            } else {
                let admin = get_random(admins);
                activeChats.push({ clientId: socket.id, adminId: admin.id });
                targetAdminId = admin.id;
            }
            socket.broadcast.to(targetAdminId).emit("server sends message from client to admin", {
                user: socket.id,
                message: msg,
            });
        }
    });

    socket.on("admin sends message", ({ user, message }) => {
        socket.broadcast.to(user).emit("server sends message from admin to client", message);
    });

    socket.on('admin closes chat', (socketId) => {
        socket.broadcast.to(socketId).emit('admin closed the chat', '');
        let c = io.sockets.sockets.get(socketId);
        c.disconnect();
    });

    socket.on("disconnect", (reason) => {
        // admin disconnected
        const removeIndex = admins.findIndex((item) => item.id === socket.id);
        if (removeIndex !== -1) {
            admins.splice(removeIndex, 1);
        }
        activeChats = activeChats.filter((item) => item.adminId !== socket.id);

        // client disconnected
        const removeIndexClient = activeChats.findIndex((item) => item.clientId === socket.id);
        if (removeIndexClient !== -1) {
            activeChats.splice(removeIndexClient, 1);
        }
        socket.broadcast.emit("disconnected", { reason: reason, socketId: socket.id });
    });
});

// routes
app.get('/', async (req, res, next) => {
    res.json({ message: 'API is running...' });
});

// loading routers on sub app
app.use('/api', apiRoutes);

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error);
    }
    next(error);
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    } else {
        res.status(500).json({ message: error.message });
    }
});

// port setup
const PORT = process.env.PORT || 5000;

// run server on port
httpServer.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
});