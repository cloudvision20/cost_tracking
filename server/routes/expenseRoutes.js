const express = require('express')
const router = express.Router()
const expensesController = require('../controllers/expensesController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)
router.route('/')
    .get(expensesController.getAllExpenses)
    .post(expensesController.createNewExpense)
    .patch(expensesController.updateExpenses)
    .delete(expensesController.deleteExpense)
// router.route('/:id')
//     .get(expensesController.getExpenseById)
module.exports = router