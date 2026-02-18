import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Bell, X, AlertTriangle, Send } from 'lucide-react';

const NotificationModal = ({ memberList, setIsNotifyOpen, setSelectedMember, setIsSmsOpen }) => {
    const expiringMembers = memberList.filter(m => {
        if (!m.end_date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(m.end_date);
        const diff = (endDate - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
    });

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 99999,
                backgroundColor: 'rgba(5, 11, 24, 0.98)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}
            onClick={() => setIsNotifyOpen(false)}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="w-full max-w-md bg-[#0f172a]/95 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative backdrop-blur-xl"
                onClick={e => e.stopPropagation()}
                style={{
                    fontFamily: "'GmarketSansMedium', sans-serif",
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    outline: '1px solid rgba(16, 185, 129, 0.1)'
                }}
            >
                {/* Modal Header */}
                <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                            <Bell size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white" style={{ margin: 0 }}>중요 알림</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest" style={{ margin: '6px 0 0 0' }}>Urgent Alerts</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsNotifyOpen(false)}
                        className="text-slate-500 hover:text-white p-3 hover:bg-white/5 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* List Content */}
                <div className="p-10 max-h-[50vh] overflow-y-auto space-y-4 custom-scrollbar">
                    {expiringMembers.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-slate-500 font-bold text-sm italic opacity-60">현재 새로운 알림이 없습니다.</p>
                        </div>
                    ) : (
                        expiringMembers.map(m => (
                            <div key={m.id} className="p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <p className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors text-lg" style={{ margin: 0 }}>{m.name}</p>
                                        <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-mono" style={{ margin: 0 }}>만기일: <span className="text-emerald-500/80 font-bold">{m.end_date}</span></p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedMember(m);
                                        setIsSmsOpen(true);
                                        setIsNotifyOpen(false);
                                    }}
                                    className="p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl transition-all active:scale-95"
                                    title="안내 문자 발송"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-900/50 border-t border-white/5">
                    <button
                        onClick={() => setIsNotifyOpen(false)}
                        className="w-full py-4 text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.3em]"
                    >
                        닫기
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default NotificationModal;
