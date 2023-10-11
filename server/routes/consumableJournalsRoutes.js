const express = require('express')
const router = express.Router()
const consumableJournalsController = require('../controllers/consumableJournalsController')

router.route('/')
    .get(consumableJournalsController.getAllConsumableJournals)
    .post(consumableJournalsController.createNewConsumableJournal)
    .patch(consumableJournalsController.updateConsumableJournal)
    .delete(consumableJournalsController.deleteConsumableJournal)
router.route('/:id')
    .get(consumableJournalsController.getConsumableJournalById)
module.exports = router