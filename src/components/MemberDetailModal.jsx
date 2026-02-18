import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, User, Phone, MapPin, Calendar, FileText, Edit2, Trash2, MessageSquare } from 'lucide-react';

const MemberDetailModal = ({
    selectedMember,
    setSelectedMember,
    isEditingMember,
    setIsEditingMember,
    editForm,
    setEditForm,
    handleUpdateMember,
    handleDeleteMember,
    setIsSmsOpen,
    isLoading,
    settings
}) => {
    if (!selectedMember) return null;

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
                zIndex: 99997,
                backgroundColor: 'rgba(5, 11, 24, 0.98)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}
            onClick={() => setSelectedMember(null)}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[#0f172a]/95 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative backdrop-blur-xl"
                onClick={e => e.stopPropagation()}
                style={{
                    fontFamily: "'GmarketSansMedium', sans-serif",
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    outline: '1px solid rgba(16, 185, 129, 0.1)'
                }}
            >
                {/* Header Section */}
                <div className="bg-[#1e293b]/30 p-8 border-b border-white/5 relative">
                    <button
                        onClick={() => setSelectedMember(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-all p-2 hover:bg-white/10 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-6">
                        {settings?.showPhotos ? (
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-4xl font-black text-slate-400 bg-gradient-to-br from-white/[0.03] to-white/[0.01] shadow-xl">
                                {selectedMember.name?.[0]}
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center text-slate-600">
                                <User size={32} />
                            </div>
                        )}
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2" style={{ margin: 0 }}>{selectedMember.name}</h2>
                            <div className="flex items-center gap-2 text-slate-400 font-mono font-bold" style={{ marginTop: '8px' }}>
                                <Phone size={16} />
                                <span>{selectedMember.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status Card */}
                        <div className="col-span-2 glass p-5 flex justify-between items-center bg-white/5 rounded-xl border border-white/5 mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">현재 상태</span>
                            {isEditingMember ? (
                                <select
                                    className="bg-slate-800 text-white px-3 py-1 rounded-lg border-none outline-none focus:ring-1 ring-emerald-500"
                                    value={editForm.status || '회원'}
                                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                >
                                    <option value="회원">회원</option>
                                    <option value="만기">만기</option>
                                    <option value="보류">보류</option>
                                </select>
                            ) : (
                                (() => {
                                    const isActive = ['active', '회원', '정상'].includes(selectedMember.status);
                                    if (isActive) {
                                        return (
                                            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase border transition-all"
                                                style={{
                                                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                                    color: '#10b981',
                                                    borderColor: 'rgba(16, 185, 129, 0.15)',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {selectedMember.status}
                                            </span>
                                        );
                                    }
                                    return (
                                        <span className="px-4 py-1 rounded-lg text-xs font-black border bg-rose-500/10 text-rose-500 border-rose-500/20">
                                            {selectedMember.status}
                                        </span>
                                    );
                                })()
                            )}
                        </div>

                        {/* Gender */}
                        <div className="p-5 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <User size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">성별</span>
                            </div>
                            {isEditingMember ? (
                                <select
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg text-sm"
                                    value={editForm.gender || '모름'}
                                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                >
                                    <option value="여">여</option>
                                    <option value="남">남</option>
                                    <option value="모름">모름</option>
                                </select>
                            ) : (
                                <p className="text-lg font-bold text-slate-200" style={{ margin: 0 }}>{selectedMember.gender || '-'}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="p-5 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">주소</span>
                            </div>
                            {isEditingMember ? (
                                <input
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg text-sm"
                                    value={editForm.address || ''}
                                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                />
                            ) : (
                                <p className="text-lg font-bold text-slate-200 truncate" style={{ margin: 0 }}>{selectedMember.address || '-'}</p>
                            )}
                        </div>

                        {/* Join Date */}
                        <div className="p-5 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">등록일</span>
                            </div>
                            {isEditingMember ? (
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg text-sm"
                                    value={editForm.join_date || ''}
                                    onChange={e => setEditForm({ ...editForm, join_date: e.target.value })}
                                />
                            ) : (
                                <p className="text-lg font-black text-slate-200 font-mono tracking-tighter" style={{ margin: 0 }}>{selectedMember.join_date || '-'}</p>
                            )}
                        </div>

                        {/* End Date */}
                        <div className="p-5 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">마감일</span>
                            </div>
                            {isEditingMember ? (
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg text-sm"
                                    value={editForm.end_date || ''}
                                    onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                                />
                            ) : (
                                <p className="text-lg font-black text-slate-200 font-mono tracking-tighter" style={{ margin: 0 }}>{selectedMember.end_date || '-'}</p>
                            )}
                        </div>

                        {/* Memo */}
                        <div className="col-span-2 p-5 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <FileText size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">멤버십 타입 및 메모</span>
                            </div>
                            {isEditingMember ? (
                                <textarea
                                    className="w-full bg-slate-800 text-white p-3 rounded-xl border-none outline-none focus:ring-1 ring-emerald-500 h-24 resize-none text-sm"
                                    value={editForm.memo || ''}
                                    onChange={e => setEditForm({ ...editForm, memo: e.target.value })}
                                />
                            ) : (
                                <p className="text-sm font-bold text-slate-300 leading-relaxed whitespace-pre-wrap" style={{ margin: 0 }}>{selectedMember.memo || '-'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 bg-slate-900/50 border-t border-white/5 flex gap-3">
                    {isEditingMember ? (
                        <>
                            <button
                                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 text-base"
                                onClick={handleUpdateMember}
                                disabled={isLoading}
                            >
                                {isLoading ? '저장 중...' : '저장'}
                            </button>
                            <button
                                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black transition-all"
                                onClick={() => setIsEditingMember(false)}
                            >
                                취소
                            </button>
                            <button
                                className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl font-black transition-all"
                                onClick={handleDeleteMember}
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="flex-[1.5] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                                onClick={() => { setIsSmsOpen(true); setSelectedMember(null); }}
                            >
                                <MessageSquare size={20} />
                                문자 발송
                            </button>
                            <button
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                                onClick={() => {
                                    setIsEditingMember(true);
                                    setEditForm({ ...selectedMember });
                                }}
                            >
                                <Edit2 size={20} />
                                정보 수정
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default MemberDetailModal;
