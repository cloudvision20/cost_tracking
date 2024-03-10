import FrmRecordsConsumable from './FrmRecordsConsumable'
import FrmRecordsEquipment from './FrmRecordsEquipment'
import FrmRecordsExpense from './FrmRecordsExpense'

const FrmRecords = ({ formType }) => {
    return ((formType === 'Consumables') ?
        <FrmRecordsConsumable formType={formType} />
        : (formType === 'Equipment') ?
            <FrmRecordsEquipment formType={formType} />
            : (formType === 'Expenses') ?
                <FrmRecordsExpense formType={formType} />
                : null
    )
}
export default FrmRecords