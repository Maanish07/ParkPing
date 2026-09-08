import { NextResponse } from 'next/server';
import { getAllAdminMembers, addAdminMember, deleteAdminMember } from '@/lib/storage';

export async function GET() {
  try {
    const members = getAllAdminMembers();
    return NextResponse.json({ success: true, members });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error fetching admin members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, password, and role are required' },
        { status: 400 }
      );
    }

    const newMember = addAdminMember({
      name,
      email,
      password,
      role,
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error creating admin member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteAdminMember(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete Super Admin or member not found' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error deleting admin member' },
      { status: 500 }
    );
  }
}
