const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// new conv

router.post("/", async (req, res) => {
   const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
   });
   try {
      const sevedConversation = await newConversation.save();
      res.status(200).json(sevedConversation);
   } catch (error) {
      res.status(500).json(error);
   }
});

//  get conv of a user

const prepareConv = async (conv, userId) => {
   const companionId = conv.members.find((id) => id !== userId);

   const lastMessage = await Message.find({ conversationId: conv._id });
   const companionData = await User.findById(companionId);

   return {
      id: conv._id,
      updatedAt: conv.updatedAt,
      companion: {
         username: companionData.username,
         roles: companionData.roles,
         id: companionData._id,
      },
   };
};

router.get("/all", authMiddleware, async (req, res) => {
   try {
      const userId = req.user.id;

      const conversations = await Conversation.find({
         members: {
            $in: [userId],
         },
      });
      const preparedConversations = await Promise.all(
         conversations.map(async (conv) => await prepareConv(conv, userId))
      );
      return res.status(200).json(preparedConversations);
   } catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
});

router.get("/:convId", authMiddleware, async (req, res) => {
   try {
      const convId = req.params.convId;

      const conversation = await Conversation.findById(convId);

      const preparedConversation = await prepareConv(conversation, req.user.id);

      return res.status(200).json(preparedConversation);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
