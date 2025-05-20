export async function DELETE(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const idParam = searchParams.get('id');
      const id = idParam ? parseInt(idParam, 10) : NaN;
  
      if (!idParam || isNaN(id)) {
        return NextResponse.json(
          { error: 'Необходим корректный ID заказа' },
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
  