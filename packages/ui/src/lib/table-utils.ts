/**
 * Table utility functions
 */

export interface TableConfig {
  rows: number
  cols: number
}

/**
 * Generate markdown table
 */
export function generateMarkdownTable(rows: number, cols: number): string {
  const header = Array(cols)
    .fill("Header")
    .map((h, i) => `${h} ${i + 1}`)
    .join(" | ")
  const separator = Array(cols).fill("---").join(" | ")
  const bodyRows = Array(rows - 1)
    .fill(null)
    .map(() => Array(cols).fill("Cell").join(" | "))
    .join("\n")

  return `| ${header} |\n| ${separator} |\n| ${bodyRows} |`
}

/**
 * Parse markdown table to extract data
 */
export function parseMarkdownTable(markdown: string): string[][] | null {
  const lines = markdown.trim().split("\n")
  if (lines.length < 2) return null

  const rows: string[][] = []
  for (const line of lines) {
    if (line.includes("|")) {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell && cell !== "---")
      if (cells.length > 0) {
        rows.push(cells)
      }
    }
  }

  return rows.length > 0 ? rows : null
}

/**
 * Convert HTML table to markdown
 */
export function htmlTableToMarkdown(html: string): string {
  const rows: string[][] = []

  // Extract rows from table
  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs
  let rowMatch

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/g
    const cells: string[] = []
    let cellMatch

    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      cells.push(cellMatch[1].trim().replace(/<[^>]*>/g, ""))
    }

    if (cells.length > 0) {
      rows.push(cells)
    }
  }

  if (rows.length === 0) return ""

  // Build markdown table
  const header = `| ${rows[0].join(" | ")} |`
  const separator = `| ${rows[0].map(() => "---").join(" | ")} |`
  const body = rows
    .slice(1)
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n")

  return `${header}\n${separator}\n${body}`
}
