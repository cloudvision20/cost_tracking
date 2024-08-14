const express = require('express')
const router = express.Router()
const cashesController = require('../controllers/cashesController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)
router.route('/')
    .get(cashesController.getAllCashes)
    .post(cashesController.createNewCash)
    .patch(cashesController.updateCashes)
    .delete(cashesController.deleteCash)
// router.route('/:id')
//     .get(cashesController.getCashById)
module.exports = router