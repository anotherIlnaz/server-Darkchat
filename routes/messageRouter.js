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
         username: senderData.username,
      },
   };
};

router.post("/", authMiddleware, async (req, res) => {
   console.log(req.body);
   const newMessage = new Message({
      ...req.body,
      sender: req.user.id,
      conversationId: req.body.convId,
   });
   console.log(newMessage)
   try {
      const savedMessage = await newMessage.save();
      const preparedMessage = await prepareMessages(savedMessage);

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

module.exports = router;
