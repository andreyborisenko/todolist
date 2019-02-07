require('dotenv').config()

const Koa = require('koa') 
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser') 
const serve = require('koa-static')
const cors = require('koa-cors')

const passport = require('koa-passport')
const mongoose = require('./db')

const app = new Koa()

// HOT-FIX for local development
app.use(cors({
  methods: ['GET', 'PUT', 'POST', 'DELETE']
}))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err
    ctx.app.emit('error', err, ctx)
  }
})

app.use(serve('public'))
app.use(bodyParser())

app.use(passport.initialize()) 
app.use(require('./routes'))

app.use(ctx => {
  // The next line will help us if we have our frontend part built and we`re able to place it to the static folder 
  ctx.redirect('/index.html')
})


const { PORT: port = 3000 } = process.env
app.listen(port, () => console.log(`http://localhost:${port}`))