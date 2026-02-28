import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings2 } from 'lucide-react';

interface CallDurationChartProps {
    data: any[];
    onEditClick: () => void;
}

export const CallDurationChart: React.FC<CallDurationChartProps> = ({ data, onEditClick }) => {
    return (
        <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
            <div className="glass-panel-header">
                <div>
                    <h2 className="glass-panel-title">Call Duration Analysis</h2>
                    <p className="glass-panel-subtitle">Average duration (sec) and call volume per 2hr slot</p>
                </div>
                <button className="btn btn-outline" onClick={onEditClick}>
                    <Settings2 size={16} style={{ marginRight: '6px' }} />
                    Edit Data
                </button>
            </div>
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="avgDuration" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDuration)" />
                        <Area type="monotone" dataKey="calls" stroke="var(--accent-cyan)" strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
