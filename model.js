/*
 * @Author: Latte
 * @Date: 2021-09-29 00:27:01
 * @LAstEditors: Latte
 * @LastEditTime: 2021-09-29 01:03:23
 * @FilePath: \express-auth\model.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.connect("mongodb://localhost:27017/express-auth", {
	useNewUrlParser: true,
});

const UserScheme = new mongoose.Schema({
	username: { type: String, unique: true },
	password: {
		type: String,
		set(val) {
			return bcrypt.hashSync(val, 4);
		},
	},
});
const User = mongoose.model("User", UserScheme);

module.exports = { User };
