const User = require("../models/UserModel");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, } = require("./verifyToken");
const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async(req, res) => { // firstly decide whether the token belongs to an admin or client in the middelware
    if (req.body.password) req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD).toString();

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, { $set: req.body, }, { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async(req, res) => { // only admins can get any user
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async(req, res) => {
    const query = req.query.new; // for getting latest 5 users
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async(req, res) => { // total number of users/month
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); // will return last year today

    try {
        const data = await User.aggregate([{ // for grouping multiple docs together
                $match: { // matching all users from last year till this day from the createdAt property
                    createdAt: { $gte: lastYear } // { $match: { status: "urgent" } }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" }, // created the month variable since we want to group users by month ---> $month: "$createdAt" will return the month(as index) in the createdAt property which we'll use in $group
                },
            },
            {
                $group: { // for grouping users by month variable assigned above (it should be unique)
                    _id: "$month", // grouping by what: by month that is created above
                    total: { $sum: 1 }, // adding the total number of users
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;