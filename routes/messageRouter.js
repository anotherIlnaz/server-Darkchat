const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
// add
router.post("/", async (req, res) => {
   const newMessage = new Message(req.body);
   try {
      const sevedMessage = await newMessage.save();
      res.status(200).json(sevedMessage);
   } catch (error) {
      res.status(500).json(error);
   }
});

// get
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
