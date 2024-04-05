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


[
    {
        $match: {
            employeeId: {
                $in: [
                    "96",
                    "beng",
                    "ben",
                    "ben",
                    "653b62413869e2b6f9bafd5c",
                    "653b62413869e2b6f9bafd5a",
                    "96",
                ],
            },
            activityId: {
                $in: [
                    {
                    },
                    {
                    },
                    {
                    },
                    {
                    },
                ],
            },
            date: {
                $gte: "1-07-2023",
                $lte: "18-11-2024",
            },
        },
    },
    {
        $group: {
            _id: {
                date: "$date",
                employeeName: "$employeeName",
                employeeId: "$employeeId",
                userId: "$userId",
            },
            documents: {
                $push: "$$ROOT",
            },
        },
    },
    {
        $sort: {
            time: 1,
        },
    },
]