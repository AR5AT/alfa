// app/api/products/[id]/route.js
import { prisma } from '@/app/db/db';
import { NextResponse } from 'next/server'

// GET single product
export async function GET(request:Request { params }) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Неверный ID продукта' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(request:Request{ params:}) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Неверный ID продукта' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, price, stock, imageUrl } = body

    // Проверяем, есть ли такой продукт
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Produ// app/api/products/[id]/route.js
import { prisma } from '@/app/db/db';
import { NextResponse } from 'next/server';

// GET single product
export async function GET(_request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Неверный ID продукта' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Неверный ID продукта' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, price, stock, imageUrl } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (stock !== undefined) data.stock = Number(stock);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Неверный ID продукта' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
ct not found' }, { status: 404 })
    }

    // Собираем объект для обновления
    const data = {}
    if (name !== undefined)        data.name = name
    if (description !== undefined) data.description = description
    if (price !== undefined)       data.price = Number(price)
    if (stock !== undefined)       data.stock = Number(stock)
    if (imageUrl !== undefined)    data.imageUrl = imageUrl

    const updated = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(request:Request { params }) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Неверный ID продукта' }, { status: 400 })
    }

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
