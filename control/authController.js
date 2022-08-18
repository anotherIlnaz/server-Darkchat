const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const generateAccessToken = (id, roles) => {
   const payload = {
      id,
      roles,
   };
   return jwt.sign(payload, secret, { expiresIn: "12h" });
};

class AuthController {
   async registration(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res
               .status(400)
               .json({ message: "Ошибка при регистрации", errors });
         }
         const { username, password } = req.body;
         //  console.log(req.body);
         const candidate = await User.findOne({ username });
         if (candidate) {
            return res
               .status(400)
               .json({ message: "Пользователь с таким именем уже существует" });
         }
         const salt = bcrypt.genSaltSync(7);
         const hashPassword = bcrypt.hashSync(password, salt);
         const userRole = await Role.findOne({ value: "USER" });
         const user = new User({
            username,
            password: hashPassword,
            roles: [userRole.value],
         });
         await user.save();
         return res.json({ message: "Пользователь успешно зарегистрирован" });
      } catch (er) {
         console.log(er);
         res.status(400).json({ message: "Registratiton error" });
      }
   }

   async login(req, res) {
      try {
         const { username, password } = req.body;
         const user = await User.findOne({ username });
         if (!user) {
            return res
               .status(400)
               .json({ message: `Пользователь ${username} не найден ` });
         }
         const isPasswordValid = bcrypt.compareSync(password, user.password);
         if (!isPasswordValid) {
            return res.status(400).json({
               message: `Пользователю ${username} нужно вспомнить пароль хи-хи`,
            });
         }
         const token = generateAccessToken(user._id, user.roles);
         return res.json({ token });
      } catch (er) {
         console.log(er);
         res.status(400).json({ message: "Login error" });
      }
   }

   async getUsers(req, res) {
      try {
         const users = await User.find();
         return res.json(users);
      } catch (er) {
         console.log(er);
         res.status(400).json({ message: "getUsers error" });
      }
   }
}

module.exports = new AuthController();