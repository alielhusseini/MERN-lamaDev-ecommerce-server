const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

module.exports = model("UserecoSchema", UserSchema);