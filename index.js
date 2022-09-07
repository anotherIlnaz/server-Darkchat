const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const conversationRouter = require("./routes/conversationsRouter");
const {
   router: messageRouter,
   sendMessage,
} = require("./routes/messageRouter");
const usersRouter = require("./routes/usersRouter");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();

const { createServer } = require("http");

const httpServer = createServer(app);

const io = require("socket.io")(httpServer, {
   cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
   },
});

let users = [];

const addUser = (userId, socketId) => {
   !users.some((user) => user.userId === userId) &&
      userId &&
      users.push({ userId: userId, socketId: socketId });
};

const removeUser = (socketId) => {
   users = users.filter((user) => {
      return user.socketId !== socketId;
   });
};

const getUser = (userId) => {
   return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
   //  when connect
   console.log(`A user ${socket.id} connected.`);

   // take user id and socket id from client, and after adding filtered user object in users array , send users array back
   socket.on("addUser", (userId) => {
      // console.log(userId);
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      // console.log(users)
   });

   // send and get message
   socket.on("sendMessage", async ({ senderId, receiverId, text, convId }) => {
      const preparedMessage = await sendMessage(senderId, convId, text);

      const receiver = getUser(receiverId);
      const sender = getUser(senderId);

      if (receiver?.socketId) {
         io.to(receiver.socketId).emit("getMessage", preparedMessage);
      }

      if (sender?.socketId) {
         io.to(sender.socketId).emit("getMessage", preparedMessage);
      }
   });

   // when disconnect
   socket.on("disconnect", () => {
      console.log(`User ${socket.id} is disconnected.`);
      removeUser(socket.id);
      io.emit("getUsers", users);
   });
});

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api", authRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", usersRouter);

const start = async () => {
   try {
      await mongoose.connect(
         // "mongodb+srv://qwerty:qwerty123@cluster0.g13vyae.mongodb.net/?retryWrites=true&w=majority"
         "mongodb+srv://Rinasik:qwerty123@data.vd0po.mongodb.net/darkChat?retryWrites=true&w=majority"
      );
      httpServer.listen(PORT, () =>
         console.log(`Server has been started on port ${PORT}`)
      );
   } catch (er) {
      console.log(er);
   }
};

start();
