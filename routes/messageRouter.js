const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const User = require("../models/User");

const prepareMessages = async (message) => {
   const senderId = message.sender;
   const senderData = await User.findById(senderId);

   return {
      id: message._id,
      text: message.text,
      updatedAt: message.updatedAt,

      sender: {
         id: message._id,
         username: senderData?.username,
      },
   };
};

async function sendMessage(userId, convId, message) {
   const newMessage = new Message({
      text: message,
      sender: userId,
      conversationId: convId,
   });

   try {
      const savedMessage = await newMessage.save();
      const preparedMessage = await prepareMessages(savedMessage);

      return preparedMessage;
   } catch (error) {
      console.log(error);
      throw error;
   }
}

router.post("/", authMiddleware, async (req, res) => {
   try {
      const preparedMessage = await sendMessage(
         req.user.id,
         req.body.convId,
         req.body.text
      );

      res.status(200).json(preparedMessage);
   } catch (error) {
      res.status(500).json(error);
   }
});

router.get("/:conversationId", async (req, res) => {
   try {
      const messages = await Message.find({
         conversationId: req.params.conversationId,
      });

      const preparedMessages = await Promise.all(
         messages.map(async (message) => await prepareMessages(message))
      );

      res.status(200).json(preparedMessages);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = { router, sendMessage };
