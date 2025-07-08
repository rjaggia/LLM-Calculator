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
  'llama2-7b-chat': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'llama2-13b-chat': { size: 'medium', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' },
  'llama2-70b-chat': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'code-llama-7b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'code-llama-13b': { size: 'medium', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' },
  'code-llama-34b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'falcon-7b-instruct': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'falcon-40b-instruct': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'mistral-7b-instruct': { size: 'small', speed: 'fast', accuracy: 'high', multimodal: false, cost: 'low' },
  'mixtral-8x7b-instruct': { size: 'large', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' }
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
    
    // Multi-modal tasks - Note: Current Hugging Face models on Bedrock are text-only
    if (data.taskType === 'multi-modal') {
      results.push({ name: 'Llama 2 70B Chat', reason: 'Best available text model for complex reasoning tasks (multi-modal capabilities coming soon)', tags: ['Accurate', 'Large'] })
      results.push({ name: 'Mixtral 8x7B Instruct', reason: 'High-performance mixture of experts model for complex tasks', tags: ['Recommended', 'Efficient'] })
    }
    
    // Text generation
    else if (data.taskType === 'generation') {
      if (data.modelSize === 'small' && data.speed === 'high') {
        results.push({ name: 'Mistral 7B Instruct', reason: 'Fast and efficient small model with excellent performance', tags: ['Fast', 'Small'] })
        results.push({ name: 'Llama 2 7B Chat', reason: 'Lightweight option for quick text generation', tags: ['Fast', 'Recommended'] })
      } else if (data.accuracy === 'high') {
        results.push({ name: 'Llama 2 70B Chat', reason: 'Highest accuracy for complex text generation', tags: ['Accurate', 'Large'] })
        results.push({ name: 'Mixtral 8x7B Instruct', reason: 'Mixture of experts model with superior quality', tags: ['Accurate', 'Efficient'] })
      } else {
        results.push({ name: 'Llama 2 13B Chat', reason: 'Good balance of speed and quality for text generation', tags: ['Recommended', 'Balanced'] })
      }
    }
    
    // Summarization
    else if (data.taskType === 'summarization') {
      results.push({ name: 'Llama 2 13B Chat', reason: 'Excellent at understanding context and creating concise summaries', tags: ['Recommended', 'Context-Aware'] })
      results.push({ name: 'Mistral 7B Instruct', reason: 'Efficient model specialized in text understanding tasks', tags: ['Specialized', 'Fast'] })
    }
    
    // Question-Answering
    else if (data.taskType === 'qa') {
      if (data.accuracy === 'high') {
        results.push({ name: 'Llama 2 70B Chat', reason: 'Most accurate for complex question answering', tags: ['Accurate', 'Large'] })
      } else {
        results.push({ name: 'Mixtral 8x7B Instruct', reason: 'Fast and accurate for most Q&A scenarios', tags: ['Recommended', 'Fast'] })
        results.push({ name: 'Llama 2 13B Chat', reason: 'Cost-effective option for straightforward Q&A', tags: ['Cost-Effective', 'Balanced'] })
      }
    }
    
    // Translation
    else if (data.taskType === 'translation') {
      results.push({ name: 'Llama 2 13B Chat', reason: 'Good multilingual capabilities for translation tasks', tags: ['Recommended', 'Multilingual'] })
      results.push({ name: 'Mixtral 8x7B Instruct', reason: 'Strong performance for complex translations', tags: ['Accurate', 'Efficient'] })
    }

    // Filter by licensing preference
    if (data.licensing === 'open-source') {
      const openSourceModels = results.filter(r => r.name.includes('Llama') || r.name.includes('Falcon') || r.name.includes('Mistral'))
      if (openSourceModels.length === 0) {
        results.push({ name: 'Llama 2 70B Chat', reason: 'Open-source model with commercial license', tags: ['Open-Source', 'Large'] })
        results.push({ name: 'Mistral 7B Instruct', reason: 'Apache 2.0 licensed model for commercial use', tags: ['Open-Source', 'Fast'] })
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
        <h1>Bedrock</h1>
        <p>The right model for the right task. Automatically.</p>
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
          <h2>Recommendations</h2>
          {recommendations.length === 0 ? (
            <div className="empty-state">
              Configure your requirements to receive tailored model recommendations
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