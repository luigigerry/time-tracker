// app/api/proyectos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const proyectos = await prisma.proyecto.findMany({
      where: {
        usuario: {
          id: userId
        }
      },
      include: {
        registros: {
          select: {
            horas: true,
            fecha: true
          }
        }
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });

    return NextResponse.json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}