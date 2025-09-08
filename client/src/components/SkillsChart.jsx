import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function SkillsChart({ data }) {
  // expects data: [{name, category, level, required}]
  const chartData = (data || []).map(s => ({ skill: s.name, level: s.level || 0, required: s.required || 10 }));
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="level" name="Current" />
          <Bar dataKey="required" name="Required" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

