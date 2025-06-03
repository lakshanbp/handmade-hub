const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs'); // Add this at the top

dotenv.config({ path: require('path').resolve(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI, {
}).then(async () => {
  console.log('MongoDB connected');

  const adminExists = await User.findOne({ role: 'admin' });
  const adminPassword = 'X7p!qW9z$kL2mN8v';
  if (!adminExists) {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@handmadehub.com',
      password: adminPassword,
      role: 'admin',
      artisanStatus: 'none',
    });
    await admin.save();
    console.log('Admin user created');
  } else {
    // Only update if password is different
    const isMatch = await bcrypt.compare(adminPassword, adminExists.password);
    if (!isMatch) {
      adminExists.password = adminPassword;
      await adminExists.save();
      console.log('Admin user already exists, password updated');
    } else {
      console.log('Admin user already exists, password unchanged');
    }
  }
  mongoose.connection.close();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});