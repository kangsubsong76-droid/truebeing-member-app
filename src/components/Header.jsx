import React from 'react';
import { Search, Bell, FileSpreadsheet, ArrowDownToLine, RefreshCw, Database, Menu } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

const Header = ({
    handleDownloadExcel,
    fetchData,
    isLoading,
    isUploading,
    setIsUploading,
    searchTerm,
    setSearchTerm,
    memberList,
    setFilteredList,
    setFilterType,
    setIsNotifyOpen,
    settings,
    setIsSidebarOpen
}) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-4">
                {settings?.mobileNavStyle !== 'bottom' && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 glass hover:bg-slate-800 transition-all text-slate-400 hover:text-emerald-400"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold">회원 관리 대시보드</h2>
                    <p className="text-slate-400 mt-1">실시간 회원 현황 및 분석 보고서</p>
                </div>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
                <button
                    className="p-2 glass hover:bg-slate-800 transition-all text-slate-400 hover:text-green-400"
                    title="Google Drive 연동"
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/1n2gctc0D8oLqQUgklAMFG1dcT6vXYaF7towjwqeQ_Hs', '_blank')}
                >
                    <FileSpreadsheet size={20} />
                </button>
                <button
                    onClick={handleDownloadExcel}
                    className="p-2 glass hover:bg-slate-800 transition-all text-slate-400 hover:text-blue-400"
                    title="엑셀 다운로드"
                >
                    <ArrowDownToLine size={20} />
                </button>
                <button
                    onClick={fetchData}
                    className={`p-2 glass hover:bg-slate-800 transition-all ${isLoading ? 'animate-spin' : ''}`}
                    title="데이터 새로고침"
                >
                    <RefreshCw size={20} className="text-emerald-400" />
                </button>
                <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${settings?.realtimeUpdate ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-800/50 border border-white/5 opacity-50'}`}>
                    <div className={`w-2 h-2 rounded-full ${settings?.realtimeUpdate ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${settings?.realtimeUpdate ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {settings?.realtimeUpdate ? 'Live System' : 'Sync: Manual'}
                    </span>
                </div>

                {/* Excel Upload Button */}
                <div className="relative">
                    <input
                        type="file"
                        id="excel-upload"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            if (!confirm(`'${file.name}' 파일을 업로드하시겠습니까?\n기존 회원 정보(전화번호 기준)가 업데이트됩니다.`)) {
                                e.target.value = '';
                                return;
                            }

                            setIsUploading(true);

                            const reader = new FileReader();
                            reader.onload = async (evt) => {
                                try {
                                    const data_buf = evt.target.result;
                                    const wb = XLSX.read(data_buf, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
                                    const wsname = wb.SheetNames[0];
                                    const ws = wb.Sheets[wsname];

                                    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

                                    if (rows.length < 2) {
                                        throw new Error('데이터가 부족합니다 (최소 헤더 + 1개의 데이터 행 필요).');
                                    }

                                    const header = rows[0].map(h => String(h || '').toLowerCase().trim());
                                    const findCol = (keywords, defaultIdx) => {
                                        let idx = header.findIndex(h => keywords.some(k => h === k.toLowerCase()));
                                        if (idx !== -1) return idx;
                                        idx = header.findIndex(h => keywords.some(k => h.includes(k.toLowerCase())));
                                        return idx !== -1 ? idx : defaultIdx;
                                    };

                                    const nameIdx = findCol(['이름', 'name', '성함'], 1);
                                    const phoneIdx = findCol(['전화번호', 'phone', '연락처', '번호'], 2);
                                    const genderIdx = findCol(['성별', 'gender', 'sex', '남여'], 3);
                                    const statusIdx = findCol(['상태', 'status', '구분'], 4);
                                    const memoIdx = findCol(['메모', 'memo', '비고', '그룹'], 15);
                                    const endIdx = findCol(['만기일', '만기', 'end_date', 'expiry'], 16);
                                    const joinIdx = findCol(['가입일', '등록일', 'join_date', 'start'], 21);

                                    let dateCount = 0;
                                    const formattedData = rows.slice(1).map(row => {
                                        const cleanDate = (val) => {
                                            if (!val) return null;
                                            if (typeof val === 'string') {
                                                const match = val.match(/^\d{4}-\d{2}-\d{2}/);
                                                if (match) return match[0];
                                                return null;
                                            }
                                            return val;
                                        };

                                        const name = row[nameIdx];
                                        const rawPhone = row[phoneIdx];
                                        const phone = rawPhone ? String(rawPhone).replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3') : null;

                                        const endDate = cleanDate(row[endIdx]);
                                        const joinDate = cleanDate(row[joinIdx]);
                                        if (endDate || joinDate) dateCount++;

                                        return {
                                            name: name,
                                            phone: phone,
                                            status: row[statusIdx] || '회원',
                                            gender: row[genderIdx] || '모름',
                                            address: row[10] || '',
                                            memo: row[memoIdx] || '',
                                            end_date: endDate,
                                            join_date: joinDate
                                        };
                                    }).filter(m => m.name && m.phone);

                                    if (formattedData.length === 0) {
                                        throw new Error(`필수 데이터(이름, 전화번호)를 찾을 수 없습니다.`);
                                    }

                                    const { error } = await supabase
                                        .from('members')
                                        .upsert(formattedData, { onConflict: 'phone' });

                                    if (error) throw error;

                                    await fetchData();
                                    alert(`✅ 업로드 완료! (대상: ${formattedData.length}명)`);

                                } catch (error) {
                                    alert(`❌ 업로드 실패: ${error.message || error}`);
                                } finally {
                                    setIsUploading(false);
                                    e.target.value = '';
                                }
                            };
                            reader.readAsArrayBuffer(file);
                        }}
                    />
                    <button
                        onClick={() => !isUploading && document.getElementById('excel-upload').click()}
                        className={`p-2 glass hover:bg-slate-800 transition-all ${isUploading ? 'cursor-wait text-emerald-500' : 'text-slate-400 hover:text-emerald-400'}`}
                        title={isUploading ? "업로드 중..." : "엑셀 파일 업로드 (데이터 업데이트)"}
                        disabled={isUploading}
                    >
                        {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Database size={20} className="text-emerald-500" />}
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="회원 이름 또는 번호 검색..."
                        className="glass bg-slate-800/50 border-none pl-10 pr-4 py-2 text-sm focus:ring-2 ring-emerald-500/50 w-64 outline-none"
                        value={searchTerm}
                        onChange={(e) => {
                            const term = e.target.value;
                            setSearchTerm(term);
                            if (term.trim()) {
                                const filtered = memberList.filter(m =>
                                    m.name?.includes(term) ||
                                    m.phone?.includes(term)
                                );
                                setFilteredList(filtered);
                                setFilterType('search');
                            } else {
                                setFilteredList(memberList);
                                setFilterType('all');
                            }
                        }}
                    />
                </div>
                <button
                    onClick={() => setIsNotifyOpen(true)}
                    className="relative p-2 glass hover:bg-slate-800 transition-colors"
                >
                    <Bell size={20} />
                    {memberList.filter(m => {
                        if (!m.end_date) return false;
                        const diff = (new Date(m.end_date) - new Date()) / (1000 * 60 * 60 * 24);
                        return diff >= 0 && diff <= 7;
                    }).length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                        )}
                </button>
            </div>
        </header>
    );
};

export default Header;
