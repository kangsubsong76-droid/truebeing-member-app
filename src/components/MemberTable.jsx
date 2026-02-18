import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, ArrowDownToLine, Users, RefreshCw } from 'lucide-react';

const MemberTable = ({
    filterType,
    filteredList,
    memberList,
    setFilterType,
    setFilteredList,
    selectedIds,
    setSelectedIds,
    colFilters,
    setColFilters,
    activeColFilter,
    setActiveColFilter,
    sortConfig,
    setSortConfig,
    isLoading,
    setSelectedMember,
    settings
}) => {
    const getHeaderTitle = () => {
        switch (filterType) {
            case 'active': return '유효 회원 목록';
            case 'expiring': return '만기 예정 회원 목록 (7일 이내)';
            case 'expired': return '마감 회원 목록';
            case 'one_time': return '1회 수강권 회원 목록';
            case 'consultation': return '상담전화 목록';
            case 'leadership': return '지도자반 회원 목록';
            case 'other': return '기타 회원 목록';
            case 'search': return '검색 결과';
            default: return '전체 회원 목록';
        }
    };

    return (
        <section className="glass p-8 relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3">
                    {getHeaderTitle()}
                    <span className="text-sm text-slate-500 font-normal">
                        ({filteredList.length}명 표시 중)
                    </span>
                    {filterType !== 'all' && (
                        <button
                            onClick={() => { setFilterType('all'); setFilteredList(memberList); }}
                            className="px-2 py-1 text-[10px] border border-slate-600 rounded text-slate-400 hover:text-white transition-colors"
                        >
                            필터 해제
                        </button>
                    )}
                </h3>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div
                        className="grid gap-4 px-4 py-6 text-slate-400 text-sm font-black uppercase tracking-widest border-b border-slate-800/50 items-center"
                        style={{
                            gridTemplateColumns: `${settings?.showSelection ? '50px ' : ''}${settings?.showPhotos ? '60px ' : ''}1fr 1.5fr 1fr 1fr ${settings?.showAdminMemo ? '1.5fr ' : ''}1fr 1fr 1.5fr 80px`
                        }}
                    >
                        {settings?.showSelection && (
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        if (selectedIds.size === filteredList.length) {
                                            setSelectedIds(new Set());
                                        } else {
                                            setSelectedIds(new Set(filteredList.map(m => m.id)));
                                        }
                                    }}
                                    className="bg-transparent border-none p-0 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all outline-none"
                                >
                                    {filteredList.length > 0 && selectedIds.size === filteredList.length ? <CheckSquare size={22} className="text-emerald-500" /> : <Square size={22} />}
                                </button>
                            </div>
                        )}

                        {settings?.showPhotos && <div className="text-center">사진</div>}

                        {[
                            { key: 'name', label: '이름' },
                            { key: 'phone', label: '전화번호' },
                            { key: 'status', label: '상태' },
                            { key: 'gender', label: '성별' },
                            ...(settings?.showAdminMemo ? [{ key: 'memo', label: '타입' }] : []),
                            { key: 'join_date', label: '등록일' },
                            { key: 'end_date', label: '마감일' },
                            { key: 'address', label: '주소' }
                        ].map((col) => (
                            <div key={col.key} className="relative group/header">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => setActiveColFilter(activeColFilter === col.key ? null : col.key)}>
                                    {col.label}
                                    <ArrowDownToLine size={12} className={`opacity-30 group-hover/header:opacity-100 transition-opacity transform ${activeColFilter === col.key ? 'rotate-180 opacity-100 text-emerald-500' : ''}`} />
                                    {colFilters[col.key] && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>}
                                </div>

                                <AnimatePresence>
                                    {activeColFilter === col.key && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[200] rounded-2xl py-2 max-h-64 overflow-y-auto backdrop-blur-3xl"
                                            style={{
                                                backgroundColor: '#0f172a',
                                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                                outline: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <div className="px-3 pb-2 border-b border-white/5">
                                                <input
                                                    type="text"
                                                    placeholder="필터 검색..."
                                                    className="w-full bg-slate-900/50 text-white text-[11px] p-2 rounded-lg border border-white/5 outline-none focus:ring-1 ring-emerald-500"
                                                    value={colFilters[col.key]}
                                                    onChange={(e) => setColFilters({ ...colFilters, [col.key]: e.target.value })}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="p-1 border-b border-white/5">
                                                <button
                                                    onClick={() => { setSortConfig({ key: col.key, direction: 'asc' }); setActiveColFilter(null); }}
                                                    className={`w-full text-left px-3 py-2 bg-transparent hover:bg-white/10 text-[11px] font-bold rounded-lg flex items-center gap-2 transition-all ${sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-emerald-400' : 'text-slate-200'}`}
                                                >
                                                    오름차순 정렬
                                                </button>
                                                <button
                                                    onClick={() => { setSortConfig({ key: col.key, direction: 'desc' }); setActiveColFilter(null); }}
                                                    className={`w-full text-left px-3 py-2 bg-transparent hover:bg-white/10 text-[11px] font-bold rounded-lg flex items-center gap-2 transition-all ${sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-emerald-400' : 'text-slate-200'}`}
                                                >
                                                    내림차순 정렬
                                                </button>
                                            </div>
                                            <div className="p-1">
                                                <button
                                                    onClick={() => { setColFilters({ ...colFilters, [col.key]: '' }); setActiveColFilter(null); }}
                                                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-[10px] text-slate-500 font-bold rounded transition-colors"
                                                >
                                                    초기화
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                        <div className="text-right">상세정보</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-800/20 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-4">
                                <RefreshCw className="animate-spin text-emerald-500" size={32} />
                                <p className="text-sm font-bold">로딩 중...</p>
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="py-20 text-center text-slate-500">
                                <Users size={48} className="mx-auto mb-4 opacity-10" />
                                <p className="text-sm">데이터가 없습니다.</p>
                            </div>
                        ) : (
                            filteredList
                                .filter(m => Object.keys(colFilters).every(k => !colFilters[k] || String(m[k] || '').toLowerCase().includes(colFilters[k].toLowerCase())))
                                .sort((a, b) => {
                                    // Custom sort: Push consultation to the end
                                    const isConsultA = a.memo && a.memo.includes('상담');
                                    const isConsultB = b.memo && b.memo.includes('상담');
                                    if (isConsultA && !isConsultB) return 1;
                                    if (!isConsultA && isConsultB) return -1;

                                    if (!sortConfig.key) return 0;
                                    const vA = a[sortConfig.key] || '';
                                    const vB = b[sortConfig.key] || '';
                                    return sortConfig.direction === 'asc' ? (vA < vB ? -1 : 1) : (vA > vB ? -1 : 1);
                                })
                                .map((member) => (
                                    <div
                                        key={member.id}
                                        className="grid gap-4 px-4 py-6 hover:bg-white/5 items-center text-sm border-b border-white/[0.03] last:border-none group/row transition-colors"
                                        style={{
                                            gridTemplateColumns: `${settings?.showSelection ? '50px ' : ''}${settings?.showPhotos ? '60px ' : ''}1fr 1.5fr 1fr 1fr ${settings?.showAdminMemo ? '1.5fr ' : ''}1fr 1fr 1.5fr 80px`
                                        }}
                                    >
                                        {settings?.showSelection && (
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => {
                                                        const next = new Set(selectedIds);
                                                        if (next.has(member.id)) next.delete(member.id);
                                                        else next.add(member.id);
                                                        setSelectedIds(next);
                                                    }}
                                                    className="bg-transparent border-none p-0 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-all outline-none"
                                                >
                                                    {selectedIds.has(member.id) ? <CheckSquare size={20} className="text-emerald-500" /> : <Square size={20} />}
                                                </button>
                                            </div>
                                        )}

                                        {settings?.showPhotos && (
                                            <div className="flex justify-center">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500 bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
                                                    {member.name?.[0]}
                                                </div>
                                            </div>
                                        )}

                                        <div className="font-black text-slate-100">{member.name}</div>
                                        <div className="text-slate-400 font-mono tracking-tighter">{member.phone}</div>
                                        <div>
                                            {(() => {
                                                const isActive = ['active', '회원', '정상'].includes(member.status);
                                                const isExpired = member.status === '만기';

                                                let bgColor = 'bg-slate-500/10';
                                                let textColor = 'text-slate-400';
                                                let borderColor = 'border-slate-500/20';

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
                                                            {member.status}
                                                        </span>
                                                    );
                                                } else if (isExpired) {
                                                    bgColor = 'bg-rose-500/20';
                                                    textColor = 'text-rose-400';
                                                    borderColor = 'border-rose-500/40';
                                                }

                                                return (
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${bgColor} ${textColor} ${borderColor}`}>
                                                        {member.status}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <div className="text-slate-400 text-center">{member.gender || '-'}</div>

                                        {settings?.showAdminMemo && (
                                            <div>
                                                {(() => {
                                                    const memo = member.memo || '';
                                                    let color = '#94a3b8'; // default slate

                                                    if (memo.includes('상담')) color = '#6366f1';
                                                    else if (memo.includes('1회')) color = '#8b5cf6';
                                                    else if (memo.includes('지도자')) color = '#f472b6';

                                                    return (
                                                        <div
                                                            className="truncate text-sm font-black text-center px-2 py-1 rounded-lg"
                                                            style={{
                                                                color: color,
                                                                backgroundColor: `${color}15`,
                                                                border: `1px solid ${color}30`
                                                            }}
                                                        >
                                                            {member.memo || '-'}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        <div className="text-slate-500 font-mono text-[11px]">{member.join_date}</div>
                                        <div className="text-slate-500 font-mono text-[11px]">{member.end_date}</div>
                                        <div className="text-slate-500 truncate text-xs">{member.address}</div>
                                        <div className="text-right">
                                            <button
                                                onClick={() => setSelectedMember(member)}
                                                className="px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[11px] font-black cursor-pointer active:scale-95 transition-all"
                                            >
                                                보기
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MemberTable;
