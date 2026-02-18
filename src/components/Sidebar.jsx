import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Settings, PieChart as PieChartIcon, MessageSquare, LogOut, CheckCircle, X } from 'lucide-react';

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 5 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${active ? 'bg-emerald-500/10 border-r-4 border-emerald-500 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
        style={{
            background: active ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)' : 'transparent',
            borderRight: active ? '4px solid #10b981' : 'none',
        }}
    >
        <Icon size={22} />
        <span className="text-[17px] font-black tracking-tight">{label}</span>
    </motion.button>
);

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, centerName, settings, setSettings }) => {
    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleItem = ({ label, active, onToggle }) => (
        <div className="flex items-center justify-between px-6 py-2.5 group cursor-pointer" onClick={onToggle}>
            <span className={`text-[13px] font-bold transition-colors ${active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {label}
            </span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );

    return (
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out lg:flex w-72 bg-[#050b18]/70 lg:bg-transparent glass m-0 lg:m-6 lg:mr-0 flex-col overflow-hidden fixed lg:relative z-[100] h-screen lg:h-[calc(100vh-3rem)] sidebar-border lg:rounded-[2.5rem] shadow-2xl`}>
            <div className="p-8 relative">
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-red-400"
                >
                    <X size={24} />
                </button>
                <h1 className="text-2xl font-bold flex flex-col">
                    <span className="gradient-text">{centerName || '현존명상센터'}</span>
                    <span className="text-sm text-slate-300">멤버십 시스템</span>
                </h1>
                <p className="text-xs text-slate-500 mt-2">Management v1.0.5</p>
            </div>

            <nav className="flex-1 mt-4">
                <div className="px-6 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">메인 메뉴</div>
                <SidebarLink icon={Users} label="회원 리포트" active={activeTab === 'members'} onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }} />
                <SidebarLink icon={CheckCircle} label="출석 체크" active={activeTab === 'attendance'} onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }} />
                <SidebarLink icon={MessageSquare} label="메시지 발송" active={activeTab === 'sms'} onClick={() => { setActiveTab('sms'); setIsSidebarOpen(false); }} />
                <SidebarLink icon={UserPlus} label="신규 등록" active={activeTab === 'add'} onClick={() => { setActiveTab('add'); setIsSidebarOpen(false); }} />
                <SidebarLink icon={PieChartIcon} label="통계 분석" active={activeTab === 'stats'} onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }} />
                <SidebarLink icon={Settings} label="시스템 설정" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} />

                <div className="mt-10 pt-6 border-t border-white/5">
                    <div className="px-6 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">빠른 설정</div>
                    <ToggleItem
                        label="실시간 업데이트"
                        active={settings?.realtimeUpdate}
                        onToggle={() => handleToggle('realtimeUpdate')}
                    />
                    <ToggleItem
                        label="프로필 사진 표시"
                        active={settings?.showPhotos}
                        onToggle={() => handleToggle('showPhotos')}
                    />
                    <ToggleItem
                        label="관리자 메모 요약"
                        active={settings?.showAdminMemo}
                        onToggle={() => handleToggle('showAdminMemo')}
                    />
                    <ToggleItem
                        label="일괄 선택 기능"
                        active={settings?.showSelection}
                        onToggle={() => handleToggle('showSelection')}
                    />
                </div>
            </nav>

            <div className="p-6">
                <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full px-2 py-2">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">로그아웃</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
