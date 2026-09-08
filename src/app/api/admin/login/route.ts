import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const validEmail = process.env.ADMIN_EMAIL || 'admin@parkping.com';
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (
      email &&
      password &&
      email.trim().toLowerCase() === validEmail.trim().toLowerCase() &&
      password.trim() === validPassword.trim()
    ) {
      return NextResponse.json({
        success: true,
        token: `pp_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        admin: {
          email: validEmail,
          role: 'Store Admin & Fulfillment Manager',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin email address or password. (Default: admin@parkping.com / admin123)' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
