import React from 'react';

export default function Recommendations({ data }) {
  return (
    <div>
      <div className="small">Source: {data.source || 'unknown'}</div>

      <h4 style={{ marginTop: 8 }}>Top skills</h4>
      <ul className="skill-list">
        {data.skills.map((s, i) => (
          <li key={i}>
            <span>{s.name} ({s.category})</span>
            <span>{s.level || 0}/{s.required || 10}</span>
          </li>
        ))}
      </ul>

      <h4>Missing skills</h4>
      <ul>
        {(data.missing_skills || []).map((m, i) => <li key={i}>{m.name} — <span className="small">{m.reason}</span></li>)}
      </ul>

<h4>Recommended courses</h4>
      <ul>
        {(data.recommended_courses || []).map((c, i) => (
          <li key={i}><a href={c.url} target="_blank" rel="noreferrer">{c.title}</a> — {c.provider}</li>
        ))}
      </ul>

      <h4>Roadmap</h4>
      <ol>
        {(data.roadmap || []).map((r, i) => <li key={i}><strong>{r.month}:</strong> {r.milestone}</li>)}
      </ol>
    </div>
  );
}

