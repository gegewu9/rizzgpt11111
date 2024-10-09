import React, { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { sendMessage } from './services/api'

export default function ChatWindow() {
  const [selectedModel, setSelectedModel] = useState('GPT-3.5')
  const [inputMessage, setInputMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '你好!我是AI助手,有什么我可以帮助你的吗?' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setIsLoading(true)
      setError('')
      const newUserMessage = { role: 'user', content: inputMessage }
      setChatMessages(prevMessages => [...prevMessages, newUserMessage])
      setInputMessage('')

      try {
        const response = await sendMessage([...chatMessages, newUserMessage])
        setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: response.content }])
      } catch (error) {
        console.error('Error sending message:', error)
        setError(error instanceof Error ? error.message : String(error))
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* ... (rest of the component remains the same) ... */}
      
      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {/* ... (rest of the component remains the same) ... */}
    </div>
  )
}