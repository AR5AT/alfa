import prisma from '../../db/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    let message = 'Failed to create user';
    if (error instanceof Error) {
      message += `\n${error.message}`;
    } else {
      message += `\n${String(error)}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const dataToUpdate: any = {};

    if (email) dataToUpdate.email = email;
    if (name) dataToUpdate.name = name;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    let message = 'Failed to update user';
    if (error instanceof Error) {
      message += `\n${error.message}`;
    } else {
      message += `\n${String(error)}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'User ID must be a number' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: `User with id ${id} deleted` });
  } catch (error: unknown) {
    let message = 'Failed to delete user';
    if (error instanceof Error) {
      message += `\n${error.message}`;
    } else {
      message += `\n${String(error)}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
