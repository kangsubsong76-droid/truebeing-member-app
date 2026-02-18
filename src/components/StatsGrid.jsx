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
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">최근 관리자 메모 요약</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {memberList
                            .filter(m => m.memo && m.memo.trim().length > 0)
                            .slice(0, 3)
                            .map((m, i) => (
                                <div key={i} className="bg-[#0f172a]/40 p-4 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-slate-200">{m.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{m.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate opacity-80">{m.memo}</p>
                                </div>
                            ))
                        }
                        {memberList.filter(m => m.memo).length === 0 && (
                            <p className="text-xs text-slate-500 italic">표시할 최근 메모가 없습니다.</p>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StatsGrid;
