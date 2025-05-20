import prisma from '../../db/db';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, imageUrl } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    
    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });
    
    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        description,

      },
      select: {
        id: true,
        name: true,
        description: true,
  
      },
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    let message = 'Failed to create category';
    if (error instanceof Error) {
      message += `\n${error.message}`;
    } else {
      message += `\n${String(error)}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, imageUrl } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if updating to a name that already exists for another category
    if (name && name !== existingCategory.name) {
      const duplicateName = await prisma.category.findFirst({
        where: { 
          name,
          id: { not: id }
        },
      });
      
      if (duplicateName) {
        return NextResponse.json({ error: 'Another category with this name already exists' }, { status: 409 });
      }
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingCategory.name,
        description: description !== undefined ? description : existingCategory.description,
      
      },
      select: {
        id: true,
        name: true,
        description: true,
   
      },
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error: unknown) {
    let message = 'Failed to update category';
    if (error instanceof Error) {
      message += `\n${error.message}`;
    } else {
      message += `\n${String(error)}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if there are products associated with this category
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });
    
    if (productsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category: ${productsCount} products are associated with it`,
        productsCount 
      }, { status: 400 });
    }
    
    await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: unknown) {
    let message = 'Failed to delete category';
    if (error instanceof Error) {
      message += `\n${error.message}`;
    } else {
      message += `\n${String(error)}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}