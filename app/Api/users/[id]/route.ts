import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Создаем экземпляр Prisma клиента
const prisma = new PrismaClient();

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
    
    // Исправляем хеширование пароля - вы забыли вызвать bcrypt.hash
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);
    
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
