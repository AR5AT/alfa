// app/api/users/route.ts
import prisma from '../../db/prisma'
import { NextResponse } from 'next/server';

//  GET: Получить всех пользователей
export async function GET() {
    try {
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

//  POST: Создать нового пользователя
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Extract order data
    const { userId, status, total, items, orderDate } = body
    
    // Create order and order items in a transaction
    const order = await prisma.order.create({
      data: {
        userId,
        status,
        total,
        orderDate,
      },
      include: {
        items: true
      }
    })
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

//  PUT: Обновить пользователя по ID
export async function PUT(req: NextRequest) {
  const { id, name, email } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID обязателен для обновления' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
  }
}

//  DELETE: Удалить пользователя по ID
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID обязателен для удаления' }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Пользователь удалён', user: deletedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при удалении' }, { status: 500 });
  }
}