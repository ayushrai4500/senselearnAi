import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

export default function TopicMasteryChart({ data }) {
  const chartData = data && data.length > 0
    ? data
    : [
        { topic: 'Fractions', mastery: 82, benchmark: 70 },
        { topic: 'Percentages', mastery: 71, benchmark: 70 },
        { topic: 'Decimals', mastery: 64, benchmark: 70 },
        { topic: 'Ratios', mastery: 48, benchmark: 70 },
      ];

  // Helper color by score
  const getBarColor = (val) => {
    if (val >= 75) return '#10b981'; // emerald
    if (val >= 65) return '#6366f1'; // indigo
    if (val >= 55) return '#f59e0b'; // amber
    return '#ef4444'; // rose/red
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-100 text-sm">{item.topic}</p>
          <p className="flex items-center justify-between space-x-3">
            <span className="text-slate-400">Class Mastery:</span>
            <span className="font-semibold text-emerald-400">{item.mastery}%</span>
          </p>
          <p className="flex items-center justify-between space-x-3">
            <span className="text-slate-400">Target Benchmark:</span>
            <span className="font-semibold text-slate-300">70%</span>
          </p>
          <div className="pt-1 border-t border-slate-700">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              item.mastery < 60 ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-900/60 text-emerald-300'
            }`}>
              {item.mastery < 60 ? 'Needs Urgent Attention' : item.mastery >= 75 ? 'Mastered' : 'Progressing'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 15, right: 15, left: -10, bottom: 20 }}
          barSize={38}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="topic"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={70}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: 'Target: 70%', fill: '#64748b', fontSize: 11, position: 'top' }}
          />
          <Bar dataKey="mastery" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.mastery)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

