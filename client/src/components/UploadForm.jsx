import React, { useState } from 'react';
import api from '../api';

export default function UploadForm({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    if (!file && !rawText) { alert('Please upload a PDF or paste CV text'); return; }
    if (file) {
      const form = new FormData();
      form.append('cv', file);
      const resp = await api.post('/upload-cv', form, { headers: { 'Content-Type': 'multipart/form-data' }});
      const text = resp.data.text || '';
      onTextExtracted(text);
    } else {
 onTextExtracted(rawText);
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <div style={{ marginBottom: 8 }}>
        <label><strong>Upload CV (PDF):</strong></label><br />
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label><strong>or paste CV text:</strong></label><br />
        <textarea value={rawText} onChange={e => setRawText(e.target.value)} placeholder="Paste CV text here..." />
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <button type="submit">Extract & Analyze</button>
        <button type="button" onClick={() => { setFile(null); setRawText(''); }}>Clear</button>
      </div>
    </form>
  );
}

