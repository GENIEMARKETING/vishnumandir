import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'public', 'admin', 'docs')

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = (await request.json()) as { filename?: string }

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Filename required.' }, { status: 400 })
    }

    // Security: prevent path traversal attacks
    const safeName = path.basename(filename)
    if (!safeName.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files can be deleted.' }, { status: 400 })
    }

    const filePath = path.join(DOCS_DIR, safeName)

    // Ensure the resolved path is still within DOCS_DIR
    if (!filePath.startsWith(DOCS_DIR)) {
      return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 })
    }

    await unlink(filePath)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 })
  }
}
