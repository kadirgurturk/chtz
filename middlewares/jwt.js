const jwt = require('jsonwebtoken')
const checkAuthenticate = (req, res, next) => {
    var header = req.headers.authorization;
    const token = header && header.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    const secretKey = process.env.KEY

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = {checkAuthenticate}
