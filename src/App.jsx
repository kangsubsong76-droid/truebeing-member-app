import React, { useState } from 'react';
import { Users, UserPlus, Settings, PieChart, Search, Bell, LogOut, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 5 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${active ? 'bg-emerald-500/10 border-r-4 border-emerald-500 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
        style={{
            background: active ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)' : 'transparent',
            borderRight: active ? '4px solid #10b981' : 'none',
            color: active ? '#10b981' : undefined
        }}
    >
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
    </motion.button>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('members');

    const stats = [
        { label: '전체 회원', value: '1,280', icon: Users, color: '#3b82f6' },
        { label: '이번 달 신규', value: '+45', icon: UserPlus, color: '#10b981' },
        { label: '출석률', value: '85%', icon: PieChart, color: '#f59e0b' },
        { label: '활동 지수', value: '9.2', icon: Heart, color: '#ef4444' }
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 glass m-4 mr-0 flex flex-col overflow-hidden">
                <div className="p-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span className="gradient-text">TrueBeing</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Management System v1.0</p>
                </div>

                <nav className="flex-1 mt-4">
                    <SidebarLink icon={Users} label="회원 리포트" active={activeTab === 'members'} onClick={() => setActiveTab('members')} />
                    <SidebarLink icon={UserPlus} label="신규 등록" active={activeTab === 'add'} onClick={() => setActiveTab('add')} />
                    <SidebarLink icon={PieChart} label="통계 분석" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
                    <SidebarLink icon={Settings} label="시스템 설정" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>

                <div className="p-6">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full px-2 py-2">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold">회원 관리 대시보드</h2>
                        <p className="text-slate-400 mt-1">오늘은 45명의 회원이 명상 세션에 참여했습니다.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="회원 검색..."
                                className="glass bg-slate-800/50 border-none pl-10 pr-4 py-2 text-sm focus:ring-2 ring-emerald-500/50 w-64 outline-none"
                            />
                        </div>
                        <button className="relative p-2 glass hover:bg-slate-800 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 p-[2px]">
                            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Brian" alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-6 group cursor-pointer hover:bg-slate-800/50 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                >
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-emerald-500 text-xs font-bold">+12%</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Table/List Preview */}
                <section className="glass p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">최근 활동 회원</h3>
                        <button className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">전체 보기</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-800">
                                    <th className="pb-4 font-semibold">회원명</th>
                                    <th className="pb-4 font-semibold">프로그램</th>
                                    <th className="pb-4 font-semibold">참여일</th>
                                    <th className="pb-4 font-semibold">상태</th>
                                    <th className="pb-4 font-semibold text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {[
                                    { name: '김현존', program: '심화 명상 세션', date: '2026.02.18', status: '참가중', color: '#10b981' },
                                    { name: '이정적', program: '기초 입문 과정', date: '2026.02.18', status: '완료', color: '#3b82f6' },
                                    { name: '박고요', program: '개별 1:1 상담', date: '2026.02.17', status: '대기', color: '#f59e0b' }
                                ].map((member, i) => (
                                    <tr key={i} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                                                <span className="font-semibold">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-300">{member.program}</td>
                                        <td className="py-4 text-slate-400 text-sm">{member.date}</td>
                                        <td className="py-4">
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-bold"
                                                style={{ backgroundColor: `${member.color}20`, color: member.color }}
                                            >
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="text-slate-500 hover:text-white transition-colors">상세</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        /* Tailwind-like utilities for quick prototype */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1 1 0%; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .p-8 { padding: 2rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .m-4 { margin: 1rem; }
        .mr-0 { margin-right: 0px; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .w-full { width: 100%; }
        .w-10 { width: 2.5rem; }
        .w-64 { width: 16rem; }
        .h-2 { height: 0.5rem; }
        .h-8 { height: 2rem; }
        .h-10 { height: 2.5rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-xl { border-radius: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-white { color: white; }
        .text-slate-200 { color: #e2e8f0; }
        .text-slate-300 { color: #cbd5e1; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-500 { color: #64748b; }
        .text-emerald-400 { color: #34d399; }
        .text-emerald-500 { color: #10b981; }
        .text-red-400 { color: #f87171; }
        .text-red-500 { color: #ef4444; }
        .bg-slate-800 { background-color: #1e293b; }
        .bg-slate-900 { background-color: #0f172a; }
        .divide-y > * + * { border-top-width: 1px; }
        .divide-slate-800 { border-color: #1e293b; }
        .border-b { border-bottom-width: 1px; }
        .border-slate-800 { border-color: #1e293b; }
        .overflow-hidden { overflow: hidden; }
        .overflow-y-auto { overflow-y: auto; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .left-3 { left: 0.75rem; }
        .top-2 { top: 0.5rem; }
        .right-2 { right: 0.5rem; }
        .top-1/2 { top: 50%; }
        .-translate-y-1/2 { transform: translateY(-50%); }
        .grid { display: grid; }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      ` }} />
        </div>
    );
};

export default App;
