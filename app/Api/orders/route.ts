import prisma from '../../db/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders — получить список заказов
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        total: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Не удалось получить заказы' }, { status: 500 });
  }
}

// POST /api/orders — создать новый заказ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, total, status }: { userId: number; total: number; status: string } = body;

    if (!userId || total === undefined || !status) {
      return NextResponse.json(
        { error: 'userId, total и status обязательны' },
        { status: 400 }
      );
    }

    // Проверка, существует ли пользователь
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Создание заказа
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status,
      },
      select: {
        id: true,
        userId: true,
        total: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error
      ? `Не удалось создать заказ\n${error.message}`
      : `Не удалось создать заказ\n${String(error)}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
