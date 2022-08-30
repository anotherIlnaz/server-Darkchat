const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
   if (req.method=== "OPTIONS") {
      next();
   }
   try {
      // console.log(req.headers.authorization);
      // console.log(req.headers);

      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
         return res
            .status(403)
            .json({ message: "Пользователь не авторизован1" });
      }

      const decodedData = jwt.verify(token, secret);
      req.user = decodedData;
      next();
   } catch (er) {
      console.log(er);
      return res.status(403).json({ message: "Пользователь не авторизован2" });
   }
};
