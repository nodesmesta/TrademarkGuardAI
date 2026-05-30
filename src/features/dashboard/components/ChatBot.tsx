'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Paperclip, X, FileText } from 'lucide-react'
import { Button } from '@/features/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  const buf = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item: unknown) => (item as { str?: string }).str || '').join(' '))
  }
  return pages.join('\n')
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your TradeGuard AI assistant. I can help you manage products, monitor trademarks, and extract info from PDFs. Try: "Add product Nike Shoes with keywords nike, shoes on instagram and google"' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfText, setPdfText] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') return
    setPdfFile(file)
    setLoading(true)
    try {
      const text = await extractPdfText(file)
      setPdfText(text)
      setMessages(prev => [...prev, { role: 'user', content: `📎 [${file.name}]` }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to parse PDF. Please try another file.' }])
      setPdfFile(null)
    }
    setLoading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          ...(pdfText && { pdfText }),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'No response.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-[520px]">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">AI Assistant</p>
          <p className="text-xs text-green-500">Online • Agentic Mode</p>
        </div>
        {pdfFile && (
          <div className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            <Paperclip className="w-3 h-3" />
            <span className="max-w-[100px] truncate">{pdfFile.name}</span>
            <button onClick={() => { setPdfFile(null); setPdfText(null) }}><X className="w-3 h-3" /></button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0 [&_pre]:bg-gray-800 [&_pre]:text-gray-100 [&_pre]:rounded [&_pre]:p-2 [&_code]:text-xs [&_table]:text-xs [&_th]:px-2 [&_td]:px-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content.startsWith('📎 [') ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{msg.content.replace('📎 [', '').replace(']', '')}</p>
                    <p className="text-[10px] opacity-70">PDF attached</p>
                  </div>
                </div>
              ) : msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl rounded-bl-sm">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          title="Upload PDF"
          disabled={loading}
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask to add/edit/delete products, or upload a PDF..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <Button
          size="sm"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
