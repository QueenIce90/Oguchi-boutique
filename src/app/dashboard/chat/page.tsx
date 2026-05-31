"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/Container";
import Link from "next/link";

export default function AtelierChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Chat History
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/client/chat");
        const data = await res.json();
        if (data.ok) setMessages(data.messages);
      } catch (err) {
        console.error("CHAT_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const tempMsg = { id: Date.now().toString(), content: input, senderId: "me", createdAt: new Date() };
    setMessages((prev) => [...prev, tempMsg]);
    const currentInput = input;
    setInput("");

    try {
      await fetch("/api/client/chat", {
        method: "POST",
        body: JSON.stringify({ content: currentInput, recipient: "Customer Service" }),
      });
    } catch (err) {
      console.error("MESSAGE_SEND_ERROR:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black font-sans">
      {/* ATELIER HEADER */}
      <div className="border-b border-black/5 px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-serif italic text-lg">
            O
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest">Atelier Concierge</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[9px] uppercase tracking-tighter font-bold text-neutral-400">Tailoring Team Online</p>
            </div>
          </div>
        </div>
        <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-0.5">
          Back to Portal
        </Link>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-[10px] font-black uppercase animate-pulse tracking-[0.3em]">Syncing with Atelier...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-serif italic text-neutral-400 text-lg">Your design journey begins here.</p>
            <p className="text-[9px] uppercase tracking-widest text-neutral-300">Send a message to discuss measurements or styling.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.senderId === "me" || msg.isUser ? "items-end" : "items-start"}`}
            >
              <div className={`max-w-[75%] px-6 py-4 rounded-[1.5rem] text-sm leading-relaxed ${
                msg.senderId === "me" || msg.isUser 
                ? "bg-black text-white rounded-br-none shadow-xl" 
                : "bg-neutral-100 text-black rounded-bl-none"
              }`}>
                {msg.content}
              </div>
              <span className="text-[8px] uppercase font-black tracking-tighter text-neutral-300 mt-2 px-2">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-8 border-t border-black/5 bg-white">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inquire about your fitting, measurements, or design..."
            className="flex-grow bg-neutral-50 border-2 border-transparent focus:border-black rounded-full px-8 py-4 text-sm font-medium transition-all outline-none"
          />
          <button 
            type="submit"
            className="bg-black text-white px-10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition shadow-lg active:scale-95"
          >
            Send
          </button>
        </form>
        <p className="text-center text-[8px] text-neutral-300 uppercase tracking-[0.2em] mt-4">
          Response times are typically under 2 hours during Atelier business hours.
        </p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>
    </div>
  );
}