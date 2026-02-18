import React from 'react';
import { UserPlus } from 'lucide-react';

const AddMemberView = ({ newMember, setNewMember, handleAddNewMember, isLoading }) => {
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass p-8">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <UserPlus className="text-emerald-500" />
                    신규 회원 등록
                </h3>
                <form onSubmit={handleAddNewMember} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">이름 *</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-xl outline-none focus:ring-2 ring-emerald-500/50 text-white font-medium placeholder:text-slate-600 transition-all"
                                value={newMember.name}
                                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                placeholder="홍길동"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">연락처 *</label>
                            <input
                                required
                                type="text"
                                className="w-full glass bg-slate-800/50 border-none p-3 rounded-xl outline-none focus:ring-2 ring-emerald-500/50"
                                value={newMember.phone}
                                onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                placeholder="010-0000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">상태</label>
                            <select
                                className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-xl outline-none focus:ring-2 ring-emerald-500/50 text-white font-medium"
                                value={newMember.status}
                                onChange={e => setNewMember({ ...newMember, status: e.target.value })}
                            >
                                <option value="회원" className="bg-slate-900">정규 회원</option>
                                <option value="만기" className="bg-slate-900">만기 회원</option>
                                <option value="상담" className="bg-slate-900">상담중</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">성별</label>
                            <div className="flex gap-2">
                                {['남', '여', '모름'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setNewMember({ ...newMember, gender: g })}
                                        className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${newMember.gender === g ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-transparent text-slate-500'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">가입일</label>
                            <input
                                type="date"
                                className="w-full glass bg-slate-800/50 border-none p-3 rounded-xl outline-none"
                                value={newMember.join_date}
                                onChange={e => setNewMember({ ...newMember, join_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">만기일</label>
                            <input
                                type="date"
                                className="w-full glass bg-slate-800/50 border-none p-3 rounded-xl outline-none"
                                value={newMember.end_date}
                                onChange={e => setNewMember({ ...newMember, end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">맴버십 타입</label>
                        <textarea
                            className="w-full glass bg-slate-800/50 border-none p-3 rounded-xl outline-none h-24"
                            value={newMember.memo}
                            onChange={e => setNewMember({ ...newMember, memo: e.target.value })}
                            placeholder="맴버십 종류 입력 (예: 정규, 지도자반...)"
                        ></textarea>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full btn-primary py-4 text-lg font-bold">
                        {isLoading ? '저장 중...' : '회원 원부에 추가하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMemberView;
