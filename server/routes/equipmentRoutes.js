const express = require('express')
const router = express.Router()
const equipmentController = require('../controllers/equipmentController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)
router.route('/')
    .get(equipmentController.getAllEquipment)
    .post(equipmentController.createNewEquipment)
    .patch(equipmentController.updateEquipment)
    .delete(equipmentController.deleteEquipment)
// router.route('/:id')
//     .get(equipmentController.getEquipmentById)
module.exports = router