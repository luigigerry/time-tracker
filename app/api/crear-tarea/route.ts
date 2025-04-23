// app/api/crear-tarea/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {  getAuth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // 2. Parsear y validar datos del cuerpo
    const body = await request.json()
    const { 
      proyecto: nombreProyecto,
      costos,
      sueldo,
      horasTrabajadas: horas
    } = body

    if (!nombreProyecto || !costos || !sueldo || !horas) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // 3. Obtener usuario de la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado en la base de datos' },
        { status: 404 }
      )
    }

    // 4. Crear proyecto, tarea y registro en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // a. Crear o actualizar usuario (para guardar costos y sueldo)
      const usuarioActualizado = await tx.usuario.update({
        where: { id: usuario.id },
        data: {
          costos: Number(costos),
          sueldo: Number(sueldo),
          nombreProyecto: nombreProyecto
        }
      })

      // b. Crear proyecto
      const proyecto = await tx.proyecto.create({
        data: {
          nombre: nombreProyecto,
          fechaInicio: new Date(),
          usuarioId: usuario.id
        }
      })

      // c. Crear tarea por defecto
      const tarea = await tx.tarea.create({
        data: {
          nombre: 'Tarea principal',
          descripcion: 'Tarea principal del proyecto ' + nombreProyecto
        }
      })

      // d. Crear registro de horas
      const registro = await tx.registroHoras.create({
        data: {
          horas: Number(horas),
          fecha: new Date(),
          usuarioId: usuario.id,
          proyectoId: proyecto.id,
          tareaId: tarea.id
        }
      })

      return {
        usuario: usuarioActualizado,
        proyecto,
        tarea,
        registro
      }
    })

    // 5. Retornar respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Proyecto y registro de horas creados exitosamente',
      data: {
        proyecto: result.proyecto,
        registro: result.registro
      }
    }, { status: 201 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error al crear proyecto y registro:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}