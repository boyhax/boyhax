import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: false,
})

type MarkdownContentProps = {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const html = marked.parse(content) as string

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
