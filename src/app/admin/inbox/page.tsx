"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.ok) setMessages(data.messages);
    } catch (err) {
      console.error("Inbox sync failed");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      body: JSON.stringify({ id, isRead: true })
    });
    loadMessages();
  };

  useEffect(() => { loadMessages(); }, []);

  return (
    <div className="min-h-screen bg-white py-14 text-black">
      <Container>
        <div className="mb-12 border-b border-black/5 pb-10">
          <h1 className="text-4xl font-serif italic tracking-tight">Atelier Inbox</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mt-3 font-bold">Client Communications & Inquiries</p>
        </div>

        <div className="space-y-6">
          {messages.length === 0 && !loading && (
            <div className="py-20 text-center text-black/20 uppercase tracking-widest text-[10px] font-bold">
              The Atelier is quiet today.
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${!msg.isRead ? 'bg-neutral-50 border-black/10' : 'bg-white border-black/5 opacity-60'}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">
                      {msg.recipient}
                    </span>
                    {!msg.isRead && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                  <h3 className="text-xl font-serif italic">{msg.user.fullName}</h3>
                  <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{msg.user.email} • {msg.user.phone || 'No Phone'}</p>
                </div>
                
                <div className="text-[9px] font-bold uppercase tracking-widest text-black/20">
                  {new Date(msg.createdAt).toLocaleDateString()} @ {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="mt-8 text-sm leading-relaxed text-black/70 max-w-2xl">
                "{msg.content}"
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => markAsRead(msg.id)}
                  className="text-[9px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity"
                >
                  Mark as Resolved
                </button>
                <a 
                  href={`mailto:${msg.user.email}`}
                  className="text-[9px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}