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
    contextWindow: '',
    monthlyUsage: ''
  })
  
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const recs = await getRecommendations(formData)
    setRecommendations(recs)
  }

  const getRecommendations = async (data: FormData): Promise<ModelRecommendation[]> => {
    try {
      // Map form data to API format
      const requirements = {
        taskType: data.taskType,
        accuracyPriority: data.accuracy,
        speedPriority: data.speed,
        dataPrivacy: data.dataPrivacy,
        modelSize: data.modelSize,
        contextWindow: data.contextWindow,
        monthlyUsage: data.monthlyUsage
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requirements),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const result = await response.json();
      
      if (result.success) {
        // Convert API response to web app format
        return result.recommendations.map((rec: any) => ({
          name: rec.modelName,
          reason: rec.reasoning,
          tags: rec.tags || ['Recommended'],
          contextWindow: rec.contextWindow || '8K',
          costPer1M: rec.costPer1M || 1.0,
          monthlyCost: rec.monthlyCost
        }));
      } else {
        throw new Error(result.message || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to static recommendations
      return getFallbackRecommendations(data);
    }
  }

  const getFallbackRecommendations = (data: FormData): ModelRecommendation[] => {
    const results: ModelRecommendation[] = []
    
    // Simple fallback logic
    if (data.taskType === 'code') {
      results.push({ name: 'Qwen 2.5 72B', reason: 'Excellent code generation capabilities', tags: ['Code', 'Large'], contextWindow: '128K', costPer1M: 8.00 })
    } else if (data.taskType === 'summarization') {
      results.push({ name: 'BART Large CNN SamSum', reason: 'Specialized for summarization tasks', tags: ['Summarization'], contextWindow: '4K', costPer1M: 1.20 })
    } else {
      results.push({ name: 'Gemma 7B Instruct', reason: 'Well-balanced model for general use', tags: ['Balanced'], contextWindow: '8K', costPer1M: 0.70 })
    }
    
    results.push({ name: 'Mistral 7B OpenOrca', reason: 'High-quality instruction-following model', tags: ['Instruct'], contextWindow: '32K', costPer1M: 0.60 })
    results.push({ name: 'Phi 3.5 Mini', reason: 'Fast and efficient small model', tags: ['Fast', 'Small'], contextWindow: '128K', costPer1M: 0.15 })
    
    return results.slice(0, 3)
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
