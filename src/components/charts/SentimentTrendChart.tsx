import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
    data: any[];
}

export const SentimentTrendChart: React.FC<Props> = ({ data }) => {
    return (
        <div className="glass-panel">
            <div className="glass-panel-header">
                <div>
                    <h2 className="glass-panel-title">Sentiment Trend</h2>
                    <p className="glass-panel-subtitle">Daily user sentiment percentage</p>
                </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} stackOffset="expand" margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(val) => `${val * 100}%`} stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="positive" stackId="1" stroke="var(--accent-green)" fill="var(--accent-green)" />
                        <Area type="monotone" dataKey="neutral" stackId="1" stroke="#aaaaaa" fill="#aaaaaa" />
                        <Area type="monotone" dataKey="negative" stackId="1" stroke="var(--accent-red)" fill="var(--accent-red)" />
                        <Legend />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
