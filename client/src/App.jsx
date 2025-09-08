import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import SkillsChart from './components/SkillsChart';
import Recommendations from './components/Recommendations';
import api from './api';

export default function App() {
  const [skillsPackage, setSkillsPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTextExtracted(text) {
    setLoading(true);
    try {
      const resp = await api.post('/extract-skills', { text, desiredRole: 'Data Scientist' });
      setSkillsPackage(resp.data);
    } catch (err) {
      alert('Error extracting skills: ' + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Personalized Career & Skills Advisor (Demo)</h1>
      <div className="row">
        <div className="col">
          <div className="card">
            <UploadForm onTextExtracted={handleTextExtracted} />
          </div>
          <div className="card small">
            <strong>How it works (demo):</strong>
            <div>Upload a CV (PDF) or paste text. The server extracts text then calls a skills extractor (Gemini integration if configured, otherwise demo output).</div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h3>Recommendations</h3>
            {loading && <div className="small">Working...</div>}
            {!skillsPackage && !loading && <div className="small">Upload a CV to see suggestions.</div>}
            {skillsPackage && <Recommendations data={skillsPackage} />}
          </div>
        </div>
      </div>

      {skillsPackage && (
        <div className="card" style={{ marginTop: 18 }}>
          <h3>Skills vs Required (chart)</h3>
          <SkillsChart data={skillsPackage.skills} />
        </div>
      )}
    </div>
  );
}

