import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdByIp: {
        type: String
    },
    revoked: {
        type: Date
    },
    revokedByIp: {
        type: String
    },
    replacedByToken: {
        type: String
    }
});

refreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

refreshTokenSchema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

refreshTokenSchema.index({ token: 1 });

const RefreshToken = model('RefreshToken', refreshTokenSchema);
export default RefreshToken;