const router = require("express").Router();
const Conversation = require("../models/Conversation");
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

router.get("/:userId", async (req, res) => {
   try {
      const userId = req.params.userId;

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

module.exports = router;
