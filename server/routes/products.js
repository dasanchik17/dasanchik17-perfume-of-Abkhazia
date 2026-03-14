const router  = require('express').Router()
const auth    = require('../middleware/auth')
const admin   = require('../middleware/admin')
const {
    getAll, getOne, create, update, remove
} = require('../controllers/productController')

router.get('/',     getAll)           // публичный
router.get('/:id',  getOne)           // публичный
router.post('/',    auth, admin, create)   // только admin
router.put('/:id',  auth, admin, update)   // только admin
router.delete('/:id', auth, admin, remove) // только admin

module.exports = router