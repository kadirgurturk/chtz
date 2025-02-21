
const asyncHandler = require('express-async-handler')


const sayHello = asyncHandler( async (req, res) => {

    const val = req.query.value

    res.send("Hello chtz tis s yours value = " + val);
})

module.exports = { sayHello }
