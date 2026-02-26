import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// GET /api/admin/auth/me - Get current admin user
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            role: string;
            name: string;
        };

        await dbConnect();

        const admin = await Admin.findById(decoded.id);

        if (!admin || !admin.isActive) {
            return NextResponse.json(
                { success: false, error: 'Admin not found' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { success: false, error: 'Authentication failed' },
            { status: 401 }
        );
    }
}
