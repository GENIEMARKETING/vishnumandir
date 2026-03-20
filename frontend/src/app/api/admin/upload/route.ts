import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'public', 'admin', 'docs')
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

/** Sanitize filename: keep alphanumerics, dots, hyphens, underscores, spaces */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.\-_ ]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 200)
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Only allow PDF files
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 20 MB limit.' }, { status: 400 })
    }

    const safeFilename = sanitizeFilename(file.name)
    if (!safeFilename) {
      return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 })
    }

    // Ensure docs directory exists
    await mkdir(DOCS_DIR, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(DOCS_DIR, safeFilename)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      filename: safeFilename,
      url: `/admin/docs/${encodeURIComponent(safeFilename)}`,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}
