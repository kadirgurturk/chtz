const express = require('express')
const router = express.Router()
const welcomeController = require('../../controllers/welcome/welcome.controller')


router.get('/sayHello', welcomeController.sayHello)

module.exports = router


