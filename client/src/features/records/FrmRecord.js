import FrmRecordConsumable from './FrmRecordConsumable'
import FrmRecordEquipment from './FrmRecordEquipment'
import FrmRecordExpense from './FrmRecordExpense'

const FrmRecord = ({ formType }) => {
    return ((formType === 'Consumables') ?
        <FrmRecordConsumable formType={formType} />
        : (formType === 'Equipment') ?
            <FrmRecordEquipment formType={formType} />
            : (formType === 'Expenses') ?
                <FrmRecordExpense formType={formType} />
                : null
    )
}
export default FrmRecord