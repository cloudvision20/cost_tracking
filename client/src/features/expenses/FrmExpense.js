import { useGetExpensesQuery } from './expensesApiSlice'
import FrmExpenseForm from './FrmExpenseForm'
import useTitle from '../../hooks/useTitle'

const FrmExpense = () => {
    useTitle('Cost Tracking: Expense')
    const {
        data: expenses,
        //isLoading,
        isSuccess,
        isError,
        error
    } = useGetExpensesQuery('expensesList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content
    if (isSuccess) {
        content = <FrmExpenseForm expenses={expenses} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            content = <FrmExpenseForm expenses={expenses} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmExpense