import { request } from 'http';
import prisma from '../../db/db'
import { NextResponse } from 'next/server';



// GET: Получить все позиции заказа или позиции конкретного заказа
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const itemId = searchParams.get('id');
  
  try {
    if (itemId) {
      // Если указан ID позиции заказа, возвращаем конкретную позицию
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: Number(itemId) },
        include: { product: true } // Включаем информацию о продукте
      });
      
      if (!orderItem) {
        return NextResponse.json({ error: 'Позиция заказа не найдена' }, { status: 404 });
      }
      
      return NextResponse.json(orderItem);
    } else if (orderId) {
      // Если указан ID заказа, возвращаем все позиции для этого заказа
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: Number(orderId) },
        include: { product: true } // Включаем информацию о продукте
      });
      return NextResponse.json(orderItems);
    } else {
      // Если ID заказа не указан, возвращаем все позиции
      const orderItems = await prisma.orderItem.findMany({
        include: { product: true } // Включаем информацию о продукте
      });
      return NextResponse.json(orderItems);
    }
  } catch (error) {
    return NextResponse.json({ error: `Ошибка при получении позиций заказа ${error}` }, { status: 500 });
  }
}

// POST: Создать новую позицию заказа
export async function POST(req) {
  const { orderId, productId, quantity, price } = await req.json();
  
  if (!orderId || !productId) {
    return NextResponse.json({ error: 'orderId и productId обязательны для создания позиции заказа' }, { status: 400 });
  }
  
  try {
    // Проверяем, существует ли заказ
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) }
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Указанный заказ не существует' }, { status: 404 });
    }
    
    // Проверяем, существует ли продукт
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Указанный продукт не существует' }, { status: 404 });
    }
    
    // Создаем новую позицию заказа
    const newOrderItem = await prisma.orderItem.create({
      data: {
        orderId: Number(orderId),
        productId: Number(productId),
        quantity: quantity ? Number(quantity) : 1,
        price: price ? Number(price) : product.price
      }
    });
    
    return NextResponse.json(newOrderItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Ошибка при создании позиции заказа  ${error}` }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, orderId, productId, quantity, price } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID обязателен для обновления' }, { status: 400 });
  }

  try {
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: Number(id) },
      data: { 
        orderId: orderId !== undefined ? Number(orderId) : undefined,
        productId: productId !== undefined ? Number(productId) : undefined,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        price: price !== undefined ? Number(price) : undefined
      },
    });
    return NextResponse.json(updatedOrderItem);
  } catch (error) {
    return NextResponse.json({ error: `Ошибка при обновлении позиции заказа  ${error}`}, { status: 500 });
  }
}

// DELETE: Удалить позицию заказа по ID
export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID обязателен для удаления' }, { status: 400 });
  }


try {
    const deletedOrderItem = await prisma.orderItem.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Позиция заказа удалена', orderItem: deletedOrderItem });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при удалении позиции заказа' }, { status: 500 });
  }
}

