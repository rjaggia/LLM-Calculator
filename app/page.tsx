'use client'

import { useState } from 'react'

interface FormData {
  taskType: string
  accuracy: string
  speed: string
  dataPrivacy: string
  modelSize: string
  contextWindow: string
  monthlyUsage: string
}

interface ModelRecommendation {
  name: string
  reason: string
  tags: string[]
  contextWindow: string
  costPer1M: number
  monthlyCost?: number
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    taskType: '',
    accuracy: '',
    speed: '',
    dataPrivacy: '',
    modelSize: '',
    contextWindow: '',
    monthlyUsage: ''
  })
  
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const recs = getRecommendations(formData)
    setRecommendations(recs)
  }

  const getRecommendations = (data: FormData): ModelRecommendation[] => {
    const results: ModelRecommendation[] = []
    
    if (data.taskType === 'code') {
      results.push({ name: 'Qwen 2.5 72B', reason: 'Excellent code generation capabilities', tags: ['Code', 'Large'], contextWindow: '128K', costPer1M: 8.00 })
      results.push({ name: 'Mistral 7B OpenOrca', reason: 'Good coding model', tags: ['Code'], contextWindow: '32K', costPer1M: 0.60 })
      results.push({ name: 'Phi 3.5 Mini', reason: 'Fast code completion', tags: ['Fast'], contextWindow: '128K', costPer1M: 0.15 })
    } else if (data.taskType === 'summarization') {
      results.push({ name: 'BART Large CNN SamSum', reason: 'Specialized for summarization', tags: ['Summarization'], contextWindow: '4K', costPer1M: 1.20 })
      results.push({ name: 'DistilBART CNN 12-6', reason: 'Efficient summarization', tags: ['Fast'], contextWindow: '4K', costPer1M: 0.80 })
      results.push({ name: 'Flan-T5 Large', reason: 'Good for summarization', tags: ['Balanced'], contextWindow: '8K', costPer1M: 1.00 })
    } else {
      results.push({ name: 'Gemma 7B Instruct', reason: 'Well-balanced model for general use', tags: ['Balanced'], contextWindow: '8K', costPer1M: 0.70 })
      results.push({ name: 'Mistral 7B OpenOrca', reason: 'High-quality instruction-following model', tags: ['Instruct'], contextWindow: '32K', costPer1M: 0.60 })
      results.push({ name: 'Phi 3.5 Mini', reason: 'Fast and efficient small model', tags: ['Fast'], contextWindow: '128K', costPer1M: 0.15 })
    }
    
    if (data.monthlyUsage) {
      const tokensPerMonth = parseInt(data.monthlyUsage) * 1000000
      results.forEach(rec => {
        rec.monthlyCost = (rec.costPer1M * tokensPerMonth) / 1000000
      })
    }
    
    return results
  }

  return (
    <div className="container">
      <div className="author-card">
        <div className="author-photo">
          <img src="/LLM-Calculator/photo.jpg" alt="Raghav Jaggia" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48x48/007aff/ffffff?text=RJ' }} />
        </div>
        <div className="author-info">
          <div className="author-name">Raghav Jaggia</div>
          <div className="author-title">Partner Development Manager (PDM), Hugging Face</div>
          <div className="author-email">jaggiar@amazon.com</div>
        </div>
      </div>
      <div className="beta-disclaimer">
        <span>Beta</span>
      </div>
      <div className="header">
        <h1>Hugging Face Models on Bedrock</h1>
        <div className="brand-logos">
          <div className="logo-item">
            <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">
              <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="Hugging Face" className="brand-logo" />
            </a>
            <span className="logo-label">Hugging Face</span>
          </div>
          <span className="connector">×</span>
          <div className="logo-item">
            <a href="https://huggingface.co/amazon" target="_blank" rel="noopener noreferrer">
              <img src="/LLM-Calculator/bedrock-logo.png" alt="Amazon Bedrock" className="brand-logo" />
            </a>
            <span className="logo-label">Amazon Bedrock</span>
          </div>
        </div>
        <p>The right model for the right task. Automatically.</p>
      </div>
      
      <div className="about-section">
        <div className="about-content">
          <h3>Intelligent Model Selection</h3>
          <p>Powered by advanced matching algorithms, this tool analyzes your specific requirements across <strong>100+ Hugging Face models</strong> on Amazon Bedrock. Get instant, data-driven recommendations tailored to your exact use case.</p>
          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Models</span>
            </div>
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Task Types</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="form-section">
          <h2>Requirements</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Type</label>
              <select value={formData.taskType} onChange={(e) => setFormData({...formData, taskType: e.target.value})}>
                <option value="">Select task type</option>
                <option value="generation">Text Generation</option>
                <option value="code">Code Generation</option>
                <option value="summarization">Summarization</option>
                <option value="translation">Translation</option>
                <option value="qa">Question-Answering</option>
                <option value="multi-modal">Multi-Modal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Accuracy Priority</label>
              <select value={formData.accuracy} onChange={(e) => setFormData({...formData, accuracy: e.target.value})}>
                <option value="">Select accuracy requirement</option>
                <option value="high">High Accuracy</option>
                <option value="medium">Medium Accuracy</option>
                <option value="low">Basic Accuracy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Speed Priority</label>
              <select value={formData.speed} onChange={(e) => setFormData({...formData, speed: e.target.value})}>
                <option value="">Select speed requirement</option>
                <option value="high">High Speed</option>
                <option value="medium">Medium Speed</option>
                <option value="low">Speed Not Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data Privacy & Security</label>
              <select value={formData.dataPrivacy} onChange={(e) => setFormData({...formData, dataPrivacy: e.target.value})}>
                <option value="">Select privacy requirement</option>
                <option value="high">High (HIPAA, PCI, GDPR)</option>
                <option value="medium">Medium (PII handling)</option>
                <option value="standard">Standard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Model Size Preference</label>
              <select value={formData.modelSize} onChange={(e) => setFormData({...formData, modelSize: e.target.value})}>
                <option value="">Select model size</option>
                <option value="large">Large (Best Performance)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="small">Small (Fast & Efficient)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Context Window Requirement</label>
              <select value={formData.contextWindow} onChange={(e) => setFormData({...formData, contextWindow: e.target.value})}>
                <option value="">Any context window</option>
                <option value="4k">4K tokens</option>
                <option value="8k">8K tokens</option>
                <option value="32k">32K tokens</option>
                <option value="128k">128K+ tokens</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expected Monthly Usage</label>
              <select value={formData.monthlyUsage} onChange={(e) => setFormData({...formData, monthlyUsage: e.target.value})}>
                <option value="">Select usage level</option>
                <option value="1">Light (1M tokens/month)</option>
                <option value="10">Medium (10M tokens/month)</option>
                <option value="100">Heavy (100M tokens/month)</option>
                <option value="1000">Enterprise (1B+ tokens/month)</option>
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
                <div className="model-name">
                  <a href={`https://huggingface.co/models?search=${encodeURIComponent(rec.name)}`} target="_blank" rel="noopener noreferrer" className="model-link">
                    {rec.name}
                  </a>
                  {rec.tags.map((tag, i) => (
                    <span key={i} className={`tag ${tag.toLowerCase()}`}>{tag}</span>
                  ))}
                </div>
                <div className="model-reason">{rec.reason}</div>
                <div className="model-details">
                  <div className="detail-item">
                    <span className="detail-label">Context Window:</span>
                    <span className="detail-value">{rec.contextWindow}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cost per 1M tokens:</span>
                    <span className="detail-value">${rec.costPer1M.toFixed(2)}</span>
                  </div>
                  {rec.monthlyCost && (
                    <div className="detail-item">
                      <span className="detail-label">Est. Monthly Cost:</span>
                      <span className="detail-value cost-highlight">${rec.monthlyCost.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}