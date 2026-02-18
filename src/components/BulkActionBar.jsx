import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const BulkActionBar = ({ selectedIds, setSelectedIds, setIsSmsOpen }) => {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 border border-emerald-500/30 bg-[#0f172a] px-8 py-5 flex items-center gap-8 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem]"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {selectedIds.size}
                </div>
                <span className="text-white font-semibold">명 선택됨</span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsSmsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors"
                >
                    <MessageSquare size={18} />
                    문자 발송
                </button>
                <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-4 py-2 text-slate-400 hover:text-white font-bold transition-colors"
                >
                    취소
                </button>
            </div>
        </motion.div>
    );
};

export default BulkActionBar;
