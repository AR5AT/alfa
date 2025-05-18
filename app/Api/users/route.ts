import prisma from '../../db/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Хелпер для хеширования пароля
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// GET /api/user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password }: { email: string; name?: string; password: string } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error
      ? `Failed to create user\n${error.message}`
      : `Failed to create user\n${String(error)}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name, password }: { id: number; email?: string; name?: string; password?: string } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const dataToUpdate: Record<string, string> = {};
    if (email) dataToUpdate.email = email;
    if (name) dataToUpdate.name = name;
    if (password) dataToUpdate.password = await hashPassword(password);

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    const message = error instanceof Error
      ? `Failed to update user\n${error.message}`
      : `Failed to update user\n${String(error)}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/user?id=1
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (!idParam || isNaN(id)) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: `User with id ${id} deleted` });
  } catch (error) {
    const message = error instanceof Error
      ? `Failed to delete user\n${error.message}`
      : `Failed to delete user\n${String(error)}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
