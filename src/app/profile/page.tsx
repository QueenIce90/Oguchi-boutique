"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import StatusTracker from "@/components/StatusTracker";

type Tab = "orders" | "messages" | "payments" | "settings";

export default function ClientProfilePage() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  // Form States
  const [messageContent, setMessageContent] = useState("");
  const [messageRecipient, setMessageRecipient] = useState("Tailor & Seamstress");
  const [addressForm, setAddressForm] = useState({ 
    addressLine1: "", city: "", state: "", postalCode: "" 
  });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: "", newPassword: "" 
  });

  // 1. Initial Load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("maison_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setAddressForm({
        addressLine1: parsed.addressLine1 || "",
        city: parsed.city || "",
        state: parsed.state || "",
        postalCode: parsed.postalCode || "",
      });
      loadData(parsed.id);
    } else {
      window.location.href = "/login";
    }
  }, []);

  // 2. Handle Stripe Redirects
  useEffect(() => {
    if (paymentStatus === "success") {
      setSuccess("Your investment has been received. Oguchi Boutique is proceeding with your commission.");
    } else if (paymentStatus === "cancelled") {
      setError("Payment was not completed. Your journey remains unchanged.");
    }
  }, [paymentStatus]);

  const loadData = async (userId: string) => {
    try {
      const [orderRes, msgRes] = await Promise.all([
        fetch(`/api/profile/order?userId=${userId}`),
        fetch(`/api/messages/history?userId=${userId}`)
      ]);
      const orderData = await orderRes.json();
      const msgData = await msgRes.json();
      
      if (orderData.ok) setOrders(orderData.orders);
      if (msgData.ok) setHistory(msgData.messages);
    } catch (err) {
      setError("Failed to sync with Oguchi Boutique.");
    }
  };

  // --- ACTION HANDLERS ---

  const handleUpdateAddress = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/profile/update-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...addressForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Mailing address updated.");
        // Update local session
        const updatedUser = { ...user, ...addressForm };
        sessionStorage.setItem("maison_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        setError(data.error || "Failed to update address.");
      }
    } catch (err) {
      setError("Network error updating address.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...passwordForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Security credentials updated.");
        setPasswordForm({ currentPassword: "", newPassword: "" });
      } else {
        setError(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (order: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          amount: order.totalPrice,
          userEmail: user.email,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      setError("Payment gateway unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          recipient: messageRecipient, 
          content: messageContent 
        }),
      });
      if (res.ok) {
        setMessageContent("");
        loadData(user.id);
        setSuccess("Inquiry dispatched to the Boutique.");
      }
    } finally { setLoading(false); }
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return <div className="min-h-screen bg-white flex items-center justify-center font-serif italic text-black/20">Syncing with Oguchi Boutique...</div>;

  return (
    <div className="min-h-screen bg-white py-20 text-black selection:bg-black selection:text-white">
      <Container>
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* SIDEBAR */}
          <aside className="w-full md:w-64 space-y-12">
            <div>
              <h1 className="text-3xl font-serif italic tracking-tight">Oguchi Boutique</h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-bold mt-2">Client Portal • {user.fullName}</p>
            </div>
            
            <nav className="flex flex-col gap-6 text-[10px] font-bold uppercase tracking-[0.3em]">
              <TabBtn active={activeTab === "orders"} onClick={() => setActiveTab("orders")} label="Journey" />
              <TabBtn active={activeTab === "messages"} onClick={() => setActiveTab("messages")} label="Concierge Chat" />
              <TabBtn active={activeTab === "payments"} onClick={() => setActiveTab("payments")} label="Financial Ledger" />
              <TabBtn active={activeTab === "settings"} onClick={() => setActiveTab("settings")} label="Personal Details" />
              <button onClick={logout} className="text-red-400 mt-12 text-left opacity-60 hover:opacity-100 transition-opacity">Sign Out</button>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 max-w-3xl">
            
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="section-title">Your Journey</h2>
                {orders.length === 0 ? <Empty text="No active commissions found." /> : (
                  <div className="space-y-12">
                    {orders.map((o) => (
                      <div key={o.id} className="lux-card-border p-10">
                        <div className="flex justify-between items-start mb-10">
                          <div>
                            <span className="label-dim">Order No.</span>
                            <h3 className="text-xl font-serif italic">{o.orderNumber}</h3>
                          </div>
                          <span className="status-badge">{o.status.replace('_', ' ')}</span>
                        </div>
                        <StatusTracker currentStatus={o.status} />
                        <p className="mt-16 text-xs text-black/60 italic font-serif">"{o.description}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="section-title"> Chat with Us</h2>
                <div className="mb-10 space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {history.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.recipient === 'Client' ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm ${m.recipient === 'Client' ? 'bg-neutral-100 text-black rounded-bl-none' : 'bg-black text-white rounded-br-none'}`}>
                        <p className="text-[8px] uppercase font-bold tracking-widest mb-2 opacity-40">{m.recipient === 'Client' ? 'Oguchi Boutique' : 'You'}</p>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="bg-neutral-50 rounded-[2.5rem] p-10 border border-black/[0.03] space-y-6">
                  <select value={messageRecipient} onChange={(e) => setMessageRecipient(e.target.value)} className="w-full bg-white border border-black/5 rounded-full px-6 py-4 text-[9px] font-bold uppercase tracking-widest outline-none">
                    <option value="Tailor & Seamstress">To: Tailor & Seamstress</option>
                    <option value="Customer Service">To: Customer Service</option>
                  </select>
                  <textarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="w-full bg-white border border-black/5 rounded-[2rem] p-8 text-sm outline-none resize-none" placeholder="Inquire about your journey..." rows={3} />
                  <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full shadow-2xl">
                    {loading ? "Dispatching..." : "Dispatch Message"}
                  </button>
                </form>
              </section>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="section-title">Financial Ledger</h2>
                <div className="space-y-8">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-black/5">
                        <th className="py-4 label-dim">Order</th>
                        <th className="py-4 label-dim">Status</th>
                        <th className="py-4 text-right label-dim">Investment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03]">
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="py-6 text-xs font-bold">{o.orderNumber}</td>
                          <td className="py-6"><span className={`text-[8px] uppercase font-bold px-3 py-1 rounded-full ${o.depositPaid ? 'bg-black text-white' : 'bg-red-50 text-red-600'}`}>{o.depositPaid ? 'Confirmed' : 'Pending Deposit'}</span></td>
                          <td className="py-6 text-right text-sm font-serif italic">${o.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length > 0 && (
                    <div className="mt-12 p-10 bg-black text-white rounded-[2.5rem] flex justify-between items-center shadow-2xl">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.3em] opacity-50 font-bold mb-1">Outstanding Balance</p>
                        <p className="text-2xl font-serif italic">${orders.reduce((s, o) => s + (o.isFullyPaid ? 0 : o.totalPrice), 0).toLocaleString()}</p>
                      </div>
                      <button onClick={() => handlePayment(orders[0])} disabled={loading} className="bg-white text-black text-[9px] font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50">Settle Balance</button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="section-title">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* Address Section */}
                  <div className="space-y-6">
                    <p className="label-dim mb-4">Mailing Address</p>
                    <input className="input-field" placeholder="Address" value={addressForm.addressLine1} onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})} />
                    <div className="flex gap-4">
                      <input className="input-field" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} />
                      <input className="input-field" placeholder="Zip" value={addressForm.postalCode} onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})} />
                    </div>
                    {/* FIXED: Added onClick and disabled state */}
                    <button 
                      onClick={handleUpdateAddress} 
                      disabled={loading}
                      className="text-[9px] uppercase tracking-[0.2em] font-bold border-b border-black pb-1 hover:opacity-50 disabled:opacity-30"
                    >
                      {loading ? "Saving..." : "Save Address"}
                    </button>
                  </div>

                  {/* Security Section */}
                  <form onSubmit={handleUpdatePassword} className="space-y-6 md:border-l md:border-black/5 md:pl-12">
                    <p className="label-dim mb-4">Security</p>
                    <input type="password" required className="input-field" placeholder="Current Password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
                    <input type="password" required className="input-field" placeholder="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
                    <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-full disabled:opacity-50 shadow-xl">
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </section>
            )}
          </main>
        </div>
      </Container>

      {/* TOASTS */}
      {(error || success) && (
        <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-right-8 duration-500">
          <div className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl border ${error ? 'bg-white text-red-600 border-red-50' : 'bg-black text-white border-white/10'}`}>
            {error || success}
          </div>
        </div>
      )}

      <style jsx>{`
        .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4em; margin-bottom: 3.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 1.5rem; }
        .label-dim { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(0,0,0,0.3); }
        .input-field { width: 100%; background: transparent; border-bottom: 1px solid rgba(0,0,0,0.08); padding: 1.2rem 0.5rem; font-size: 0.85rem; outline: none; transition: all 0.4s; }
        .input-field:focus { border-color: #000; padding-left: 0.8rem; }
        .status-badge { text-transform: uppercase; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; background: rgba(0,0,0,0.03); padding: 0.25rem 0.75rem; border-radius: 99px; }
        .lux-card-border { background: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 2.5rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`text-left transition-all duration-500 ${active ? "text-black translate-x-2" : "text-black/20 hover:text-black"}`}>
      {label}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-20 text-center bg-neutral-50 rounded-[2.5rem] border border-black/[0.03]">
      <p className="text-[10px] uppercase tracking-widest text-black/20 font-bold">{text}</p>
    </div>
  );
}