const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text:String,
  completed: { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  tasks: [TaskSchema]

});


const User = mongoose.model("User", UserSchema);

module.exports = User;
