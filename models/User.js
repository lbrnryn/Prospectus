const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema({
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    idNumber: { type: String, uppercase: true },
    role: { type: String },
    course: { type: String },
    campus: { type: String },
    username: { type: String, lowercase: true },
    password: { type: String, lowercase: true },
    hashedPassword: { type: String },
}, { timestamps: true });

user.pre("save", async function() {
    this.username = this.firstname.match(/\s/g) ? this.firstname.replace(/\s/g, ""): this.firstname;
    this.password = this.lastname.match(/\s/g) ? this.lastname.replace(/\s/g, ""): this.lastname;
    const salt = await bcrypt.genSalt(10);
    this.hashedPassword = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model("User", user);