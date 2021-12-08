const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET, (err, decodedData) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = decodedData;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) { // allow the user to only update their personal info or if it's the admin
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) { // only admins have the privilege to alter orders & products
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};