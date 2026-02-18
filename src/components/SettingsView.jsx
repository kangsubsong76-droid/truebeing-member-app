import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Database, Bell, Save, ShieldCheck, Cpu, Cloud, Trash2, Download } from 'lucide-react';

const SettingsView = ({ settings, setSettings }) => {
    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleExportSettings = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "system_settings.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleResetSystem = () => {
        if (confirm('모든 시스템 설정이 초기화됩니다. 계속하시겠습니까?')) {
            localStorage.removeItem('system_settings');
            window.location.reload();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto space-y-10 pb-20 p-4 lg:p-0"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 px-4">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                        <Settings className="text-emerald-500" size={42} />
                        시스템 설정
                    </h2>
                    <p className="text-slate-500 font-bold mt-3 uppercase tracking-[0.3em] text-[10px]">System configuration & Intelligence</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <a
                        href="https://docs.google.com/spreadsheets/d/1n2gctc0D8oLqQUgklAMFG1dcT6vXYaF7towjwqeQ_Hs"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-[#050b18] rounded-2xl font-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95"
                    >
                        <Cloud size={20} />
                        구글 시트 바로가기
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div variants={itemVariants} className="glass rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -mr-64 -mt-64 group-hover:bg-emerald-500/10 transition-all duration-700"></div>

                        <h3 className="text-xl font-black text-white flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                            <Cpu size={26} className="text-emerald-500" />
                            시스템 기본 설정
                        </h3>

                        <div className="space-y-12">
                            <div>
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-8 px-1">기능 제어 및 사용자 환경</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 'realtimeUpdate', label: '실시간 업데이트', desc: '데이터 연동 상태를 실시간으로 대시보드에 반영합니다.' },
                                        { id: 'showPhotos', label: '프로필 아바타 표시', desc: '회원 목록 및 상세 모달에 사진/이니셜을 노출합니다.' },
                                        { id: 'showAdminMemo', label: '관리자 메모 공개', desc: '대시보드 요약 및 테이블에 관리 메모 컬럼을 포함합니다.' },
                                        { id: 'showSelection', label: '일괄 선택 토글', desc: '회원 목록에서 여러 명을 선택할 수 있는 기능을 켭니다.' }
                                    ].map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => handleToggle(opt.id)}
                                            className={`p-7 rounded-[2rem] border transition-all duration-500 cursor-pointer flex justify-between items-center relative overflow-hidden group/opt ${settings[opt.id]
                                                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.1)]'
                                                : 'bg-[#050b18]/40 border-white/5 hover:border-white/10 hover:bg-[#050b18]/60'
                                                }`}
                                        >
                                            <div className="relative z-10 pointer-events-none">
                                                <p className={`font-black text-base mb-1.5 ${settings[opt.id] ? 'text-emerald-400' : 'text-slate-300'}`}>{opt.label}</p>
                                                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{opt.desc}</p>
                                            </div>
                                            <div className={`relative z-10 w-14 h-7 rounded-full p-1.5 transition-all duration-500 ${settings[opt.id] ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-500 transform ${settings[opt.id] ? 'translate-x-[30px]' : 'translate-x-0'}`}></div>
                                            </div>
                                            {settings[opt.id] && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/5">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-8 px-1">모바일 네비게이션 스타일</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 'drawer', label: '드로워 메뉴', desc: '기존 왼쪽 사이드바 형태 (버튼으로 열기)' },
                                        { id: 'bottom', label: '하단 바 메뉴', desc: '스마트폰 하단에 고정된 메뉴 (화면 넓게 사용)' }
                                    ].map(style => (
                                        <div
                                            key={style.id}
                                            onClick={() => setSettings(prev => ({ ...prev, mobileNavStyle: style.id }))}
                                            className={`p-7 rounded-[2rem] border transition-all duration-500 cursor-pointer flex flex-col gap-2 relative overflow-hidden group/opt ${settings.mobileNavStyle === style.id
                                                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.1)]'
                                                : 'bg-[#050b18]/40 border-white/5 hover:border-white/10 hover:bg-[#050b18]/60'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <p className={`font-black text-base ${settings.mobileNavStyle === style.id ? 'text-emerald-400' : 'text-slate-300'}`}>{style.label}</p>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${settings.mobileNavStyle === style.id ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700'}`}>
                                                    {settings.mobileNavStyle === style.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{style.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Data Backup Card */}
                    <motion.div variants={itemVariants} className="glass rounded-[3rem] p-10">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                            <ShieldCheck className="text-rose-500" size={26} />
                            데이터 관리 및 보안 핵심
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={handleExportSettings}
                                className="flex flex-col items-start gap-4 p-8 bg-[#050b18]/40 hover:bg-[#050b18]/60 border border-white/5 hover:border-white/20 rounded-[2rem] text-left transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                                    <Download size={22} className="text-slate-400 group-hover:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white mb-1">시스템 설정 백업</p>
                                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">모든 설정을 JSON 파일로 내보냅니다.</p>
                                </div>
                            </button>
                            <button
                                onClick={handleResetSystem}
                                className="flex flex-col items-start gap-4 p-8 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 rounded-[2rem] text-left transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                <div className="p-3 bg-rose-500/10 rounded-xl group-hover:bg-rose-500/20 transition-colors">
                                    <Trash2 size={22} className="text-rose-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-rose-400 mb-1">로컬 설정 초기화</p>
                                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">브라우저의 모든 설정을 기본값으로 되돌립니다.</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: API Status */}
                <div className="space-y-8">
                    <motion.div variants={itemVariants} className="glass rounded-[3rem] p-9">
                        <h3 className="text-lg font-black text-white flex items-center gap-3 mb-10">
                            <Cloud className="text-sky-400" size={22} />
                            API 연동 현황
                        </h3>

                        <div className="space-y-6">
                            <div className="p-7 bg-[#050b18]/60 border border-emerald-500/20 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 px-1">Aligo Message Service</p>
                                <p className="text-xs text-slate-300 font-bold leading-relaxed mb-6">서버와 안정적인 데이터 통신이 유지되고 있습니다.</p>
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                        <span className="text-slate-500">USER ID</span>
                                        <span className="text-emerald-400/80 font-bold">{import.meta.env.VITE_ALIGO_USER_ID || 'ALIGO_DEMO'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                        <span className="text-slate-500">API KEY</span>
                                        <span className="text-emerald-400/80 font-bold">●●●●●{import.meta.env.VITE_ALIGO_API_KEY?.slice(-4) || 'KEY'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-7 bg-[#050b18]/60 border border-blue-500/20 rounded-[2rem] group">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-1">Supabase DB</p>
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-full border border-blue-500/20">CONNECTED</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold px-1">클라우드 데이터베이스 상태 양호</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="p-9 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10 font-bold leading-relaxed px-1">
                            <h4 className="text-sm font-black text-emerald-400 mb-3 flex items-center gap-2">
                                <Database size={16} />
                                시스템 업데이트
                            </h4>
                            <p className="text-[11px] text-slate-400 tracking-tight opacity-90">빌드 v1.0.5 정식 배포 버전입니다. 모든 변경사항은 브라우저 공간에 안전하게 영구 보존됩니다.</p>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Database size={100} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsView;
