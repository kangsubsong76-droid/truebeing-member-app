import React from 'react';
import { Search, CheckCircle, Calendar, ArrowDownToLine } from 'lucide-react';

const AttendanceView = ({
    attendanceSearch,
    handleAttendanceSearch,
    attendanceSearchResults,
    handleAttendanceRecord,
    todayAttendance
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Input */}
                <div className="glass p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-emerald-500" />
                        퀵 출석 체크
                    </h3>
                    <div className="space-y-6">
                        <div className="bg-slate-900/80 p-5 border border-emerald-500/20 rounded-2xl shadow-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="이름 또는 전화번호 뒷자리 입력..."
                                    className="w-full bg-slate-950 border border-slate-700/50 p-4 text-white placeholder:text-slate-600 rounded-xl outline-none focus:ring-2 ring-emerald-500/50 shadow-inner"
                                    value={attendanceSearch}
                                    onChange={e => handleAttendanceSearch(e.target.value)}
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                            </div>
                        </div>

                        {attendanceSearchResults.length > 0 && (
                            <div className="glass overflow-hidden border-emerald-500/30 shadow-2xl animate-in slide-in-from-top-2">
                                {attendanceSearchResults.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => handleAttendanceRecord(m.id)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-emerald-500/10 transition-colors border-b border-white/5 last:border-none group"
                                    >
                                        <div className="text-left">
                                            <p className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{m.name}</p>
                                            <p className="text-xs text-slate-500">{m.phone}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                                            <span>출석</span>
                                            <ArrowDownToLine size={16} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Today Attendance Summary */}
                <div className="glass p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="text-blue-400" />
                        오늘의 출석 현황
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {todayAttendance.length === 0 ? (
                            <div className="py-12 text-center text-slate-500 italic">
                                아직 오늘의 출석 기록이 없습니다.
                            </div>
                        ) : (
                            todayAttendance.map((record, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 glass bg-slate-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                                            {record.members?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{record.members?.name}</p>
                                            <p className="text-[10px] text-slate-500">{record.members?.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400">출석 시간</p>
                                        <p className="text-xs font-mono text-emerald-400">
                                            {new Date(record.check_in_time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
