

db.getCollection('activities').aggregate(

    [
        // {
        //     $match: {
        //         _id: ObjectId("654b195f6c9c492b04def7e7")
        //         // dateTime: {
        //         //     $gte: sDate,
        //         //     $lte: eDate
        //         // }
        //     }
        // },
        // {
        //     $match:
        //     {
        //         _id: ObjectId("64e0f3b2ecbaa145475119b6"),
        //     }
        // },

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
    ]
)