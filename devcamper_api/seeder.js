const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/BootcampModel");
const Course = require("./models/CourseModel");
const User = require("./models/UserModel");
const Review = require("./models/ReviewModel");

const dbConnect = (async function () {
  try {
    await mongoose.connect(process.env.DB_STRING);
    console.log("########## Database Connected ##########");
  } catch (error) {
    console.log(" Database Error ", error);
  }
})();

const bootcamp = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const course = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const user = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const review = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    // await Bootcamp.create(bootcamp);
    // await Course.create(course);
    // await User.create(user);
    // await Review.create(review);

    await Promise.all(
      [Bootcamp.create(bootcamp), Course.create(course)],
      User.create(user),
      Review.create(review)
    );

    console.log("Data Imported...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    // await Bootcamp.deleteMany();
    // await Course.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();

    await Promise.all([
      Bootcamp.deleteMany(),
      Course.deleteMany(),
      User.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log("Data Destroyed...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// COMMAND LINE ARGUMENTS
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
