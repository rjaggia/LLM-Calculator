'use client'

import { useState } from 'react'

interface FormData {
  taskType: string
  accuracy: string
  speed: string
  dataPrivacy: string
  modelSize: string
  fineTuning: string
  deployment: string
  licensing: string
}

interface ModelRecommendation {
  name: string
  reason: string
  tags: string[]
}

const bedrockModels = {
  'claude-3-opus': { size: 'large', speed: 'medium', accuracy: 'high', multimodal: true, cost: 'high' },
  'claude-3-sonnet': { size: 'medium', speed: 'fast', accuracy: 'high', multimodal: true, cost: 'medium' },
  'claude-3-haiku': { size: 'small', speed: 'very-fast', accuracy: 'medium', multimodal: true, cost: 'low' },
  'titan-text-express': { size: 'medium', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'titan-text-lite': { size: 'small', speed: 'very-fast', accuracy: 'medium', multimodal: false, cost: 'very-low' },
  'llama2-70b': { size: 'large', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' },
  'llama2-13b': { size: 'medium', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'cohere-command': { size: 'medium', speed: 'fast', accuracy: 'high', multimodal: false, cost: 'medium' },
  'ai21-jurassic': { size: 'large', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'high' }
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    taskType: '',
    accuracy: '',
    speed: '',
    dataPrivacy: '',
    modelSize: '',
    fineTuning: '',
    deployment: '',
    licensing: ''
  })
  
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const recs = getRecommendations(formData)
    setRecommendations(recs)
  }

  const getRecommendations = (data: FormData): ModelRecommendation[] => {
    const results: ModelRecommendation[] = []
    
    // Multi-modal tasks
    if (data.taskType === 'multi-modal') {
      if (data.speed === 'high') {
        results.push({ name: 'Claude 3 Haiku', reason: 'Fast multi-modal processing with vision capabilities', tags: ['Fast', 'Multi-Modal'] })
      } else if (data.accuracy === 'high') {
        results.push({ name: 'Claude 3 Opus', reason: 'Highest accuracy for complex multi-modal tasks', tags: ['Accurate', 'Multi-Modal'] })
      } else {
        results.push({ name: 'Claude 3 Sonnet', reason: 'Balanced performance for multi-modal applications', tags: ['Recommended', 'Multi-Modal'] })
      }
    }
    
    // Text generation
    else if (data.taskType === 'generation') {
      if (data.modelSize === 'small' && data.speed === 'high') {
        results.push({ name: 'Titan Text Lite', reason: 'Lightweight and fast for simple text generation', tags: ['Fast', 'Small'] })
        results.push({ name: 'Claude 3 Haiku', reason: 'Fast generation with better quality than Titan Lite', tags: ['Fast', 'Recommended'] })
      } else if (data.accuracy === 'high') {
        results.push({ name: 'Claude 3 Opus', reason: 'Superior text generation quality', tags: ['Accurate', 'Premium'] })
        results.push({ name: 'Llama 2 70B', reason: 'Open-source option with high accuracy', tags: ['Accurate', 'Open-Source'] })
      } else {
        results.push({ name: 'Claude 3 Sonnet', reason: 'Good balance of speed and quality for text generation', tags: ['Recommended', 'Balanced'] })
      }
    }
    
    // Summarization
    else if (data.taskType === 'summarization') {
      results.push({ name: 'Claude 3 Sonnet', reason: 'Excellent at understanding context and creating concise summaries', tags: ['Recommended', 'Context-Aware'] })
      results.push({ name: 'Cohere Command', reason: 'Specialized in text understanding and summarization tasks', tags: ['Specialized', 'NLP'] })
    }
    
    // Question-Answering
    else if (data.taskType === 'qa') {
      if (data.accuracy === 'high') {
        results.push({ name: 'Claude 3 Opus', reason: 'Most accurate for complex question answering', tags: ['Accurate', 'Premium'] })
      } else {
        results.push({ name: 'Claude 3 Sonnet', reason: 'Fast and accurate for most Q&A scenarios', tags: ['Recommended', 'Fast'] })
        results.push({ name: 'Titan Text Express', reason: 'Cost-effective option for straightforward Q&A', tags: ['Cost-Effective', 'AWS'] })
      }
    }
    
    // Translation
    else if (data.taskType === 'translation') {
      results.push({ name: 'Claude 3 Sonnet', reason: 'Strong multilingual capabilities', tags: ['Recommended', 'Multilingual'] })
      results.push({ name: 'Claude 3 Opus', reason: 'Best for complex or nuanced translations', tags: ['Accurate', 'Premium'] })
    }

    // Filter by licensing preference
    if (data.licensing === 'open-source') {
      const openSourceModels = results.filter(r => r.name.includes('Llama'))
      if (openSourceModels.length === 0) {
        results.push({ name: 'Llama 2 70B', reason: 'Open-source model with commercial license', tags: ['Open-Source', 'Large'] })
        results.push({ name: 'Llama 2 13B', reason: 'Smaller open-source option for faster inference', tags: ['Open-Source', 'Fast'] })
      }
    }

    // Add privacy considerations
    if (data.dataPrivacy === 'high') {
      results.forEach(rec => {
        rec.reason += '. All Bedrock models provide data isolation and encryption.'
      })
    }

    return results.slice(0, 3) // Return top 3 recommendations
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🤖 Amazon Bedrock LLM Selector</h1>
        <p>Find the perfect AI model for your specific needs</p>
      </div>
      
      <div className="main-content">
        <div className="form-section">
          <h2>⚙️ Your Requirements</h2>
          <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Type</label>
          <select value={formData.taskType} onChange={(e) => setFormData({...formData, taskType: e.target.value})}>
            <option value="">Select task type</option>
            <option value="generation">Text Generation</option>
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
          <label>Fine-Tuning Required</label>
          <select value={formData.fineTuning} onChange={(e) => setFormData({...formData, fineTuning: e.target.value})}>
            <option value="">Select fine-tuning need</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deployment Environment</label>
          <select value={formData.deployment} onChange={(e) => setFormData({...formData, deployment: e.target.value})}>
            <option value="">Select deployment</option>
            <option value="cloud">Cloud (AWS)</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label>Licensing Preference</label>
          <select value={formData.licensing} onChange={(e) => setFormData({...formData, licensing: e.target.value})}>
            <option value="">Select licensing</option>
            <option value="proprietary">Proprietary (Best Performance)</option>
            <option value="open-source">Open Source</option>
            <option value="either">No Preference</option>
          </select>
        </div>

            <button type="submit">Get Recommendations</button>
          </form>
        </div>
        
        <div className="results-section">
          <h2>🎯 Recommended Models</h2>
          {recommendations.length === 0 ? (
            <div className="empty-state">
              Select your requirements to get personalized model recommendations
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div key={index} className="model-card">
                <div className="model-name">
                  {rec.name}
                  {rec.tags.map((tag, i) => (
                    <span key={i} className={`tag ${tag.toLowerCase()}`}>{tag}</span>
                  ))}
                </div>
                <div className="model-reason">{rec.reason}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}