db.getCollection('attendances').aggregate(
    [
        {
            $group: {
                _id: { employeeId: '$employeeId' },
                documents: { $push: '$$ROOT' }
            }
        },
        {
            $group: {
                _id: '$documents.date',
                dates: {
                    $push: {
                        employeeId: { $each: $documents.employeeId }
                    }
                }
            }
        },
        {
            $unwind: '$dates'
        }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
    // { $push: { < field >: { $each: [<value1>, <value2> ... ] } } }
);