import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, MessageSquare, PieChart as PieChartIcon, Settings, CheckCircle } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'members', icon: Users, label: '회원' },
        { id: 'attendance', icon: CheckCircle, label: '출석' },
        { id: 'sms', icon: MessageSquare, label: '메시지' },
        { id: 'add', icon: UserPlus, label: '등록' },
        { id: 'stats', icon: PieChartIcon, label: '통계' },
        { id: 'settings', icon: Settings, label: '설정' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a1122]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2 z-40 flex justify-around items-center pb-safe">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-all ${isActive ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                    >
                        <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                            <Icon size={20} />
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavDot"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"
                                />
                            )}
                        </div>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
