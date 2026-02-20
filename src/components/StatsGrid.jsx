import React from 'react';
import { motion } from 'framer-motion';

const StatsGrid = ({ realStats, filterType, setFilterType, setViewAll, setFilteredList, memberList, settings }) => {
    return (
        <div className="space-y-6 mb-10">
            <div className="flex flex-wrap gap-4">
                {realStats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => {
                            setFilterType(stat.filter);
                            const actualMembers = memberList.filter(m => !(m.memo && m.memo.includes('상담')));
                            const consultationMembers = memberList.filter(m => m.memo && m.memo.includes('상담'));

                            switch (stat.filter) {
                                case 'all':
                                    setFilteredList(actualMembers);
                                    break;
                                case 'active':
                                    setFilteredList(actualMembers.filter(m => ['active', '회원', '정상'].includes(m.status)));
                                    break;
                                case 'expiring':
                                    setFilteredList(actualMembers.filter(m => {
                                        if (!m.end_date) return false;
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const endDate = new Date(m.end_date);
                                        const diff = (endDate - today) / (1000 * 60 * 60 * 24);
                                        return diff >= 0 && diff <= 7;
                                    }));
                                    break;
                                case 'expired':
                                    setFilteredList(actualMembers.filter(m => m.status === '만기'));
                                    break;
                                case 'one_time':
                                    setFilteredList(actualMembers.filter(m => m.memo && m.memo.includes('1회')));
                                    break;
                                case 'consultation':
                                    setFilteredList(consultationMembers);
                                    break;
                                case 'leadership':
                                    setFilteredList(actualMembers.filter(m => m.memo && m.memo.includes('지도자')));
                                    break;
                                case 'other':
                                    setFilteredList(actualMembers.filter(m => {
                                        const isKnown = ['active', '회원', '정상', '만기'].includes(m.status) ||
                                            (m.memo && (m.memo.includes('1회') || m.memo.includes('지도자')));
                                        return !isKnown;
                                    }));
                                    break;
                                default:
                                    setFilteredList(actualMembers);
                            }
                        }}
                        className={`premium-card p-6 min-w-[200px] flex-1 group cursor-pointer relative overflow-hidden rounded-3xl ${filterType === stat.filter
                            ? 'bg-white/10 scale-105 z-10 border-emerald-500/50'
                            : `hover:bg-white/5 hover:scale-[1.02] active:scale-95 ${stat.value === '0' || stat.value === 0 ? 'opacity-40 grayscale' : ''}`
                            }`}
                        style={{
                            boxShadow: filterType === stat.filter
                                ? `0 20px 40px -10px ${stat.color}40, inset 0 0 20px ${stat.color}20`
                                : ''
                        }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                            >
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg font-bold mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-extrabold text-white">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {settings?.showAdminMemo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1. Expiring Members */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex flex-col h-full"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest text-[10px]">만기 예정 회원 (7일)</h4>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1 custom-scrollbar">
                            {memberList
                                .filter(m => {
                                    if (!m.end_date) return false;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const endDate = new Date(m.end_date);
                                    const diff = (endDate - today) / (1000 * 60 * 60 * 24);
                                    return diff >= 0 && diff <= 7;
                                })
                                .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
                                .slice(0, 5)
                                .map((m, i) => {
                                    const isSpecial = m.memo && (m.memo.includes('맞춤') || m.memo.includes('체험') || m.memo.includes('1회') || m.memo.includes('원데이'));
                                    return (
                                        <div key={i} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isSpecial
                                            ? 'bg-[#0f172a]/20 border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                                            : 'bg-[#0f172a]/80 border-amber-500/30'
                                            }`}>
                                            <div className="min-w-0 flex-1 mr-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-sm font-bold truncate ${isSpecial ? 'text-slate-500' : 'text-white'}`}>{m.name}</span>
                                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${isSpecial ? 'text-slate-600 bg-white/5' : 'text-amber-200/70 bg-amber-500/10'}`}>{m.status}</span>
                                                </div>
                                                <span className={`text-[11px] font-mono font-bold ${isSpecial ? 'text-slate-600' : 'text-amber-400'}`}>D-Day: {m.end_date}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-[10px] truncate max-w-[80px] ${isSpecial ? 'text-slate-600' : 'text-slate-400'}`}>{m.memo || '-'}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {memberList.filter(m => {
                                if (!m.end_date) return false;
                                const diff = (new Date(m.end_date) - new Date()) / (1000 * 60 * 60 * 24);
                                return diff >= 0 && diff <= 7;
                            }).length === 0 && (
                                    <p className="text-xs text-slate-500 italic py-4 text-center">만기 예정 회원이 없습니다.</p>
                                )}
                        </div>
                    </motion.div>

                    {/* 2. Personal & One-day */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-violet-500/5 border border-violet-500/10 rounded-3xl p-6 flex flex-col h-full"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                            <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest text-[10px]">맞춤상담 및 원데이</h4>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1 custom-scrollbar">
                            {memberList
                                .filter(m => {
                                    const isTarget = m.memo && (m.memo.includes('맞춤') || m.memo.includes('체험') || m.memo.includes('1회') || m.memo.includes('원데이'));
                                    if (!isTarget) return false;
                                    if (!m.end_date) return true;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const endDate = new Date(m.end_date);
                                    const diff = (endDate - today) / (1000 * 60 * 60 * 24);
                                    return diff >= -1 && diff <= 7;
                                })
                                .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
                                .slice(0, 5)
                                .map((m, i) => (
                                    <div key={i} className="bg-[#0f172a]/60 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-[#0f172a] transition-colors">
                                        <div className="min-w-0 flex-1 mr-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-200 truncate">{m.name}</span>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white flex-shrink-0 ${m.memo.includes('원데이') ? 'bg-violet-500' : 'bg-fuchsia-500'}`}>
                                                    {m.memo.includes('원데이') ? '원데이' : '상담'}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-mono">{m.phone}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] text-violet-400 font-bold font-mono">{m.end_date || '날짜 미정'}</span>
                                        </div>
                                    </div>
                                ))
                            }
                            {memberList.filter(m => m.memo && (m.memo.includes('맞춤') || m.memo.includes('체험') || m.memo.includes('1회') || m.memo.includes('원데이'))).length === 0 && (
                                <p className="text-xs text-slate-500 italic py-4 text-center">해당 내역이 없습니다.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* 3. New Registrations (Emerald) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 flex flex-col h-full"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest text-[10px]">신규 등록 회원 (7일)</h4>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1 custom-scrollbar">
                            {memberList
                                .filter(m => {
                                    if (!m.join_date) return false;
                                    const today = new Date();
                                    today.setHours(23, 59, 59, 999);
                                    const joinDate = new Date(m.join_date);
                                    const diff = (today - joinDate) / (1000 * 60 * 60 * 24);
                                    return diff >= 0 && diff <= 7;
                                })
                                .sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
                                .slice(0, 5)
                                .map((m, i) => (
                                    <div key={i} className="bg-[#0f172a]/60 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-[#0f172a] transition-colors">
                                        <div className="min-w-0 flex-1 mr-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-200 truncate">{m.name}</span>
                                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-white bg-emerald-500 flex-shrink-0">NEW</span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-mono truncate block">{m.memo || '일반회원'}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] text-emerald-400 font-bold font-mono">{m.join_date}</span>
                                        </div>
                                    </div>
                                ))
                            }
                            {memberList.filter(m => {
                                if (!m.join_date) return false;
                                const diff = (new Date() - new Date(m.join_date)) / (1000 * 60 * 60 * 24);
                                return diff >= 0 && diff <= 7;
                            }).length === 0 && (
                                    <p className="text-xs text-slate-500 italic py-4 text-center">최근 신규 회원이 없습니다.</p>
                                )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StatsGrid;
