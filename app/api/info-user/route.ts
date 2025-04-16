// app/api/sync-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar o crear usuario
    let user = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!user) {
      // Crear usuario con datos mínimos
      user = await prisma.usuario.create({
        data: {
          id: userId,
          nombre: '', // Campos vacíos
          email: '', // Temporal
          firstLogin: true,
        }
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[SYNC_USER_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}