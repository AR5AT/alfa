// First, create a lib/prisma.ts file if you don't have it already:
// lib/prisma.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Then update your app/api/users/route.ts:



export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body;

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password, // Note: In a real app, you should hash this password!
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error creating user', details: (error as Error).message },
      { status: 500 }
    )
  }
}