const passport = require("passport");
const User = require("../model/user");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'PtlPmGm2Fos02SXwCkPv87ybGlZTe3ti',
}

// middleware to authenticate user using passport jwt strategy
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        const user = await User.findOne({email: jwt_payload.email});
        if(user) {
            return done(null, user);
        }else {
            return done(null, false);
            // user create in database 
        }
    }catch(error){
        console.log("Error", error);
        return done(error, false);
    }
}));