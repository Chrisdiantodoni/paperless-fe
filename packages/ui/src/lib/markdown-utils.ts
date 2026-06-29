import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

/**
 * Convert editor HTML to Markdown
 */
export function htmlToMarkdown(html: string): string {
  // Handle special cases
  let markdown = html
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n")
    .replace(/<strong>|<b>/g, "**")
    .replace(/<\/strong>|<\/b>/g, "**")
    .replace(/<em>|<i>/g, "*")
    .replace(/<\/em>|<\/i>/g, "*")
    .replace(/<u>/g, "")
    .replace(/<\/u>/g, "")
    .replace(/<s>|<strike>/g, "~~")
    .replace(/<\/s>|<\/strike>/g, "~~")
    .replace(/<h1>/g, "# ")
    .replace(/<\/h1>/g, "\n")
    .replace(/<h2>/g, "## ")
    .replace(/<\/h2>/g, "\n")
    .replace(/<h3>/g, "### ")
    .replace(/<\/h3>/g, "\n")
    .replace(/<blockquote>/g, "> ")
    .replace(/<\/blockquote>/g, "\n")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "\n")
    .replace(/<ol>/g, "")
    .replace(/<\/ol>/g, "\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "\n")
    .replace(/<code>/g, "`")
    .replace(/<\/code>/g, "`")
    .replace(/<pre>/g, "```\n")
    .replace(/<\/pre>/g, "\n```")
    .replace(/<a href="([^"]*)">/g, "[$1](")
    .replace(/<\/a>/g, ")")
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, "![$1]($1)")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]*>/g, "")

  // Clean up multiple newlines
  markdown = markdown.replace(/\n\n+/g, "\n\n")

  return markdown.trim()
}

/**
 * Parse markdown and extract links
 */
export function extractLinks(
  markdown: string
): Array<{ text: string; url: string }> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links: Array<{ text: string; url: string }> = []
  let match

  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    })
  }

  return links
}

/**
 * Validate markdown syntax
 */
export function validateMarkdown(markdown: string): boolean {
  try {
    md.parse(markdown, {})
    return true
  } catch {
    return false
  }
}

/**
 * Convert markdown to HTML for preview
 */
export function markdownToHtml(markdown: string): string {
  return md.render(markdown)
}
