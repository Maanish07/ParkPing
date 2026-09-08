import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const verifiedMember = verifyAdminCredentials(email, password);

    if (verifiedMember) {
      return NextResponse.json({
        success: true,
        token: `pp_token_${verifiedMember.id}_${Date.now()}`,
        admin: {
          id: verifiedMember.id,
          name: verifiedMember.name,
          email: verifiedMember.email,
          role: verifiedMember.role,
          isSuperAdmin: verifiedMember.isSuperAdmin,
        },
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid email or password. Default super admin: admin@parkping.com / admin123' 
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
