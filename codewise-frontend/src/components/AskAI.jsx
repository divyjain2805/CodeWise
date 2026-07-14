import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const parseError = (err) => {
  const msg = err?.response?.data?.message || err?.message || "An unknown error occurred";
  if (typeof msg === "string") {
    if (msg.includes("429") || msg.includes("Quota exceeded") || msg.includes("RESOURCE_EXHAUSTED")) {
      return "The AI service is currently busy or rate-limited. Please try again in a minute.";
    }
    try {
      if (msg.includes("{")) {
        const jsonStart = msg.indexOf("{");
        const parsed = JSON.parse(msg.substring(jsonStart));
        if (parsed?.error?.status === "RESOURCE_EXHAUSTED" || parsed?.error?.code === 429) {
          return "The AI service is currently busy or rate-limited. Please try again in a minute.";
        }
      }
    } catch(e) {}
  }
  return msg;
};

export default function AskAI({ problemId, code, language }) {
  const { isAuthed } = useAuth();
  
  const [activeMode, setActiveMode] = useState("hint"); // hint, explain, chat
  
  // Hint State
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  
  // Explain State
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef(null);

  const [error, setError] = useState("");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeMode === 'chat') {
      scrollToBottom();
    }
  }, [chatHistory, activeMode]);

  const handleGetHint = async () => {
    if (!isAuthed) {
      setError("Please login to use AI features");
      return;
    }
    setLoadingHint(true);
    setError("");
    try {
      const res = await api.post("/ai/hint", { problemid: problemId, code, language });
      setHint(res.data.hint);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoadingHint(false);
    }
  };

  const handleExplain = async () => {
    if (!isAuthed) {
      setError("Please login to use AI features");
      return;
    }
    setLoadingExplain(true);
    setError("");
    try {
      const res = await api.post("/ai/explain", { problemid: problemId, code, language });
      setExplanation(res.data.explanation);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleSendChat = async () => {
    if (!isAuthed) {
      setError("Please login to use AI features");
      return;
    }
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    // History passed to backend doesn't include the current message.
    const currentHistory = [...chatHistory]; 
    
    const newHistory = [...chatHistory, { role: "user", content: userMessage }];
    setChatHistory(newHistory);
    setChatInput("");
    setLoadingChat(true);
    setError("");

    try {
      const res = await api.post("/ai/chat", {
        problemid: problemId,
        code,
        language,
        message: userMessage,
        history: currentHistory 
      });
      
      const aiResponse = res.data.response;
      setChatHistory([...newHistory, { role: "assistant", content: aiResponse }]);
    } catch (err) {
      setError(parseError(err));
      // Remove the optimistic user message if it failed
      setChatHistory(currentHistory);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="tabs tabs-boxed mb-6 bg-base-200/50 p-2 border border-base-300 rounded-xl flex gap-2">
        <button 
          className={`tab tab-md flex-1 transition-all duration-300 rounded-lg ${activeMode === 'hint' ? '!bg-primary !text-primary-content font-bold shadow-md' : 'hover:bg-base-300'}`} 
          onClick={() => setActiveMode('hint')}
        >
          Hint
        </button>
        <button 
          className={`tab tab-md flex-1 transition-all duration-300 rounded-lg ${activeMode === 'explain' ? '!bg-primary !text-primary-content font-bold shadow-md' : 'hover:bg-base-300'}`} 
          onClick={() => setActiveMode('explain')}
        >
          Explain
        </button>
        <button 
          className={`tab tab-md flex-1 transition-all duration-300 rounded-lg ${activeMode === 'chat' ? '!bg-primary !text-primary-content font-bold shadow-md' : 'hover:bg-base-300'}`} 
          onClick={() => setActiveMode('chat')}
        >
          Chat
        </button>
      </div>

      <div className="flex-1 bg-base-100 rounded-xl border border-base-200 p-4 shadow-inner min-h-[400px]">
        {error && (
          <div className="alert alert-error text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {/* HINT MODE */}
        {activeMode === 'hint' && (
          <div className="space-y-6 h-full flex flex-col">
            <div className="text-center space-y-2 mt-4">
              <div className="text-4xl">💡</div>
              <h3 className="text-lg font-bold">Stuck on this problem?</h3>
              <p className="text-sm text-base-content/70 max-w-md mx-auto">
                Get a small, contextual hint based on your current code to nudge you in the right direction without giving away the full answer.
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
              <button 
                className="btn btn-primary px-8" 
                onClick={handleGetHint} 
                disabled={loadingHint || !isAuthed}
              >
                {loadingHint ? <span className="loading loading-spinner"></span> : "Get a Hint"}
              </button>
            </div>

            {hint && (
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 shadow-sm flex-1 animate-fade-in overflow-y-auto">
                <div className="prose prose-sm md:prose-base max-w-none text-base-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXPLAIN MODE */}
        {activeMode === 'explain' && (
          <div className="space-y-6 h-full flex flex-col">
            <div className="text-center space-y-2 mt-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold">Code Review & Explanation</h3>
              <p className="text-sm text-base-content/70 max-w-md mx-auto">
                Analyze your code to get a structured review including time & space complexity, strengths, weaknesses, and suggestions for improvement.
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button 
                className="btn btn-secondary px-8" 
                onClick={handleExplain} 
                disabled={loadingExplain || !isAuthed}
              >
                {loadingExplain ? <span className="loading loading-spinner"></span> : "Explain problem"}
              </button>
            </div>

            {explanation && (
              <div className="mt-8 p-6 bg-base-200/50 rounded-xl border border-base-300 shadow-sm flex-1 animate-fade-in overflow-y-auto">
                <div className="prose prose-sm md:prose-base max-w-none text-base-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHAT MODE */}
        {activeMode === 'chat' && (
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-base-content/50 space-y-3">
                  <span className="text-5xl">🤖</span>
                  <div>
                    <h4 className="font-bold text-lg text-base-content">CodeWise AI Mentor</h4>
                    <p className="text-sm mt-1">Ask me anything about your code!</p>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap justify-center max-w-sm">
                    <button className="badge badge-outline p-3 hover:bg-base-300 cursor-pointer" onClick={() => setChatInput("Why is my code getting TLE?")}>Why TLE?</button>
                    <button className="badge badge-outline p-3 hover:bg-base-300 cursor-pointer" onClick={() => setChatInput("Can you give me an example?")}>Give an example</button>
                    <button className="badge badge-outline p-3 hover:bg-base-300 cursor-pointer" onClick={() => setChatInput("What is the time complexity?")}>Time complexity?</button>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'} animate-fade-in`}>
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full bg-base-300 flex items-center justify-center text-xl shadow-sm border border-base-200">
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </div>
                    </div>
                    <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-primary text-primary-content shadow-md' : 'chat-bubble-neutral text-neutral-content shadow-sm'} text-sm md:text-base`}>
                      <div className="prose prose-sm max-w-none text-inherit">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {loadingChat && (
                <div className="chat chat-start animate-fade-in">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full bg-base-300 flex items-center justify-center text-xl shadow-sm border border-base-200">🤖</div>
                  </div>
                  <div className="chat-bubble chat-bubble-neutral">
                    <span className="loading loading-dots loading-sm"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex gap-2 bg-base-200/50 p-2 rounded-xl border border-base-300 shadow-inner">
              <input 
                type="text" 
                placeholder="Message AI Mentor..." 
                className="input input-ghost flex-1 focus:bg-base-100 transition-colors"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                disabled={loadingChat || !isAuthed}
              />
              <button 
                className="btn btn-primary rounded-lg px-6 shadow-md" 
                onClick={handleSendChat}
                disabled={loadingChat || !isAuthed || !chatInput.trim()}
              >
                Send
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
