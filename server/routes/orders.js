const router = require('express').Router()
const auth   = require('../middleware/auth')
const admin  = require('../middleware/admin')
const {
    create, getMy, getAll, updateStatus
} = require('../controllers/orderController')

router.post('/',              auth,        create)       // создать заказ
router.get('/my',             auth,        getMy)        // мои заказы
router.get('/',               auth, admin, getAll)       // все заказы (admin)
router.patch('/:id/status',   auth, admin, updateStatus) // сменить статус (admin)

module.exports = router