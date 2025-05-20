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
    const data: any = {
      email,
      password: hashedPassword,
    };
    
    if (name !== undefined) {
      data.name = name;
    }
    
    

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? '', 
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