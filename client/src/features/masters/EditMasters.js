import EditMastersConsumable from './EditMastersConsumable'
import EditMastersEquipment from './EditMastersEquipment'
import EditMastersExpense from './EditMastersExpense'

const EditMaster = ({ formType }) => {
    return ((formType === 'Consumables') ?
        <EditMastersConsumable formType={formType} />
        : (formType === 'Equipment') ?
            <EditMastersEquipment formType={formType} />
            : (formType === 'Expenses') ?
                <EditMastersExpense formType={formType} />
                : null
    )
}
export default EditMaster