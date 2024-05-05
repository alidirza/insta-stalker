const { model, Schema } = require("mongoose");

module.exports = model("model", new Schema({
    username: { type: String, required: true },
    full_name: { type: String, required: true },
    biography: { type: String, required: true },
    following: { type: Number, required: true },
    followers: { type: Number, required: true },
    profile_pic: { type: String, required: true }
}));