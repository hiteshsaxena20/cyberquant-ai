import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';
import { sendChatMessage } from '../api/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: any;
  timestamp: Date;
}

const SUGGESTED_QUERIES = [
  'What is our highest financial cyber risk today?',
  'Where should we spend ₹50 lakh?',
  'Which vulnerabilities should we patch first?',
  'What happens if MFA is enabled for all users?',
  'What is our overall enterprise risk?',
  'How effective are our security controls?',
  'What is our NIST compliance score?',
  'What if remediation is delayed by 30 days?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(messageText);
      const aiMsg: Message = {
        role: 'assistant',
        content: response.response,
        data: response.data,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg: Message = {
        role: 'assistant',
        content: 'I encountered an error processing your request. Please ensure the backend is running and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          AI Assistant
        </h1>
        <p className="text-dark-400 mt-1">Ask questions about your cyber risk in natural language</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-600 to-cyber-800 flex items-center justify-center mb-6 shadow-xl shadow-cyber-500/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ask CyberQuant AI</h2>
            <p className="text-dark-400 mb-8 text-center max-w-md">
              I can analyze your cyber risk, optimize budgets, prioritize vulnerabilities, and simulate security scenarios.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
              {SUGGESTED_QUERIES.map((query, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(query)}
                  className="p-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-sm text-dark-300 text-left hover:bg-dark-800 hover:border-cyber-500/30 hover:text-white transition-all flex items-start gap-2 group"
                >
                  <Lightbulb className="w-4 h-4 text-dark-600 group-hover:text-cyber-400 mt-0.5 flex-shrink-0 transition-colors" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-cyber-600'
                  : 'bg-gradient-to-br from-cyber-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`chat-message ${msg.role === 'user' ? 'chat-user' : 'chat-ai'}`}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {renderMarkdown(msg.content)}
                </div>
                <p className="text-[10px] text-dark-600 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyber-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-message chat-ai">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-dark-500">Analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-card p-4 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-white placeholder-dark-500 outline-none text-sm"
          placeholder="Ask CyberQuant AI anything about your cyber risk..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-cyber-600 text-white hover:bg-cyber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Simple markdown renderer for bold text and bullet points
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold
    let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Italic
    processed = processed.replace(/_(.*?)_/g, '<em class="text-dark-300">$1</em>');
    // Bullet points
    if (processed.startsWith('• ') || processed.startsWith('- ')) {
      processed = processed.replace(/^[•-]\s/, '');
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-cyber-400 mt-1">•</span>
          <span dangerouslySetInnerHTML={{ __html: processed }} />
        </div>
      );
    }
    // Numbered items
    const numMatch = processed.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-cyber-400 font-mono text-xs mt-0.5 w-5">{numMatch[1]}.</span>
          <span dangerouslySetInnerHTML={{ __html: numMatch[2] }} />
        </div>
      );
    }
    // Table rows
    if (processed.includes('|') && processed.trim().startsWith('|')) {
      const cells = processed.split('|').filter(c => c.trim());
      if (cells.every(c => c.trim().match(/^-+$/))) return null; // separator
      return (
        <div key={i} className="grid grid-cols-2 gap-2 text-sm my-0.5">
          {cells.map((cell, j) => (
            <span key={j} className={j === 0 ? 'text-dark-400' : 'font-mono text-white'} dangerouslySetInnerHTML={{ __html: cell.trim() }} />
          ))}
        </div>
      );
    }
    // Empty lines
    if (!processed.trim()) return <div key={i} className="h-2" />;
    // Normal text
    return <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
  });
}
