require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Technician = require('../models/Technician');
const User = require('../models/User');

const indianFirstNames = [
    'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Anika', 'Anya', 'Ayaan', 'Ishaan', 'Dhruv',
    'Rohan', 'Priya', 'Riya', 'Saanvi', 'Sameer', 'Arjun', 'Krishna', 'Sita', 'Gita', 'Ram', 'Lakshman', 'Bharat',
    'Ravi', 'Suresh', 'Mahesh', 'Rajesh', 'Mukesh', 'Amit', 'Sunil', 'Anil', 'Prakash', 'Vikram', 'Aditya'
];

const indianLastNames = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Mehta', 'Joshi', 'Pandey', 'Mishra', 'Trivedi',
    'Reddy', 'Naidu', 'Rao', 'Menon', 'Nair', 'Iyer', 'Iyengar', 'Chopra', 'Kapoor', 'Khan', 'Malhotra', 'Saxena',
    'Agarwal', 'Jain', 'Das', 'Roy', 'Chowdhury', 'Bose'
];

const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna',
    'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
    'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
    'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
    'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Sambalpur'
];

const categories = [
    'Plumber', 'Electrician', 'AC Repair', 'Mobile Repair', 'Carpenter', 'Painter', 'Appliance Repair', 'Car Mechanic'
];

const TOTAL_USERS = 3000;
const TECHNICIAN_RATIO = 0.8; 
const BATCH_SIZE = 500;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const getRandomName = (isValluri = false) => {
    const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
    const lastName = isValluri ? 'Valluri' : indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
    return `${firstName} ${lastName}`;
};

const seedDatabase = async () => {
    await connectDB();

    try {
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Technician.deleteMany({});
        console.log('Data cleared.');

        console.log('Seeding categories...');
        const createdCategories = await Category.insertMany(categories.map(name => ({ name })));
        console.log('Categories seeded.');

        const users = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        console.log('Generating users...');
        for (let i = 0; i < TOTAL_USERS; i++) {
            const isValluri = i < 5; 
            const name = getRandomName(isValluri && (Math.random() < TECHNICIAN_RATIO));
            const role = Math.random() < TECHNICIAN_RATIO ? 'technician' : 'customer';

            users.push({
                name,
                email: faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] }),
                password: hashedPassword,
                role,
            });
        }

        console.log(`Generated ${users.length} users. Inserting in batches...`);
        const createdUsers = [];
        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);
            const inserted = await User.insertMany(batch);
            createdUsers.push(...inserted);
            console.log(`User batch ${i / BATCH_SIZE + 1} inserted.`);
        }

        const technicians = [];
        const customerUsers = createdUsers.filter(u => u.role === 'customer');
        const technicianUsers = createdUsers.filter(u => u.role === 'technician');

        for (const user of technicianUsers) {
            const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
            const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];

            const reviews = [];
            const reviewCount = faker.number.int({ min: 0, max: 15 });
            for (let j = 0; j < reviewCount; j++) {
                const randomCustomer = customerUsers[Math.floor(Math.random() * customerUsers.length)];
                if (randomCustomer) {
                    reviews.push({
                        user: randomCustomer._id,
                        name: randomCustomer.name,
                        rating: faker.number.int({ min: 1, max: 5 }),
                        comment: faker.lorem.paragraph(),
                    });
                }
            }

            technicians.push({
                user: user._id,
                category: randomCategory._id,
                city: randomCity,
                phone: faker.phone.number(),
                description: faker.lorem.sentence({ min: 10, max: 25 }),
                skills: faker.helpers.arrayElements(['Repair', 'Installation', 'Maintenance', 'Troubleshooting'], { min: 2, max: 4 }),
                experience: faker.number.int({ min: 1, max: 20 }),
                availability: faker.helpers.arrayElement(['Mon-Fri', 'Weekends Only', '24/7']),
                reviews: reviews,
            });
        }

        console.log(`Generated ${technicians.length} technicians. Inserting in batches...`);
        for (let i = 0; i < technicians.length; i += BATCH_SIZE) {
            const batch = technicians.slice(i, i + BATCH_SIZE);
            await Technician.insertMany(batch);
            console.log(`Technician batch ${i / BATCH_SIZE + 1} inserted.`);
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDatabase();
