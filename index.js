const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const conversationRouter = require("./routes/conversationsRouter");
const messageRouter = require("./routes/messageRouter");
const usersRouter = require("./routes/usersRouter");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();

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
      app.listen(PORT, () =>
         console.log(`Server has been started on port ${PORT}`)
      );
   } catch (er) {
      console.log(er);
   }
};

start();
