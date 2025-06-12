import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const path = body?.path

  revalidatePath(path)

  return NextResponse.json({ revalidated: true, path })
}
