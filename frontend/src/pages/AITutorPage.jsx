import { useState } from 'react'
import { Send, Bot, User, Sparkles, Volume2, Video } from 'lucide-react'
import api from '../lib/api'

export default function AITutorPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Tutor powered by Gemini. I'm here to help you learn AI concepts, answer questions, and guide your learning journey. What would you like to explore today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const TEST_MODE = true
  
  const getMockResponse = (question) => {
    const q = question.toLowerCase()
    if (q.includes('machine learning') || q.includes('ml')) {
      return {
        answer: "Machine Learning is a subset of AI that enables systems to learn from data without being explicitly programmed. There are three main types:\n\n1. **Supervised Learning**: Learning from labeled data (e.g., spam detection)\n2. **Unsupervised Learning**: Finding patterns in unlabeled data (e.g., customer segmentation)\n3. **Reinforcement Learning**: Learning through trial and error (e.g., game AI)\n\nWould you like me to explain any of these in more detail?",
        follow_up_questions: ["What is deep learning?", "How do I start learning ML?", "What are neural networks?"]
      }
    }
    if (q.includes('neural') || q.includes('deep learning')) {
      return {
        answer: "Neural Networks are computing systems inspired by the human brain. They consist of layers of interconnected nodes (neurons) that process information.\n\n**Key concepts:**\n- **Input Layer**: Receives the data\n- **Hidden Layers**: Process and transform data\n- **Output Layer**: Produces the result\n\nDeep Learning uses neural networks with many hidden layers, enabling complex pattern recognition in images, speech, and text.",
        follow_up_questions: ["What is a CNN?", "How do transformers work?", "What is backpropagation?"]
      }
    }
    return {
      answer: `Great question about "${question}"! As your AI Tutor, I'm here to help you understand AI concepts.\n\nIn test mode, I'm providing sample responses. When fully configured with the Gemini API, I'll give you detailed, personalized explanations on any AI topic.\n\nTry asking about:\n- Machine Learning basics\n- Neural Networks\n- Deep Learning\n- Natural Language Processing`,
      follow_up_questions: ["What is machine learning?", "Explain neural networks", "How does AI work?"]
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Test mode: use mock responses
    if (TEST_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800))
      const mockResponse = getMockResponse(userMessage)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: mockResponse.answer,
        followUp: mockResponse.follow_up_questions
      }])
      setIsLoading(false)
      return
    }

    try {
      const response = await api.post('/ai/nlp-tutor/', {
        query_text: userMessage,
        user_profile: {
          industry: 'Technology',
          profession: 'Learner',
          preferred_tutor_persona: 'Friendly'
        }
      })

      if (response.data?.response?.answer) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.response.answer,
          followUp: response.data.response.follow_up_questions
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isError: true
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTTS = async (text) => {
    try {
      await api.post('/ai/tts/', { text })
      alert('TTS feature will generate audio. Configure GEMINI_API_KEY for full functionality.')
    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  const handleTTV = async (text) => {
    try {
      await api.post('/ai/ttv/', { text })
      alert('TTV feature will generate video. Configure GEMINI_API_KEY for full functionality.')
    } catch (error) {
      console.error('TTV error:', error)
    }
  }

  return (
    <div className="py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">AI Tutor</h1>
          <p className="text-[color:var(--current-text-color-secondary)]">
            Your personal AI learning assistant powered by Gemini
          </p>
        </div>

        {/* Chat Container */}
        <div className="card overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-[var(--color-secondary)] text-black'
                }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[var(--color-primary)] text-white'
                      : message.isError
                        ? 'bg-[var(--color-error-light)] border border-[var(--color-error)]'
                        : 'bg-[var(--current-card-bg)] border border-[var(--current-border-color)]'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Action buttons for assistant messages */}
                  {message.role === 'assistant' && !message.isError && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleTTS(message.content)}
                        className="text-xs flex items-center gap-1 text-[color:var(--current-text-color-secondary)] hover:text-[color:var(--color-primary)]"
                        title="Convert to Speech"
                      >
                        <Volume2 size={14} /> Listen
                      </button>
                      <button
                        onClick={() => handleTTV(message.content)}
                        className="text-xs flex items-center gap-1 text-[color:var(--current-text-color-secondary)] hover:text-[color:var(--color-primary)]"
                        title="Convert to Video"
                      >
                        <Video size={14} /> Video
                      </button>
                    </div>
                  )}

                  {/* Follow-up questions */}
                  {message.followUp && message.followUp.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {message.followUp.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(q)}
                          className="block text-left text-sm text-[color:var(--current-link-color)] hover:underline"
                        >
                          → {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
                  <Bot size={16} className="text-black" />
                </div>
                <div className="p-4 rounded-lg bg-[var(--current-card-bg)] border border-[var(--current-border-color)]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-[var(--current-border-color)]">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about AI..."
                className="form__input flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="button button--primary"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
