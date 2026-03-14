const router = require('express').Router()
const auth   = require('../middleware/auth')
const admin  = require('../middleware/admin')
const { getPage, upsertPage } = require('../controllers/pageController')

router.get('/:slug',          getPage)
router.put('/:slug', auth, admin, upsertPage)

module.exports = router