const express = require('express')
const router = express.Router()
const consumablesController = require('../controllers/consumablesController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)
router.route('/')
    .get(consumablesController.getAllConsumables)
    .post(consumablesController.createNewConsumable)
    .patch(consumablesController.updateConsumable)
    .delete(consumablesController.deleteConsumable)
// router.route('/:id')
//     .get(consumablesController.getConsumableById)
module.exports = router