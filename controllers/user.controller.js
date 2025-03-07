const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler')
require('express-async-handler')
const httpStatus = require('http-status')
const userHelper = require('../helper/user.helper')
const ErrorResponse = require('../utilis/errorResponse')
const {User, userRoles} = require("../entities/user.model");


const createUser = asyncHandler(async (req, res) => {
  const { firstName, surname, email, password } = req.body;

    const saltRound = process.env.SALT_ROUNDS

    const hashPassword = async (password) => {
        const salt = await bcrypt.genSalt(saltRound);
        return await bcrypt.hash(password, salt);
    };

    const hashedPassword = await bcrypt.hash(password, hashPassword);

  const newUser = new User({
      email : email,
      firstName : firstName,
      surname : surname,
      passwordHash : hashedPassword,
      roles : [userRoles.User],
      createdAt : Date.now(),
      notificationPermission : true,
      photo : "aaa",
  },)

    await User.create(newUser);

    return res.status(httpStatus.OK).end()
})


const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, surname, email, password } = req.body;

    const isEmailExist = await User.exists({email: email}).exec()

    if (isEmailExist != null){
        throw new ErrorResponse(httpStatus.BAD_REQUEST, 'This email is already exist', 'This email is already exist')
    }

    const saltRound = process.env.SALT_ROUNDS

    const hashPassword = async (password) => {
        const salt = await bcrypt.genSalt(saltRound);
        return await bcrypt.hash(password, salt);
    };

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
        email : email,
        firstName : firstName,
        lsatName: lastName,
        surname : surname,
        roles : [userRoles.User],
        createdAt : Date.now(),
        passwordHash : hashedPassword,
        notificationPermission : true,
        photo : "aaa",
    },)

    await User.create(newUser);

    return res.send(httpStatus.OK).end()
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email: email}).exec()

    if (user == null){
        throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Email doesnt exist', 'Email doesnt exist')
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if(match) {
        let token = userHelper.generateToken(user.email, user._id)
        var let = "dasdas"
        return res.status(200).json({ token: token})
    }

    throw new ErrorResponse(httpStatus.UNAUTHORIZED, 'User not Found', 'Wrong Password')

})


module.exports = {createUser, register, login}
