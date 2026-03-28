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

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;

  // Debug effect to check initialization
  useEffect(() => {
    console.log('AIAssistant initialized');
    console.log('API Key configured:', !!apiKey);
    if (!apiKey) {
      console.warn('Warning: OpenRouter API key not configured');
    }
  }, [apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

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

      console.log('Calling OpenRouter API...');
      console.log('Messages to send:', userMessages);

      const requestBody = {
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...userMessages,
        ],
        reasoning: { enabled: true, type: 'enabled' },
        temperature: 0.7,
        max_tokens: 1000,
      };

      console.log('Request body:', requestBody);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Patient Appointment Helper',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(
          errorData.error?.message || 
          `API error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('API Result:', result);
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid API response: no message content returned');
      }

      const assistantMessage = result.choices[0].message;

      // Extract content - handle both string and object responses
      let content = '';
      if (typeof assistantMessage.content === 'string') {
        content = assistantMessage.content;
      } else if (assistantMessage.content && typeof assistantMessage.content === 'object') {
        // If it's an object with a 'text' property, use that
        if (assistantMessage.content.text) {
          content = assistantMessage.content.text;
        } else {
          // Otherwise stringify it
          content = JSON.stringify(assistantMessage.content);
        }
      }

      // Extract reasoning details - handle both string and object responses
      let reasoning = undefined;
      if (assistantMessage.reasoning_details) {
        if (typeof assistantMessage.reasoning_details === 'string') {
          reasoning = assistantMessage.reasoning_details;
        } else if (typeof assistantMessage.reasoning_details === 'object') {
          if (assistantMessage.reasoning_details.text) {
            reasoning = assistantMessage.reasoning_details.text;
          } else {
            reasoning = JSON.stringify(assistantMessage.reasoning_details, null, 2);
          }
        }
      }

      console.log('Extracted content:', content);
      console.log('Extracted reasoning:', reasoning);

      return {
        content,
        reasoning_details: reasoning,
      };
    } catch (err) {
      console.error('callOpenRouterAPI error:', err);
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

    console.log('Sending message:', userMessage.content);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Build message history from all previous messages
      const messageHistory: Message[] = messages.map((msg) => {
        const msgObj: Message = {
          role: msg.role,
          content: msg.content,
        };
        if (msg.reasoning_details) {
          msgObj.reasoning_details = msg.reasoning_details;
        }
        return msgObj;
      });
      messageHistory.push({
        role: 'user',
        content: userMessage.content,
      });

      console.log('Message history:', messageHistory);
      const assistantResponse = await callOpenRouterAPI(messageHistory);
      console.log('API Response received:', assistantResponse);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse.content,
        timestamp: new Date(),
      };
      if (assistantResponse.reasoning_details) {
        assistantMessage.reasoning_details = assistantResponse.reasoning_details;
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response from AI assistant';
      console.error('Error in handleSendMessage:', err);
      setError(errorMessage);
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                  <div className="ai-message-content">
                    {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                  </div>
                  {msg.reasoning_details && (
                    <details className="ai-reasoning">
                      <summary>View reasoning</summary>
                      <p>
                        {typeof msg.reasoning_details === 'string'
                          ? msg.reasoning_details
                          : JSON.stringify(msg.reasoning_details, null, 2)}
                      </p>
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

          {!apiKey && (
            <div className="ai-message-error" style={{ margin: '12px', marginTop: '0' }}>
              <strong>⚠️ API Key Missing:</strong> Add VITE_OPENROUTER_API_KEY to .env.local file
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AIAssistant;
