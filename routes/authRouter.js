const Router = require("express");
const router = new Router();
const controller = require("../controller/authController");
const { check } = require("express-validator");
const roleMiddleware = require("..//middleware/roleMiddleware");
const authMiddleware = require("..//middleware/authMiddleware");

router.post(
   "/registration",
   [
      check("username", "Имя пользователя не может быть пустым").notEmpty(),
      check("password", "Пароль не меньше 4 и не больше 12").isLength({
         min: 4,
         max: 12,
      }),
   ],
   controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["USER", "ADMIN"]), controller.getUsers);

router.get("/user/me", authMiddleware, controller.getUserMe);

module.exports = router;
