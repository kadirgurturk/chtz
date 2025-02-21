const mongoose = require('mongoose')

const userRoles = {
    User: 'User',
    Admin: 'Admin',
    Expert: 'Expert'
}

const userStatus = {
    EmailConfirmation: 0,
    Active: 1,
    Passive: 2,
    Deleted: 3
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true
        },
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        passwordHash: String,
        status: {
            type: Number,
            enum: userStatus,
            default: userStatus.EmailConfirmation
        },
        roles: {
            type: [String],
            default: userRoles.User
        },
        notificationPermission: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        photoUrl: String,
        slug: String
    }
)

const User = mongoose.model('User', userSchema)

module.exports = { User, userStatus, userRoles }
