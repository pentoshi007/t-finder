const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Technician = require('./models/Technician');
const Category = require('./models/Category');
const Review = require('./models/Review');
const Appointment = require('./models/Appointment');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8')
);
const techniciansData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/technicians_large.json`, 'utf-8')
);
const regularUsersData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users_regular.json`, 'utf-8')
);

const BATCH_SIZE = 500;

const reviewComments = [
  { title: 'Excellent Service!', text: 'Very professional and fixed the issue quickly. Highly recommended.' },
  { title: 'Good Work', text: 'Did a good job, was on time and courteous.' },
  { title: 'Could Be Better', text: 'The job was done, but it took longer than expected.' },
  { title: 'Not Satisfied', text: 'Had to call them back to fix the same issue again. Not happy with the service.' },
  { title: 'Absolutely Fantastic!', text: 'Went above and beyond. I will definitely be using their services again.' },
];

// Import into DB
const importData = async () => {
  try {
    // 1. Import Categories
    const createdCategories = await Category.create(categories);
    console.log('Categories Imported...');

    // 2. Import Regular Users
    const createdRegularUsers = await User.create(regularUsersData);
    console.log('Regular Users Imported...');

    // 3. Batch import Technicians and their associated User accounts
    let createdTechnicians = [];
    for (let i = 0; i < techniciansData.length; i += BATCH_SIZE) {
      const batch = techniciansData.slice(i, i + BATCH_SIZE);
      console.log(`Processing technician batch ${i / BATCH_SIZE + 1}...`);

      const techUsersToCreate = batch.map(t => ({
        name: t.name,
        email: t.email,
        password: t.password,
        role: 'technician',
      }));

      const createdTechUsers = await User.insertMany(techUsersToCreate);

      const techniciansToCreate = batch.map((t, index) => {
        const user = createdTechUsers[index];
        const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        return {
          user: user._id,
          category: randomCategory._id,
          location: t.location,
          phone: t.phone,
          skills: [t.skills],
          experience: t.experience,
          hourlyRate: t.hourlyRate,
          bio: t.bio,
        };
      });

      const newTechnicians = await Technician.insertMany(techniciansToCreate);
      createdTechnicians = createdTechnicians.concat(newTechnicians);
      console.log(`${newTechnicians.length} technicians created in this batch.`);
    }

    // 4. Generate and import reviews
    const reviewsToCreate = [];
    createdTechnicians.forEach(technician => {
      const reviewCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 reviews
      for (let i = 0; i < reviewCount; i++) {
        const randomReviewer = createdRegularUsers[Math.floor(Math.random() * createdRegularUsers.length)];
        const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        reviewsToCreate.push({
          comment: `${randomComment.title} - ${randomComment.text}`,
          rating: Math.floor(Math.random() * 5) + 1, // 1 to 5 stars
          user: randomReviewer._id,
          technician: technician._id,
        });
      }
    });

    await Review.create(reviewsToCreate);
    console.log(`${reviewsToCreate.length} reviews created.`);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Technician.deleteMany();
    await Review.deleteMany();
    // We are not seeding appointments yet, but good to have it here.
    // await Appointment.deleteMany(); 

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
