const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
    try {
        //Tutorial uses req.header('Authorization')
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')

        const user = await User.findOne({_id: decoded._id, 'tokens.token' : token})

        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
    } catch (e) {
        res.status(401).send({error: 'Please Authenticate'})
    }
}

module.exports = auth