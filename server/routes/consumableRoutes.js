const express = require('express')
const router = express.Router()
const consumablesController = require('../controllers/consumablesController')

router.route('/')
    .get(consumablesController.getAllConsumables)
    .post(consumablesController.createNewConsumable)
    .patch(consumablesController.updateConsumable)
    .delete(consumablesController.deleteConsumable)
router.route('/:id')
    .get(consumablesController.getConsumableById)
module.exports = router