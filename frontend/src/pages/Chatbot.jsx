import React, { useState, useEffect, useRef } from 'react';
import { geminiChat } from '../api';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your agricultural assistant. I can help you with:\n\n🌾 Crop cultivation and farming practices\n🐛 Plant diseases and pest management\n🌱 Soil management and fertilization\n🌤️ Weather and climate advice\n💰 Crop marketing and pricing\n🚜 Agricultural equipment and technology\n🐄 Livestock and animal husbandry\n♻️ Organic farming and sustainable practices\n📋 Government schemes for farmers\n\nWhat agricultural question can I help you with today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "What are the best practices for organic farming?",
    "How can I improve soil fertility naturally?",
    "What crops are suitable for monsoon season?",
    "How to control aphids without chemicals?",
    "Best fertilizers for wheat cultivation",
    "How to prevent fungal diseases in crops?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await geminiChat(input);
      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response. Please ensure Gemini API is configured.');
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please make sure the Gemini API is configured properly, or try again later.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! How can I help you with your agricultural questions?'
    }]);
    setError('');
  };

  return (
    <div className="container" style={{maxWidth: '900px', margin: '0 auto'}}>
      <h1 style={{marginTop: '30px', marginBottom: '20px', color: '#2e7d32'}}>
        🤖 Agricultural Chatbot
      </h1>

      <div className="alert alert-info mb-2">
        <strong>AI-Powered Agricultural Assistant:</strong> Ask me anything about farming, crops, diseases,
        soil management, weather, and more. I'm here to provide practical advice for Indian farming conditions.
      </div>

      {/* Chat Container */}
      <div className="card" style={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: message.role === 'user'
                    ? '#2e7d32'
                    : message.isError
                      ? '#ffebee'
                      : '#fff',
                  color: message.role === 'user' ? '#fff' : '#333',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {message.role === 'assistant' && (
                  <strong style={{color: '#2e7d32', display: 'block', marginBottom: '5px'}}>
                    🌾 AgriBot:
                  </strong>
                )}
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{display: 'flex', justifyContent: 'flex-start'}}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <strong style={{color: '#2e7d32'}}>🌾 AgriBot: </strong>
                <span style={{color: '#666'}}>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '15px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e0e0e0'
        }}>
          <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px'}}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about crops, diseases, farming practices..."
              className="form-control"
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? '⏳' : '📤'} Send
            </button>
          </form>

          <button
            onClick={clearChat}
            className="btn"
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#f44336',
              color: '#fff',
              borderRadius: '6px'
            }}
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      {/* Suggested Questions */}
      <div style={{marginTop: '20px'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>💡 Suggested Questions:</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '10px'
        }}>
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(question)}
              className="btn"
              style={{
                padding: '12px 16px',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #c8e6c9',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#c8e6c9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#e8f5e9';
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{marginTop: '20px'}}>
          {error}
        </div>
      )}

      <div className="alert alert-error" style={{marginTop: '20px'}}>
        <strong>⚠️ Important:</strong> This chatbot provides AI-generated advice. For critical farming
        decisions, please consult local agricultural experts or extension services.
      </div>
    </div>
  );
};

export default Chatbot;
