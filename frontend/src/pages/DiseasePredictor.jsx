import React, { useState, useEffect } from 'react';
import { predictDisease, getCommonSymptoms, predictDiseaseFromImage } from '../api';

const DiseasePredictor = () => {
  const [activeTab, setActiveTab] = useState('symptoms'); // 'symptoms' or 'image'
  const [symptomsText, setSymptomsText] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image-based detection state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageResults, setImageResults] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }

      setSelectedImage(file);
      setError('');
      setImageResults(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setError('');
    setLoading(true);
    setImageResults(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result;
          const response = await predictDiseaseFromImage(base64Image);
          setImageResults(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to analyze image. Please ensure Gemini API is configured.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      setError('Failed to process image');
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageResults(null);
    setError('');
  };

  return (
    <div className="container">
      <h1 style={{marginTop: '30px', marginBottom: '20px', color: '#2e7d32'}}>
        🩺 Crop Disease Predictor
      </h1>

      <div className="alert alert-info mb-2">
        <strong>How to use:</strong> Choose between symptom-based diagnosis or AI-powered image analysis.
        Upload a clear photo of the affected plant or describe the symptoms for accurate disease identification.
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <button
          onClick={() => setActiveTab('symptoms')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: activeTab === 'symptoms' ? '#2e7d32' : 'transparent',
            color: activeTab === 'symptoms' ? '#fff' : '#2e7d32',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.3s'
          }}
        >
          📝 Symptom-Based Detection
        </button>
        <button
          onClick={() => setActiveTab('image')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: activeTab === 'image' ? '#2e7d32' : 'transparent',
            color: activeTab === 'image' ? '#fff' : '#2e7d32',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.3s'
          }}
        >
          📸 AI Image Analysis
        </button>
      </div>

      {/* Symptom-Based Tab */}
      {activeTab === 'symptoms' && (
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
      )}

      {/* Image-Based Tab */}
      {activeTab === 'image' && (
        <div className="card">
          <h3 className="card-header">AI Image Analysis (Powered by Gemini Vision)</h3>

          <form onSubmit={handleImageSubmit}>
            <div className="form-group">
              <label className="form-label">Upload Plant/Crop Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
                style={{padding: '10px'}}
              />
              <small style={{color: '#666', marginTop: '5px', display: 'block'}}>
                Supported formats: JPG, PNG, WEBP (Max size: 10MB)
              </small>
            </div>

            {imagePreview && (
              <div style={{marginTop: '20px', textAlign: 'center'}}>
                <h4>Image Preview:</h4>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginTop: '10px'
                  }}
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="btn"
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#f44336',
                    color: '#fff'
                  }}
                >
                  Clear Image
                </button>
              </div>
            )}

            {error && <div className="alert alert-error" style={{marginTop: '15px'}}>{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{width: '100%', marginTop: '20px'}}
              disabled={loading || !selectedImage}
            >
              {loading ? '🔍 Analyzing Image...' : '🔍 Analyze with AI'}
            </button>
          </form>

          {imageResults && (
            <div style={{marginTop: '30px'}}>
              <h2 style={{color: '#2e7d32', marginBottom: '20px'}}>AI Analysis Results</h2>

              {imageResults.error ? (
                <div className="alert alert-error">{imageResults.error}</div>
              ) : (
                <>
                  <div className="disease-result">
                    <div className="disease-name">
                      {imageResults.analysis.disease_detected || 'Analysis Complete'}
                    </div>
                    {imageResults.analysis.confidence && (
                      <div className="disease-confidence">
                        Confidence: {imageResults.analysis.confidence}
                        {imageResults.analysis.severity && ` | Severity: ${imageResults.analysis.severity}`}
                      </div>
                    )}

                    {imageResults.analysis.affected_crops && (
                      <div className="text-muted" style={{fontSize: '14px', marginBottom: '10px'}}>
                        Commonly affects: {imageResults.analysis.affected_crops}
                      </div>
                    )}

                    {imageResults.analysis.symptoms_visible && (
                      <div style={{marginTop: '15px'}}>
                        <h4 style={{color: '#2e7d32'}}>Symptoms Visible:</h4>
                        <p>{imageResults.analysis.symptoms_visible}</p>
                      </div>
                    )}

                    {imageResults.analysis.management && (
                      <div className="disease-management">
                        <h4 style={{color: '#2e7d32', marginBottom: '10px'}}>Management Recommendations</h4>

                        <div className="management-section">
                          <span className="management-label">🌿 Cultural Practices:</span>
                          <p>{imageResults.analysis.management.cultural}</p>
                        </div>

                        <div className="management-section">
                          <span className="management-label">🧪 Chemical Control:</span>
                          <p>{imageResults.analysis.management.chemical}</p>
                        </div>

                        <div className="management-section">
                          <span className="management-label">🍃 Organic Methods:</span>
                          <p>{imageResults.analysis.management.organic}</p>
                        </div>
                      </div>
                    )}

                    {imageResults.analysis.preventive_measures && (
                      <div style={{marginTop: '15px'}}>
                        <h4 style={{color: '#2e7d32'}}>Preventive Measures:</h4>
                        <p>{imageResults.analysis.preventive_measures}</p>
                      </div>
                    )}

                    {imageResults.analysis.additional_notes && (
                      <div style={{marginTop: '15px'}}>
                        <h4 style={{color: '#2e7d32'}}>Additional Notes:</h4>
                        <p>{imageResults.analysis.additional_notes}</p>
                      </div>
                    )}

                    {imageResults.analysis.raw_response && !imageResults.analysis.management && (
                      <div style={{marginTop: '15px'}}>
                        <h4 style={{color: '#2e7d32'}}>Detailed Analysis:</h4>
                        <p style={{whiteSpace: 'pre-wrap'}}>{imageResults.analysis.raw_response}</p>
                      </div>
                    )}
                  </div>

                  <div className="alert alert-error mt-2">
                    <strong>⚠️ {imageResults.disclaimer}</strong>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;
