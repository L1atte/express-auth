/*
 * @Author: Latte
 * @Date: 2021-09-28 23:43:08
 * @LAstEditors: Latte
 * @LastEditTime: 2021-09-29 01:50:17
 * @FilePath: \express-auth\server.js
 */
const { User } = require("./model");
const express = require("express");
const jwt = require("jsonwebtoken");

// secretOrPrivateKey(密钥)
const SECRET = "key";

const app = express();
// 处理json格式
app.use(express.json());

app.get("/api/users", async (req, res) => {
	const users = await User.find();
	res.send(users);
});

app.post("/api/register", async (req, res) => {
	const user = await User.create({
		username: req.body.username,
		password: req.body.password,
	});
	res.send(user);
});

app.post("/api/login", async (req, res) => {
	const user = await User.findOne({
		username: req.body.username,
	});
	if (!user) {
		return res.status(422).send({
			message: "用户名不存在",
		});
	}
	const isPasswordValid = require("bcryptjs").compareSync(
		req.body.password,
		user.password
	);
	if (!isPasswordValid) {
		return res.status(422).send({
			message: "密码无效",
		});
	}
	// 生成token
	const token = jwt.sign(
		{
			id: String(user._id),
		},
		SECRET
	);
	res.send({
		user,
		token: token,
	});
});

// 定义中间件auth, next()表示执行后续中间件
const auth = async(req, res, next) => {
  const raw = String(req.headers.authorization).split(" ").pop();
	const { id } = jwt.verify(raw, SECRET);
	req.user = await User.findById(id);
  next()
}

app.get("/api/profile", auth, async (req, res) => {
	res.send(req.user);
});

app.listen(3000, () => {
	console.log("listen");
});
