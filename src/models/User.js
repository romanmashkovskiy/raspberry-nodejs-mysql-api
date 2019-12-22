import jwt from 'jsonwebtoken';
import env from '../config/env';
import { pick } from 'lodash';
import { generateHash } from '../utils/hash';
import sendEmail from '../utils/email';

export default (sequelize, DateTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DateTypes.UUID,
            defaultValue: DateTypes.UUIDV4,
            primaryKey: true
        },
        userName: {
            type: DateTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DateTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true,
                trim: true
            }
        },
        password: {
            type: DateTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                trim: true
            }
        },
        resetPasswordCode: {
            type: DateTypes.STRING,
            defaultValue: null
        },
        confirmEmailCode: {
            type: DateTypes.STRING,
            defaultValue: null
        },
        isConfirmed: {
            type: DateTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        underscored: true,
        timestamps: true,
    });

    User.prototype.getTokenData = function () {
        return pick(this.dataValues, ['id', 'email']);
    };

    User.prototype.getToken = function () {
        return jwt.sign(this.getTokenData(), env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    };

    User.prototype.verifyResetPasswordCode = function (code) {
        return code.length === 4 && this.resetPasswordCode === code;
    };

    User.prototype.verifyConfirmEmailCode = function (code) {
        return code.length === 4 && this.confirmEmailCode === code;
    };

    User.prototype.sendResetPasswordCode = async function () {
        this.resetPasswordCode = Math.random().toString(36).substring(2, 6);
        const subject = 'Reset password';
        if (env.DEBUG === 'true') {
            console.log(
                this.email,
                subject,
                `Reset password code is: ${ this.resetPasswordCode }`
            );
        } else {
            await sendEmail(
                this.email,
                subject,
                `Reset password code is: ${ this.resetPasswordCode }`
            );
        }
        await this.save();
    };

    User.prototype.sendConfirmEmailCode = async function () {
        this.confirmEmailCode = Math.random().toString(36).substring(2, 6);
        const subject = 'Confirm email';
        if (env.DEBUG === 'true') {
            console.log(
                this.email,
                subject,
                `Verification code is: ${ this.confirmEmailCode }`
            );
        } else {
            await sendEmail(
                this.email,
                subject,
                `Verification code is: ${ this.confirmEmailCode }`
            );
        }
        await this.save();
    };

    User.findByEmail = function (email) {
        return this.findOne({ where: { email } });
    };

    User.prototype.toJSON = function () {
        const data = this.dataValues;
        delete data.password;
        delete data.resetPasswordCode;
        delete data.confirmEmailCode;
        delete data.createdAt;
        delete data.updatedAt;
        return data;
    };

    User.beforeCreate(async (user) => {
        user.setDataValue('password', await generateHash(user.password));
        user.confirmEmailCode = Math.random().toString(36).substring(2, 6);
        user.isConfirmed = false;
    });

    User.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            user.setDataValue('password', await generateHash(user.password));
        }
    });

    User.afterCreate(async (user) => {
        const subject = 'Confirm email';
        if (env.DEBUG === 'true') {
            console.log(
                user.email,
                subject,
                `Verification code is: ${ user.confirmEmailCode }`
            );
        } else {
            await sendEmail(
                user.email,
                subject,
                `Verification code is: ${ user.confirmEmailCode }`
            );
        }
    });

    return User;
};