const mongoose = require('mongoose')

const MasterSchema = new mongoose.Schema({

    uom: [{ type: String }],
    costType: [{ type: String }],
    resourceType: [{ type: String }],
    equipmentType: [{ type: String }],
    consumableType: [{ type: String }],
})

module.exports = mongoose.model('Master', MastersSchema)