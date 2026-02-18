import React from 'react';
import { MessageSquare, RefreshCw, Send, Phone } from 'lucide-react';

const SMSView = ({ smsLogs, fetchSmsHistory, setIsSmsOpen }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare className="text-emerald-500" />
                            문자 발송 센터
                        </h3>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-6">
                            <p className="text-xs text-emerald-400 font-bold mb-1">발신 번호</p>
                            <p className="font-mono text-emerald-300">{import.meta.env.VITE_ALIGO_SENDER || '미설정'}</p>
                        </div>
                        <button
                            onClick={() => setIsSmsOpen(true)}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            메시지 작성하기
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 glass p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <RefreshCw className="text-blue-400" />
                            최근 발송 내역
                        </h3>
                        <button onClick={fetchSmsHistory} className="text-xs text-slate-400 hover:text-white">전체 보기</button>
                    </div>
                    <div className="space-y-4">
                        {smsLogs.length === 0 ? (
                            <div className="py-20 text-center text-slate-500 italic border-2 border-dashed border-white/5 rounded-2xl">
                                최근 발송된 메시지가 없습니다.
                            </div>
                        ) : (
                            smsLogs.map((log, i) => (
                                <div key={i} className="glass bg-slate-800/30 p-4 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-slate-500 font-mono">{new Date(log.created_at).toLocaleString()}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {log.status === 'success' ? '전송성공' : '실패'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-200 mb-2 truncate">{log.msg}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                        <Phone size={10} />
                                        <span>수신: {log.receiver}</span>
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

export default SMSView;
