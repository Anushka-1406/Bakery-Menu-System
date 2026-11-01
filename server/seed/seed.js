require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Admin = require('../models/Admin');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const ChatbotQuestion = require('../models/ChatbotQuestion');

const { categories, itemsByCategory, chatbotQuestions } = require('./seedData');

const DEFAULT_ADMIN = {
  name: 'Bakery Admin',
  email: 'admin@bakery.com',
  password: 'admin123',
};

const run = async () => {
  await connectDB();

  if (process.argv.includes('-d')) {
    console.log('Destroying all data...');
    await Promise.all([
      Admin.deleteMany(),
      Restaurant.deleteMany(),
      Category.deleteMany(),
      MenuItem.deleteMany(),
      ChatbotQuestion.deleteMany(),
    ]);
    console.log('All data destroyed.');
    process.exit(0);
  }

  console.log('Clearing existing data...');
  await Promise.all([
    Admin.deleteMany(),
    Restaurant.deleteMany(),
    Category.deleteMany(),
    MenuItem.deleteMany(),
    ChatbotQuestion.deleteMany(),
  ]);

  console.log('Creating restaurant...');
  const restaurant = await Restaurant.create({
    name: 'Sweet Treats Bakery',
    logo: '',
    description: 'Fresh cakes, pastries, snacks and sweets baked daily with love.',
    openingHours: '9:00 AM - 9:00 PM',
  });

  console.log('Creating admin...');
  const admin = await Admin.create({ ...DEFAULT_ADMIN, restaurantId: restaurant._id });

  console.log('Creating categories...');
  const categoryDocs = {};
  for (const cat of categories) {
    const doc = await Category.create({ ...cat, restaurantId: restaurant._id });
    categoryDocs[cat.name] = doc;
  }

  console.log('Creating menu items...');
  let itemCount = 0;
  for (const [catName, items] of Object.entries(itemsByCategory)) {
    const categoryDoc = categoryDocs[catName];
    if (!categoryDoc) continue;
    for (const [name, price, unit, isVegetarian, flags = {}] of items) {
      await MenuItem.create({
        name,
        description: `Delicious ${name.toLowerCase()} from ${restaurant.name}.`,
        price,
        unit,
        categoryId: categoryDoc._id,
        restaurantId: restaurant._id,
        isVegetarian,
        isAvailable: true,
        ...flags,
      });
      itemCount++;
    }
  }

  console.log('Creating chatbot questions...');
  for (const q of chatbotQuestions) {
    await ChatbotQuestion.create({ ...q, restaurantId: restaurant._id, isActive: true });
  }

  console.log('\n========================================');
  console.log('SEED COMPLETE');
  console.log('========================================');
  console.log(`Restaurant ID:  ${restaurant._id}`);
  console.log(`Public menu:    ${process.env.CLIENT_URL || 'http://localhost:5173'}/menu/${restaurant._id}`);
  console.log(`Admin login:    ${DEFAULT_ADMIN.email} / ${DEFAULT_ADMIN.password}`);
  console.log(`Categories:     ${categories.length}`);
  console.log(`Menu items:     ${itemCount}`);
  console.log(`Chatbot Q&A:    ${chatbotQuestions.length}`);
  console.log('========================================\n');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
