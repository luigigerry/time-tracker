// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import { getAuth } from '@clerk/nextjs/server';

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   const id = params.id
//   try {
//     // 1. Verificar autenticación
//     const { userId } = getAuth(request)
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'No autorizado' },
//         { status: 401 }
//       );
//     }

//     // 2. Verificar que el proyecto exista y pertenezca al usuario
//     const proyecto = await prisma.proyecto.findUnique({
//       where: { id: Number(id) },
//       include: { usuario: true }
//     });

//     if (!proyecto) {
//       return NextResponse.json(
//         { error: 'Proyecto no encontrado' },
//         { status: 404 }
//       );
//     }

//     if (proyecto.usuario.clerkUserId !== userId) {
//       return NextResponse.json(
//         { error: 'No tienes permisos para eliminar este proyecto' },
//         { status: 403 }
//       );
//     }

//     // 3. Eliminar en cascada usando transacción
//     await prisma.$transaction([
//       // Primero eliminar registros relacionados
//       prisma.registroHoras.deleteMany({
//         where: { proyectoId: proyecto.id }
//       }),
//       // Luego eliminar el proyecto
//       prisma.proyecto.delete({
//         where: { id: proyecto.id }
//       })
//     ]);

//     return NextResponse.json(
//       { success: true, message: 'Proyecto eliminado correctamente' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Error al eliminar proyecto:', error);
//     return NextResponse.json(
//       { error: 'Error interno del servidor' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extrae el ID de la URL

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // 1. Verificar autenticación
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // 2. Verificar que el proyecto exista y pertenezca al usuario
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: Number(id) },
      include: { usuario: true }
    });

    if (!proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    if (proyecto.usuario.clerkUserId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este proyecto' },
        { status: 403 }
      );
    }

    // 3. Eliminar en cascada usando transacción
    await prisma.$transaction([
      prisma.registroHoras.deleteMany({
        where: { proyectoId: proyecto.id }
      }),
      prisma.proyecto.delete({
        where: { id: proyecto.id }
      })
    ]);

    return NextResponse.json(
      { success: true, message: 'Proyecto eliminado correctamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
