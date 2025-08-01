'use client'

import { useState } from 'react'

export default function Home() {
  const [taskType, setTaskType] = useState('')
  const [recommendations, setRecommendations] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let recs = []
    if (taskType === 'code') {
      recs = ['Qwen 2.5 72B', 'Mistral 7B OpenOrca', 'Phi 3.5 Mini']
    } else if (taskType === 'summarization') {
      recs = ['BART Large CNN SamSum', 'DistilBART CNN 12-6', 'Flan-T5 Large']
    } else {
      recs = ['Gemma 7B Instruct', 'Mistral 7B OpenOrca', 'Phi 3.5 Mini']
    }
    
    setRecommendations(recs)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Hugging Face Models on Bedrock</h1>
        <p>The right model for the right task. Automatically.</p>
      </div>
      
      <div className="main-content">
        <div className="form-section">
          <h2>Requirements</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Type</label>
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                <option value="">Select task type</option>
                <option value="generation">Text Generation</option>
                <option value="code">Code Generation</option>
                <option value="summarization">Summarization</option>
                <option value="translation">Translation</option>
                <option value="qa">Question-Answering</option>
                <option value="multi-modal">Multi-Modal</option>
              </select>
            </div>
            <button type="submit">Get Recommendations</button>
          </form>
        </div>
        
        <div className="results-section">
          <h2>Recommendations</h2>
          {recommendations.length === 0 ? (
            <div className="empty-state">
              Configure your requirements to receive tailored model recommendations
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div key={index} className="model-card">
                <div className="model-name">{rec}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}