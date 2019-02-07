const router = require('koa-router')()
const passport = require('koa-passport')

const Todo = require('./todo')

router.use(async (ctx, next) => {
  await passport.authenticate('jwt', async (err, user) => {
    if(err) {
      ctx.throw(500, 'Internal server error')
    }
    if (!user) {
      ctx.throw(401, 'Unautorized request')
    } else {
      ctx.user = user
      await next()
    }
  })(ctx, next)
})

const todosDefaultPageLimit = 10

router.get('/', async ctx => {
  const limit = Math.max(1, parseInt(ctx.query.limit) || todosDefaultPageLimit)
  const page = Math.max(0, parseInt(ctx.query.page || 1) - 1)
  let skip = page * limit

  const estimatedTodosCount = await Todo.estimatedDocumentCount()

  if (skip > estimatedTodosCount) {
    skip = Math.floor(estimatedTodosCount / limit) * limit
  }

  const todos = await Todo.find({
    _ownerId: ctx.user._id
  }, 'title isDone', { 
    skip,
    limit 
  }).sort({ createdAt: -1 })

  ctx.status = 200
  ctx.body = {
    todos: todos.sort((a, b) => a.createdAt),
    hasPrevPage: skip > 0 && todos.length > 0,
    hasNextPage: todos.length == limit && estimatedTodosCount > skip + todos.length
  }
})

router.post('/', async ctx => {
  try {
    const todo = await Todo.create({
      ...ctx.request.body,
      _ownerId: ctx.user._id
    })

    ctx.status = 200
    ctx.body = todo
  } catch(err) {
    ctx.status = 500
    ctx.body = err
  }
})

router.get('/:id', async ctx => {
  const { id } = ctx.params

  const todo = await Todo.find({
    _id: id,
    _ownerId: ctx.user.id 
  })

  if (todo) {
    ctx.status = 200
    ctx.body = todo
  } else {
    ctx.status = 404
    ctx.body = `Not found todo with id ${id}`
  }
})

router.delete('/:id', async ctx => {
  const { id } = ctx.params

  const todo = await Todo.findOneAndDelete({
    _id: id,
    _ownerId: ctx.user.id 
  })

  if (todo) {
    ctx.status = 200
    ctx.body = todo
  } else {
    ctx.status = 404
    ctx.body = `Not found todo with id ${id}`
  }
})

router.put('/:id', async ctx => {
  const { id } = ctx.params

  const todo = await Todo.findOneAndUpdate({
    _id: id,
    _ownerId: ctx.user.id 
  }, ctx.request.body, { new: true })

  if (todo) {
    ctx.status = 200
    ctx.body = todo
  } else {
    ctx.status = 404
    ctx.body = `Not found todo with id ${id}`
  }
})

module.exports = router.routes()