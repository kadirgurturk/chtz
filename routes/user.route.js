const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const validate = require('../middlewares/validate')
const userValidation = require('../utilis/validation/user.validation')


router.post("/createUser", userController.createUser)

router.post("/login", validate(userValidation.loginValidation), userController.login)

router.post("/register", validate(userValidation.registerValidation), userController.register)

router.get("/getUserInformation", userController.getUserInformation)

router.get("/getUserHeader", userController.getUserHeader)

router.post("/updateLastSeen", userController.updateLastSeen)

router.get("/getUserHeader", userController.getUserHeader)

module.exports = router
