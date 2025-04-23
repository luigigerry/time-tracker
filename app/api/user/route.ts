import { prisma } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    const data = await req.json()

    const { nombre } = data

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nombre,
        firstLogin: false,
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      message: "Error creating user ", error: error
    }, { status: 500 })
  }
}