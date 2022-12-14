// get gender specific based on state
[
  {
    $match: {
      gender: "female",
    },
  },
  {
    $group: {
      _id: {
        state: "$location.state",
      },
      totalPersons: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      totalPersons: -1,
    },
  },
];

// Project operator select fields and transform full name
[
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      birthdate: {
        $toDate: "$dob.date",
      },
      age: "$dob.age",
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onNull: 0.0,
              onError: 0.0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onNull: 0.0,
              onError: 0.0,
            },
          },
        ],
      },
    },
  },
  {
    $project: {
      _id: 0,
      gender: 1,
      email: 1,
      location: 1,
      birthdate: 1,
      age: 1,
      fullName: {
        $concat: [
          {
            $toUpper: {
              $substrCP: ["$name.first", 0, 1],
            },
          },
          {
            $substrCP: [
              "$name.first",
              1,
              {
                $subtract: [
                  {
                    $strLenCP: "$name.first",
                  },
                  1,
                ],
              },
            ],
          },
          " ",
          {
            $toUpper: {
              $substrCP: ["$name.last", 0, 1],
            },
          },
          {
            $substrCP: [
              "$name.last",
              1,
              {
                $subtract: [
                  {
                    $strLenCP: "$name.last",
                  },
                  1,
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    $group: {
      _id: {
        birthYear: {
          $isoWeekYear: "$birthdate",
        },
      },
      numPersons: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      numPersons: -1,
    },
  },
];

// get hobbies by age group and push array in array
[
  {
    $unwind: {
      path: "$hobbies",
    },
  },
  {
    $group: {
      _id: {
        age: "$age",
      },
      allHobbies: {
        $addToSet: "$hobbies",
      },
    },
  },
];
