import { NextRequest, NextResponse } from 'next/server';
import {  PrismaClient } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    const newUser = await  PrismaClient.user.create({
      data: {
        email,
        name,
        password,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const users = await  PrismaClient.user.findMany();
  return NextResponse.json(users);
}
