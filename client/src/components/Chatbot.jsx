import { useEffect, useState, useRef } from 'react';
import { getChatbotQuestions, askChatbot } from '../services/api';

export default function Chatbot({ restaurantId }) {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Menu Assistant\nHow can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && restaurantId) {
      getChatbotQuestions({ restaurantId, activeOnly: true })
        .then((res) => setQuestions(res.data.data))
        .catch(() => setQuestions([]));
    }
  }, [open, restaurantId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await askChatbot({ restaurantId, text });
      setMessages((m) => [...m, { from: 'bot', text: data.data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: "Sorry, I don't have an answer for that yet. Please select one of the available questions." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 bg-brand-600 hover:bg-brand-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl"
        aria-label="Open menu assistant"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-80 max-w-[90vw] h-[28rem] bg-white rounded-2xl shadow-2xl border border-orange-100 flex flex-col overflow-hidden">
          <div className="bg-brand-600 text-white px-4 py-3">
            <p className="font-semibold text-sm">🍰 Menu Assistant</p>
            <p className="text-xs opacity-80">Ask me about our menu</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-orange-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                    m.from === 'user' ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 border border-orange-100'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 px-1">Typing...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-2 border-t border-orange-100 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {questions.map((q) => (
              <button
                key={q._id}
                onClick={() => send(q.question)}
                className="text-xs bg-orange-100 hover:bg-orange-200 text-brand-800 px-2.5 py-1 rounded-full"
              >
                {q.question}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex border-t border-orange-100"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="px-4 text-brand-600 font-medium text-sm">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
