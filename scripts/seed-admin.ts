// Seed admin user script
// Run: npx tsx scripts/seed-admin.ts

import mongoose from 'mongoose';
import Admin from '../models/Admin';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exploretoraja';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email: 'admin@exploretoraja.id' });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await Admin.create({
            name: 'Admin',
            email: 'admin@exploretoraja.id',
            password: 'admin123', // Will be hashed by the model
            role: 'admin',
            isActive: true,
        });

        console.log('Admin user created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
