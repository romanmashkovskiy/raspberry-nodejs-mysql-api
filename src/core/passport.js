import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import models from '../models';
import env from '../config/env';
import {validateHash} from '../utils/hash';

const {User} = models;

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({where: {email: email}});

            if (!user || !await validateHash(password, user.password)) {
                return done(null, false, {message: 'Invalid email or password'});
            }

            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: env.JWT_SECRET
    },
    async (payload, done) => {
        try {
            const user = await User.findOne({
                where: {
                    id: payload.id,
                    email: payload.email
                }
            });

            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }
));

export default passport;

