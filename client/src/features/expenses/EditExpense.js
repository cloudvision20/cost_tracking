import { useGetExpensesQuery } from './expensesApiSlice'
import EditExpenseForm from './EditExpenseForm'
import useTitle from '../../hooks/useTitle'

const EditExpense = () => {
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
        content = <EditExpenseForm expenses={expenses} />
        return content
    }
    if (isError) {
        if (error.status == 400) {
            content = <EditExpenseForm expenses={expenses} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default EditExpense