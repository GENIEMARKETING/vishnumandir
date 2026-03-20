import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'public', 'admin', 'docs')

export interface AdminFile {
  name: string
  size: number
  uploadedAt: string
  url: string
}

export async function GET() {
  try {
    let entries: string[] = []
    try {
      entries = await readdir(DOCS_DIR)
    } catch {
      // Docs directory doesn't exist yet — return empty list
      return NextResponse.json({ files: [] })
    }

    const files: AdminFile[] = []
    for (const name of entries) {
      if (!name.toLowerCase().endsWith('.pdf')) continue
      try {
        const info = await stat(path.join(DOCS_DIR, name))
        files.push({
          name,
          size: info.size,
          uploadedAt: info.mtime.toISOString(),
          url: `/admin/docs/${encodeURIComponent(name)}`,
        })
      } catch {
        // Skip files we can't stat
      }
    }

    // Sort newest first
    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ files })
  } catch (err) {
    console.error('Error listing admin files:', err)
    return NextResponse.json({ error: 'Failed to list files.' }, { status: 500 })
  }
}
