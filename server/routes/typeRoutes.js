const express = require('express')
const router = express.Router()
const typesController = require('../controllers/typesController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(typesController.getAllTypes)
    .delete(typesController.deleteType)
    .patch(typesController.updateTypes)
router.route('/:category')
    .get(typesController.getTypesByCat)
module.exports = router
