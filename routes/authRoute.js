const router = require("express").Router();
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

//REGISTER
router.post("/register", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        originalPassword != inputPassword && res.status(401).json("Wrong Password");

        const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.SECRET, { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc; // to return all info but the password
        res.status(200).json({...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;