const { Schema, model, default: mongoose } = require("mongoose");

const Role = new Schema({
   value: { type: String, unique: true, default: "USER" },
});

module.exports = mongoose.model("Role", Role);
