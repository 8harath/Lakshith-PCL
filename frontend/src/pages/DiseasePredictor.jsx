import React, { useState, useEffect } from 'react';
import { predictDisease, getCommonSymptoms } from '../api';

const DiseasePredictor = () => {
  const [symptomsText, setSymptomsText] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommonSymptoms();
  }, []);

  const fetchCommonSymptoms = async () => {
    try {
      const response = await getCommonSymptoms();
      setCommonSymptoms(response.data.symptoms);
    } catch (err) {
      console.error('Failed to fetch common symptoms:', err);
    }
  };

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine text input and selected symptoms
      const allSymptoms = symptomsText
        ? [...selectedSymptoms, ...symptomsText.split(';').map(s => s.trim())]
        : selectedSymptoms;

      if (allSymptoms.length === 0) {
        setError('Please provide at least one symptom');
        setLoading(false);
        return;
      }

      const response = await predictDisease(allSymptoms);
      setResults(response.data);
    } catch (err) {
      setError('Failed to predict disease');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{marginTop: '30px', marginBottom: '20px', color: '#2e7d32'}}>
        🩺 Crop Disease Predictor
      </h1>

      <div className="alert alert-info mb-2">
        <strong>How to use:</strong> Describe the symptoms you observe in your crops or select from
        common symptoms below. Our system will match your inputs against known disease patterns and
        provide management recommendations.
      </div>

      <div className="card">
        <h3 className="card-header">Symptom Input</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Describe Symptoms (separate multiple symptoms with semicolon)</label>
            <textarea
              className="form-control"
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              rows="4"
              placeholder="e.g., yellowing leaves; brown spots on stems; wilting plants"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Or Select Common Symptoms</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px',
              marginTop: '10px'
            }}>
              {commonSymptoms.slice(0, 20).map((symptom) => (
                <label
                  key={symptom}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: selectedSymptoms.includes(symptom) ? '#e8f5e9' : '#f5f5f5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedSymptoms.includes(symptom) ? '2px solid #2e7d32' : '2px solid transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                    style={{margin: 0}}
                  />
                  <span style={{fontSize: '14px'}}>{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="alert alert-success">
              <strong>Selected symptoms ({selectedSymptoms.length}):</strong> {selectedSymptoms.join(', ')}
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{width: '100%', marginTop: '20px'}}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Predict Disease'}
          </button>
        </form>
      </div>

      {results && (
        <div style={{marginTop: '30px'}}>
          <h2 style={{color: '#2e7d32', marginBottom: '20px'}}>Disease Predictions</h2>

          {results.message ? (
            <div className="alert alert-info">{results.message}</div>
          ) : (
            <>
              <div className="card mb-2" style={{backgroundColor: '#fff3e0'}}>
                <strong>Input Symptoms:</strong> {results.input_symptoms.join(', ')}
              </div>

              {results.predictions.map((prediction, index) => (
                <div key={index} className="disease-result">
                  <div className="disease-name">
                    {index + 1}. {prediction.disease_name}
                  </div>
                  <div className="disease-confidence">
                    Confidence: {prediction.confidence}% | Severity: {prediction.severity.replace('_', ' ')}
                  </div>
                  <div className="text-muted" style={{fontSize: '14px', marginBottom: '10px'}}>
                    Commonly affects: {prediction.affected_crops}
                  </div>

                  <div className="disease-management">
                    <h4 style={{color: '#2e7d32', marginBottom: '10px'}}>Management Recommendations</h4>

                    <div className="management-section">
                      <span className="management-label">🌿 Cultural Practices:</span>
                      <p>{prediction.management.cultural}</p>
                    </div>

                    <div className="management-section">
                      <span className="management-label">🧪 Chemical Control:</span>
                      <p>{prediction.management.chemical}</p>
                    </div>

                    <div className="management-section">
                      <span className="management-label">🍃 Organic Methods:</span>
                      <p>{prediction.management.organic}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="alert alert-error mt-2">
                <strong>⚠️ {results.disclaimer}</strong>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;
