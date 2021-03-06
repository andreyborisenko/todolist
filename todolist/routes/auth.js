const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { JWT_SECRET: jwtsecret = "mysecretkey" } = process.env

const User = require('./users/user')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (email, password, done) {
    User.findOne({
      email
    }, (err, user) => {
      if (err) {
        return done(err)
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, {
          message: 'User does not exist or wrong password.'
        })
      }
      return done(null, user)
    })
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: jwtsecret
}

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload.id, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
}))