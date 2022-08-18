const Router = require("express");
const router = new Router();
const controller = require("../control/authController");
const { check } = require("express-validator");

router.post(
   "/registration",
   [
      check("username", "Имя пользователя не может быть пустым").notEmpty(),
      check("password", "Пароль не меньше 3 и не больше 12").isLength({
         min: 4,
         max: 12,
      }),
   ],
   controller.registration
);
router.post("/login", controller.login);
router.get("/users", controller.getUsers);

module.exports = router;
