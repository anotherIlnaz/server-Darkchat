const router = require("express").Router();
const User = require("../models/User");
const authMiddleware = require("..//middleware/authMiddleware");

router.get("/", async (req, res) => {
   try {
      const userId = req.query.userId;
      const user = await User.findById(userId);
      return res
         .status(200)
         .json({ id: user._id, role: user.roles, username: user.username });
   } catch (er) {
      console.log(er);
      res.status(400).json({ message: "getUser error 1" });
   }
});

module.exports = router;
