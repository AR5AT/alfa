
// app/api/products/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl } = body;
    
    // Validate input
    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}