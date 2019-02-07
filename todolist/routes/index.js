const Router = require('koa-router')

const router = new Router()

require('./auth')

router.use(require('./users'))
router.use('/todos', require('./todos'))

module.exports = router.routes()