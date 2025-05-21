import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/db/db';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (!idParam || isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'ID должен быть положительным числом' },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return NextResponse.json(
        { error: `Заказ с id ${id} не найден` },
        { status: 404 }
      );
    }

    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ message: `Заказ с id ${id} удалён` });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Не удалось удалить заказ\n${error.message}`
        : `Не удалось удалить заказ\n${String(error)}`;

    console.error('Ошибка при удалении заказа:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
