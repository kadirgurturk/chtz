
const jwt = require('jsonwebtoken')
const generateToken = (email, userId) =>{

    const secretKey = process.env.KEY
    const expireTime = process.env.EXPIRETIME

    const payload =  {
        sub : userId,
        email : email
    }

    return jwt.sign(payload, secretKey, {expiresIn: expireTime})

}

module.exports = {generateToken}
