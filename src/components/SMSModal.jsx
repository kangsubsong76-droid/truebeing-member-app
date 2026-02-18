import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, MessageSquare, RefreshCw, Send, ChevronRight, Clock } from 'lucide-react';

const SMSModal = ({
    isSmsOpen,
    setIsSmsOpen,
    selectedMember,
    selectedIds,
    filteredList,
    smsMessage,
    setSmsMessage,
    handleSendSms,
    isSendingSms
}) => {
    const [templates, setTemplates] = useState(() => {
        const saved = localStorage.getItem('sms_templates');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: '만기 안내', content: '[트루빙] 안녕하세요 {name}님, 멤버십 만기일({end_date})이 다가와 안내 드립니다.' },
            { id: 2, title: '정기 휴무', content: '[트루빙] 이번 주 일요일은 정기 휴무일입니다. 이용에 참고 부탁드립니다.' },
            { id: 3, title: '수업 공지', content: '[트루빙] 금일 수업은 오후 7시에 시작됩니다. 늦지 않게 방문해 주세요.' }
        ];
    });

    const saveTemplates = (newTemplates) => {
        setTemplates(newTemplates);
        localStorage.setItem('sms_templates', JSON.stringify(newTemplates));
    };

    const applyTemplate = (content) => {
        let text = content;
        if (selectedMember) {
            text = text.replace('{name}', selectedMember.name || '')
                .replace('{end_date}', selectedMember.end_date || '');
        }
        setSmsMessage(text);
    };

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
                zIndex: 99998,
                backgroundColor: 'rgba(5, 11, 24, 0.98)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}
            onClick={() => setIsSmsOpen(false)}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full max-w-5xl bg-[#0f172a]/98 rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative flex flex-col md:flex-row backdrop-blur-2xl"
                style={{
                    height: 'auto',
                    maxHeight: '90vh',
                    fontFamily: "'GmarketSansMedium', sans-serif",
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    outline: '1px solid rgba(16, 185, 129, 0.1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button (Universal) */}
                <button
                    onClick={() => setIsSmsOpen(false)}
                    className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all p-3 hover:bg-white/10 rounded-full z-[100]"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Message Editor */}
                <div className="flex-1 p-10 md:p-16 border-r border-white/5 overflow-y-auto">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white" style={{ margin: 0 }}>문자 메시지 작성</h3>
                            <p className="text-slate-500 text-sm font-bold" style={{ margin: '6px 0 0 0' }}>알리고 시스템을 통한 실시간 전송</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">수신인</label>
                            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
                                <span className="text-emerald-400 font-black text-xl">
                                    {selectedMember
                                        ? `${selectedMember.name} (개별 전송)`
                                        : selectedIds.size > 0
                                            ? `${selectedIds.size}명 (선택 회원)`
                                            : `${filteredList.length}명 (리스트 전체)`}
                                </span>
                                {selectedMember && (
                                    <p className="text-slate-500 text-sm mt-1 font-mono" style={{ margin: '4px 0 0 0' }}>{selectedMember.phone}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">메시지 본문 내용</label>
                                <div className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] text-emerald-400 font-mono font-bold border border-emerald-500/20">
                                    {smsMessage.length} / 90자 (SMS 기준)
                                </div>
                            </div>
                            <textarea
                                className="w-full bg-[#1e293b]/50 border border-white/10 rounded-3xl p-8 text-xl text-white placeholder:text-slate-600 focus:ring-4 ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all resize-none shadow-inner"
                                style={{
                                    minHeight: '350px',
                                    color: '#ffffff'
                                }}
                                placeholder="이곳에 내용을 입력하세요..."
                                value={smsMessage}
                                onChange={e => setSmsMessage(e.target.value)}
                                disabled={isSendingSms}
                            ></textarea>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                className="flex-1 flex items-center justify-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-6 px-10 rounded-2xl font-black text-xl transition-all active:scale-95 disabled:opacity-50"
                                onClick={handleSendSms}
                                disabled={isSendingSms || !smsMessage.trim()}
                            >
                                {isSendingSms ? <RefreshCw size={24} className="animate-spin" /> : <Send size={24} />}
                                {isSendingSms ? '발송 중...' : '지금 발송하기'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Templates */}
                <div className="w-full md:w-[350px] bg-slate-900/30 p-8 md:p-12 overflow-y-auto flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <Clock size={16} className="text-emerald-500" />
                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest" style={{ margin: 0 }}>자주 쓰는 템플릿</h4>
                    </div>

                    <div className="space-y-4 flex-1">
                        {templates.map((tpl) => (
                            <button
                                key={tpl.id}
                                onClick={() => applyTemplate(tpl.content)}
                                className="w-full text-left p-5 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-2xl group transition-all"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-black text-white group-hover:text-emerald-400">{tpl.title}</span>
                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400" />
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 line-clamp-2" style={{ margin: 0 }}>{tpl.content}</p>
                            </button>
                        ))}
                    </div>

                    <button
                        className="mt-10 w-full p-5 border border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl text-xs font-black text-slate-500 hover:text-emerald-400 transition-all text-center"
                        onClick={() => {
                            const title = prompt('템플릿 제목을 입력하세요');
                            const content = prompt('메시지 내용을 입력하세요\n({name}, {end_date} 입력 시 자동 치환됨)');
                            if (title && content) {
                                saveTemplates([...templates, { id: Date.now(), title, content }]);
                            }
                        }}
                    >
                        + 새 템플릿 추가
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default SMSModal;
