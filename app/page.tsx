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
  // Bart Models
  'bart-large-cnn-samsum': { size: 'medium', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' },

  // Bloom Models
  'bloom-560m': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloom-1b1': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloom-1b7': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloom-3b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloom-7b1': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'bloomz-1b1': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloomz-1b7': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloomz-3b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'bloomz-7b1': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },

  // CyberAgent Models
  'cyberagentlm3-22b-chat': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },

  // DBRX Models
  'dbrx-base': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'dbrx-instruct': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },

  // Distilbart Models
  'distilbart-cnn-6-6': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'distilbart-cnn-12-6': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'distilbart-xsum-12-3': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },

  // Distil GPT Models
  'distilgpt-2': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },

  // Dolly Models
  'dolly-v2-3b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'dolly-v2-7b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'dolly-v2-12b': { size: 'medium', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' },

  // Dolphin Models
  'dolphin-2.2.1-mistral-7b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'dolphin-2.5-mixtral-8-7b': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },

  // Falcon Models
  'falcon-40b-bf16': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'falcon-180b-bf16': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'falcon-lite': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'falcon-lite-2': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'falcon-rw-1b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'falcon3-1b-instruct': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'falcon3-3b-base': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'falcon3-3b-instruct': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'falcon3-7b-base': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'falcon3-7b-instruct': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'falcon3-10b-base': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'falcon3-10b-instruct': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },

  // Flan-T5 Models
  'flan-t5-base': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'flan-t5-base-samsum': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'flan-t5-large': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'flan-t5-small': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },

  // Gemma Models
  'gemma-2b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'gemma-2b-instruct': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'gemma-2-9b': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'gemma-2-9b-instruct': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'gemma-2-27b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'gemma-2-27b-instruct': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'gemma-3-4b-instruct': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'gemma-3-27b-instruct': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'gemma-7b': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'gemma-7b-instruct': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },

  // GPT Models
  'gpt-2': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'gpt-2-xl': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'gpt-j-6b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'gpt-neo-125m': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'gpt-neo-1.3b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'gpt-neo-2.7b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'gpt-neox-20b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },

  // Mistral Models
  'mistral-7b-openorca': { size: 'small', speed: 'fast', accuracy: 'high', multimodal: false, cost: 'low' },
  'mistral-7b-openorca-gptq': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'mistral-7b-sft-alpha': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'mistral-7b-sft-beta': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'mistral-lite': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'mistral-trix-v1': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },

  // MPT Models
  'mpt-7b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'mpt-7b-instruct': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'mpt-7b-storywriter': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },

  // Open Hermes Models
  'open-hermes-2-mistral-7b': { size: 'small', speed: 'fast', accuracy: 'high', multimodal: false, cost: 'low' },

  // Phi Models
  'phi-2': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'phi-3-mini-4k': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'phi-3-mini-128k': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'phi-3.5-mini': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },

  // Qwen Models
  'qwen2.5-7b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'qwen2.5-14b': { size: 'medium', speed: 'medium', accuracy: 'high', multimodal: false, cost: 'medium' },
  'qwen2.5-32b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'qwen2.5-72b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },
  'qwen3-0.6b': { size: 'small', speed: 'fast', accuracy: 'low', multimodal: false, cost: 'low' },
  'qwen3-4b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'qwen3-8b': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'qwen3-32b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },

  // Whisper Models
  'whisper-large-v3-turbo': { size: 'large', speed: 'medium', accuracy: 'high', multimodal: true, cost: 'high' },

  // Writer Models
  'writer-palmyra-small': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },

  // Yarn Models
  'yarn-mistral-7b-128k': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },

  // Yi Models
  'yi-1.5-6b': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' },
  'yi-1.5-9b': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'yi-1.5-34b': { size: 'large', speed: 'slow', accuracy: 'high', multimodal: false, cost: 'high' },

  // Zephyr Models
  'zephyr-7b-alpha': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'zephyr-7b-beta': { size: 'medium', speed: 'medium', accuracy: 'medium', multimodal: false, cost: 'medium' },
  'zephyr-7b-gemma': { size: 'small', speed: 'fast', accuracy: 'medium', multimodal: false, cost: 'low' }
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
      <div className="beta-disclaimer">
        <span>Beta</span>
      </div>
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
