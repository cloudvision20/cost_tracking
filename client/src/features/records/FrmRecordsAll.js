import FrmRecordsConsumable from './FrmRecordsAllConsumable'
import FrmRecordsEquipment from './FrmRecordsAllEquipment'
import FrmRecordsExpense from './FrmRecordsAllExpense'

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