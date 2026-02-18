import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { PieChart as PieIcon, BarChart3 as BarIcon, Users, Calendar } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatsView = ({ realStats, memberList }) => {
    // 1. 멤버십 타입 분포 데이터 가공
    const membershipStats = useMemo(() => {
        if (!memberList?.length) return [];
        const stats = {};
        memberList.forEach(m => {
            const memoText = m.memo || '미지정';
            const type = memoText.split(/[\s,]+/)[0] || '기타';
            stats[type] = (stats[type] || 0) + 1;
        });

        return Object.entries(stats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 7);
    }, [memberList]);

    // 2. 월별 등록 및 마감 추이 데이터 가공
    const monthlyStats = useMemo(() => {
        if (!memberList?.length) return [];
        const months = {};
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months[key] = { name: key, join: 0, expire: 0 };
        }

        memberList.forEach(m => {
            if (m.join_date && m.join_date.length >= 7) {
                const joinKey = m.join_date.substring(0, 7);
                if (months[joinKey]) months[joinKey].join++;
            }
            if (m.end_date && m.end_date.length >= 7) {
                const endKey = m.end_date.substring(0, 7);
                if (months[endKey]) months[endKey].expire++;
            }
        });
        return Object.values(months);
    }, [memberList]);

    // 3. 성별 비율 데이터 가공 (백분율 포함)
    const genderStats = useMemo(() => {
        if (!memberList?.length) return [];
        let male = 0, female = 0, unknown = 0;
        memberList.forEach(m => {
            const g = m.gender ? m.gender.trim() : '';
            if (g === '남' || g === '남성' || g === 'M') male++;
            else if (g === '여' || g === '여성' || g === 'F') female++;
            else unknown++;
        });
        const total = Math.max(memberList.length, 1);
        return [
            { name: '남', value: male, color: '#3b82f6', percent: Math.round((male / total) * 100) },
            { name: '여', value: female, color: '#ec4899', percent: Math.round((female / total) * 100) },
            { name: '기타', value: unknown, color: '#94a3b8', percent: Math.round((unknown / total) * 100) }
        ].filter(v => v.value > 0);
    }, [memberList]);

    // 4. 유지 기간 분포 데이터 가공
    const retentionStats = useMemo(() => {
        const dist = { '1개월 미만': 0, '1~3개월': 0, '3~6개월': 0, '6개월 이상': 0 };
        memberList.forEach(m => {
            if (!m.join_date || !m.end_date) return;
            const start = new Date(m.join_date);
            const end = new Date(m.end_date);
            if (isNaN(start) || isNaN(end)) return;
            const diffMonths = (end - start) / (1000 * 60 * 60 * 24 * 30.44);

            if (diffMonths < 1) dist['1개월 미만']++;
            else if (diffMonths < 3) dist['1~3개월']++;
            else if (diffMonths < 6) dist['3~6개월']++;
            else dist['6개월 이상']++;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [memberList]);

    const insightText = useMemo(() => {
        if (monthlyStats.length < 2) return "데이터 분석 중입니다...";
        const current = monthlyStats[monthlyStats.length - 1];
        const prev = monthlyStats[monthlyStats.length - 2];
        const diff = current.join - prev.join;
        return (
            <>
                이번 달 신규 등록은 <span className="text-white">{current.join}명</span>입니다.
                전월 대비 <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {Math.abs(diff)}명 {diff >= 0 ? '증가' : '감소'}
                </span>했습니다.
            </>
        );
    }, [monthlyStats]);

    if (!memberList?.length) {
        return <div className="p-20 text-center text-slate-500 font-bold text-2xl glass">데이터를 불러오는 중이거나 회원 정보가 없습니다.</div>;
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* 1. 최근 등록 추이 (Bar Chart) - 높이 값 명시적 고정 */}
                <div className="glass p-10 min-h-[500px] flex flex-col items-center">
                    <h3 className="text-2xl font-black mb-10 w-full flex items-center gap-3 text-white">
                        <BarIcon className="text-blue-500" size={32} /> 최근 등록 추이
                    </h3>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={14} fontWeight="bold" tickFormatter={v => v.split('-')[1] + '월'} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={14} fontWeight="bold" allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', pointerEvents: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '30px' }} iconType="circle" />
                                <Bar dataKey="join" name="신규" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                                <Bar dataKey="expire" name="종료" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. 멤버십 타입 분포 (Pie Chart) */}
                <div className="glass p-10 min-h-[500px] flex flex-col items-center">
                    <h3 className="text-2xl font-black mb-10 w-full flex items-center gap-3 text-white">
                        <PieIcon className="text-emerald-500" size={32} /> 멤버십 타입 분포
                    </h3>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={membershipStats}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    label={({ name, value }) => `${name}(${value})`}
                                >
                                    {membershipStats.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. 회원 유지 기간 분포 (가로 Bar Chart) */}
                <div className="glass p-10 min-h-[500px] flex flex-col items-center">
                    <h3 className="text-2xl font-black mb-10 w-full flex items-center gap-3 text-white">
                        <Calendar className="text-purple-500" size={32} /> 회원 유지 기간 분포
                    </h3>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={retentionStats} layout="vertical" margin={{ left: 50, right: 50, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.3} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#fff" fontSize={15} fontWeight="extrabold" width={110} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Bar dataKey="value" name="회원 수" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. 성별 비율 (Pie Chart with %) */}
                <div className="glass p-10 min-h-[500px] flex flex-col items-center">
                    <h3 className="text-2xl font-black mb-10 w-full flex items-center gap-3 text-white">
                        <Users className="text-pink-500" size={32} /> 성별 비율 (%)
                    </h3>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderStats}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label={({ name, percent }) => `${name} ${percent}%`}
                                    labelLine={true}
                                >
                                    {genderStats.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insight Analysis Report */}
            <div className="glass p-10 bg-gradient-to-br from-emerald-900/10 to-transparent border-emerald-500/20">
                <h4 className="text-2xl font-black text-emerald-400 mb-6 flex items-center gap-3">
                    💡 데이터 분석 리포트
                </h4>
                <div className="text-xl text-slate-200 leading-relaxed font-bold space-y-4">
                    <p>{insightText}</p>
                    <p>
                        현재 전체 회원의 성별 비율은 <span className="text-white">여성 {genderStats.find(g => g.name === '여')?.percent || 0}%</span>,
                        <span className="text-white"> 남성 {genderStats.find(g => g.name === '남')?.percent || 0}%</span> 입니다.
                    </p>
                    <p>
                        유지 기간 분석 결과, <span className="text-indigo-400">{retentionStats.find(r => r.name === '6개월 이상')?.value || 0}명</span>의 회원이 6개월 이상 장기 이용 중입니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatsView;
