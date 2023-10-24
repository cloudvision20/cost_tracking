const express = require('express')
const router = express.Router()
const mastersController = require('../controllers/mastersController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .patch(mastersController.updateMasters)
    .delete(mastersController.deleteMaster)
router.route('/:type')
    .get(mastersController.getAllMastersByType)
    .post(mastersController.NewMasterByType)
router.route('/:type/:id')
//     .get(mastersController.getMasterById)
module.exports = router