db.getCollection('consumablejournals').aggregate(
    [
        {
            $match: {
                // activityId: ObjectId('64e0f480ecbaa145475119da'),
                activityId: {
                    // $in: [ObjectId('64e0f3b2ecbaa145475119b6')]
                    $in: [{ '$old': '64e0f480ecbaa145475119da' }]
                },
                dateTime: {
                    $gte: new Date('2023-04-04'),
                    $lte: new Date('2024-04-05')
                }
            }
        },
        {
            $group: {
                _id: {
                    // date: '$dateTime',
                    details: '$details',
                    // employeeId: '$employeeId',
                    // userId: '$userId'
                    // clockType: '$clockType'
                },
                documents: { $push: '$$ROOT' }
            }
        },
        { $sort: { time: 1 } }
    ]
)




