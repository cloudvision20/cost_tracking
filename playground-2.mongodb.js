// db.getCollection('consumablejournals').aggregate(
//     [
//         {
//             $match: {
//                 // activityId: ObjectId('64e0f480ecbaa145475119da'),
//                 activityId: {
//                     $in: [ObjectId('64e0f3b2ecbaa145475119b6'), ObjectId('64e0f480ecbaa145475119da')]
//                     // $in: [{ '$old': '64e0f480ecbaa145475119da' }]
//                 },
//                 dateTime: {
//                     $gte: new Date('2023-04-04'),
//                     $lte: new Date('2024-04-05')
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: {
//                     // date: '$dateTime',
//                     details: '$details',
//                     // employeeId: '$employeeId',
//                     // userId: '$userId'
//                     // clockType: '$clockType'
//                 },
//                 documents: { $push: '$$ROOT' }
//             }
//         },
//         { $sort: { time: 1 } }
//     ]
// )



db.getCollection('activities').aggregate(
    [
        {
            $match: {
                projectId: ObjectId('64d0af27d0322e0e4780c2bb'),
            }
        },

        {
            $group: {
                _id: '$projectId',
                projects: { $push: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'projects',
                localField: '_id',
                foreignField: '_id',
                as: 'project'
            }
        },
        { $unwind: '$project' },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        '$project',
                        { activities: '$projects' }
                    ]
                }
            }
        },
        {
            $sort: {
                projectId: 1,
                startDate: 1,
            },
        },
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
);