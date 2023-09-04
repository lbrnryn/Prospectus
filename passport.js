const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function(passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        const user = await User.findOne({ username: username });
        if (!user) { return done(null, false) }
        const passwordMatched = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatched) { return done(null, false) }
        return done(null, user)
    }))
}

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user)
})