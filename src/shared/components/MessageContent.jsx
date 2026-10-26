import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import './MessageContent.css'

function MessageContent({ content }) {
  return (
    <div className="message-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            return <code className={className ? `message-code ${className}` : 'message-inline-code'} {...props}>{children}</code>
          },
          pre({ children }) {
            const codeElement = children?.props
            const language = /language-([\w+-]+)/.exec(codeElement?.className ?? '')?.[1]

            return (
              <div className="message-code-block">
                <span className="message-code-block__language">{language ?? 'code'}</span>
                <SyntaxHighlighter
                  language={language ?? 'text'}
                  style={oneDark}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '16px', background: 'transparent' }}
                >
                  {String(codeElement?.children ?? '').replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MessageContent
