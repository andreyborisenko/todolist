const router = require('koa-router')()
const jwt = require('jsonwebtoken') // auth via JWT for hhtp
const passport = require('koa-passport')

const { JWT_SECRET: jwtsecret = "mysecretkey" } = process.env 

const User = require('./user')

router.post('/register', async (ctx, next) => {
  try {
    const user = await User.create(ctx.request.body)
    ctx.body = user
  } catch (err) {
    ctx.status = 400
    if (err.code == 11000) {
      ctx.body = 'User already exists'
    } else {
      ctx.body = err
    }
  }
})

// local auth route. Creates JWT is successful

router.post('/login', async (ctx, next) => {
  await passport.authenticate('local', function (err, user) {
    if (user == false) {
      ctx.status = 401
      ctx.body = "Login failed"
    } else {
      const payload = {
        id: user.id,
        email: user.email
      }
      const token = jwt.sign(payload, jwtsecret) 

      ctx.body = {
        user: {
          email: user.email
        },
        token: 'JWT ' + token
      }
    }
  })(ctx, next)

})

router.get('/me', async (ctx, next) => {
  await passport.authenticate('jwt', async (err, user) => {
    if(err) {
      ctx.throw(500, 'Internal server error')
    }
    if (!user) {
      ctx.throw(401, 'Unautorized request')
    } else {
      ctx.status = 200
      ctx.body = {
        email: user.email
      }
    }
  })(ctx, next)
})

module.exports = router.routes()