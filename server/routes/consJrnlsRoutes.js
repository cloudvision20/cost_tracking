const express = require('express')
const router = express.Router()
const consJrnlsController = require('../controllers/consJrnlsController')

router.route('/')
    .get(consJrnlsController.getAllConsJrnls)
    .post(consJrnlsController.createNewConsJrnl)
    .patch(consJrnlsController.updateConsJrnl)
    .delete(consJrnlsController.deleteConsJrnl)
router.route('/:id')
    .get(consJrnlsController.getConsJrnlById)
module.exports = router