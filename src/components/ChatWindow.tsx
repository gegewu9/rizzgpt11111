import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { sendMessage } from '../services/api'

export default function ChatWindow() {
  const [selectedModel, setSelectedModel] = useState('GPT-3.5')
  const [inputMessage, setInputMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '你好!我是AI助手,有什么我可以帮助你的吗?' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && !isLoading) {
      const newUserMessage = { role: 'user', content: inputMessage }
      setChatMessages([...chatMessages, newUserMessage])
      setInputMessage('')
      setIsLoading(true)

      try {
        const response = await sendMessage([...chatMessages, newUserMessage])
        setChatMessages(prevMessages => [...prevMessages, response])
      } catch (error) {
        console.error('Error sending message:', error)
        setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: '抱歉，发生了一个错误。请稍后再试。' }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          {/* 公司logo和名称 */}
          <div className="flex items-center flex-shrink-0 mr-6">
            <Bot className="mr-2" size={24} />
            <span className="font-semibold text-xl tracking-tight">AI Chat Company</span>
          </div>
          
          {/* 软件介绍 */}
          <div className="hidden md:block">
            <span className="text-sm">智能对话助手 - 您的AI伙伴</span>
          </div>
          
          {/* 登录按钮和AI模型选择 */}
          <div className="flex items-center">
            <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
              <User className="mr-2" size={16} />
              登录
            </button>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option>GPT-3.5</option>
              <option>GPT-4</option>
              <option>Claude</option>
            </select>
          </div>
        </div>
      </nav>

      {/* 主体部分 */}
      <div className="flex-1 flex p-4">
        {/* 左侧预留位置 */}
        <div className="w-1/6 hidden md:block"></div>

        {/* 聊天窗口 */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  正在思考...
                </div>
              </div>
            )}
          </div>
          <div className="border-t p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="输入你的消息..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧预留位置 */}
        <div className="w-1/6 hidden md:block"></div>
      </div>
    </div>
  )
}