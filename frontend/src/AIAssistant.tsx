import { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  reasoning_details?: string;
}

interface ChatMessage extends Message {
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const systemPrompt = `You are an AI Assistant for the AI-Assisted Patient Appointment Helper application. 
Your role is to help users with:
- Registering patients (collect name, email, phone number)
- Finding doctors by specialty
- Scheduling appointments
- Answering questions about the system

Be helpful, professional, and concise. If the user is asking about patient registration or finding doctors, guide them to the appropriate sections of the application.
Always ask for clarification if needed and maintain context across the conversation.`;

  const callOpenRouterAPI = async (userMessages: Message[]) => {
    try {
      if (!apiKey) {
        throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env.local file.');
      }

      const allMessages: Message[] = [
        {
          role: 'user',
          content: systemPrompt,
        },
        ...userMessages,
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Patient Appointment Helper',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-super-120b-a12b:free',
          messages: allMessages,
          reasoning: { enabled: true },
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const result = await response.json();
      const assistantMessage = result.choices[0].message;

      return {
        content: assistantMessage.content,
        reasoning_details: assistantMessage.reasoning_details,
      };
    } catch (err) {
      throw err;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const messageHistory: Message[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        reasoning_details: msg.reasoning_details,
      }));
      messageHistory.push({
        role: 'user',
        content: userMessage.content,
      });

      const assistantResponse = await callOpenRouterAPI(messageHistory);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse.content,
        reasoning_details: assistantResponse.reasoning_details,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response from AI assistant';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="ai-assistant-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Assistant"
      >
        🤖
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="ai-assistant-container">
          <div className="ai-assistant-header">
            <h3>AI Assistant</h3>
            <button
              className="ai-assistant-close"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="ai-assistant-messages">
            {messages.length === 0 ? (
              <div className="ai-assistant-welcome">
                <p>👋 Hello! I'm your AI Assistant.</p>
                <p>I can help you:</p>
                <ul>
                  <li>Register new patients</li>
                  <li>Find doctors by specialty</li>
                  <li>Answer questions about the system</li>
                </ul>
                <p>How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`ai-message-item ${msg.role}`}>
                  <div className="ai-message-role">{msg.role === 'user' ? 'You' : 'AI Assistant'}</div>
                  <div className="ai-message-content">{msg.content}</div>
                  {msg.reasoning_details && (
                    <details className="ai-reasoning">
                      <summary>View reasoning</summary>
                      <p>{msg.reasoning_details}</p>
                    </details>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="ai-message-item assistant">
                <div className="ai-message-role">AI Assistant</div>
                <div className="ai-loading">
                  <span className="ai-dot"></span>
                  <span className="ai-dot"></span>
                  <span className="ai-dot"></span>
                </div>
              </div>
            )}
            {error && (
              <div className="ai-message-error">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-assistant-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="ai-send-button"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;
