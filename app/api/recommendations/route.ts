import { NextRequest, NextResponse } from 'next/server';

interface UserRequirements {
  taskType: string;
  accuracyPriority: string;
  speedPriority: string;
  dataPrivacy: string;
  modelSize: string;
  contextWindow: string;
  monthlyUsage: string;
}

interface ModelRecommendation {
  modelName: string;
  score: number;
  reasoning: string;
  contextWindow?: string;
  costPer1M?: number;
  monthlyCost?: number;
  tags?: string[];
}

function getFallbackRecommendations(requirements: UserRequirements): ModelRecommendation[] {
  const results: ModelRecommendation[] = [];
  
  // Task-based recommendations
  switch (requirements.taskType) {
    case 'text_generation':
    case 'generation':
      if (requirements.modelSize === 'small' && requirements.speedPriority === 'high') {
        results.push({
          modelName: 'Phi 3.5 Mini',
          score: 92,
          reasoning: 'Ultra-fast small model optimized for quick text generation',
          contextWindow: '128K',
          costPer1M: 0.15,
          tags: ['Fast', 'Small', 'Efficient']
        });
      } else if (requirements.accuracyPriority === 'high') {
        results.push({
          modelName: 'Qwen 2.5 72B',
          score: 95,
          reasoning: 'Highest accuracy for complex text generation tasks',
          contextWindow: '128K',
          costPer1M: 8.00,
          tags: ['Accurate', 'Large', 'Premium']
        });
      } else {
        results.push({
          modelName: 'Gemma 7B Instruct',
          score: 88,
          reasoning: 'Balanced performance for general text generation',
          contextWindow: '8K',
          costPer1M: 0.70,
          tags: ['Balanced', 'Recommended']
        });
      }
      break;

    case 'code_generation':
    case 'code':
      results.push({
        modelName: 'Qwen 2.5 72B',
        score: 94,
        reasoning: 'Excellent code generation with strong reasoning capabilities',
        contextWindow: '128K',
        costPer1M: 8.00,
        tags: ['Code', 'Large', 'Accurate']
      });
      break;

    case 'summarization':
      results.push({
        modelName: 'BART Large CNN SamSum',
        score: 90,
        reasoning: 'Specialized summarization model trained on conversation data',
        contextWindow: '4K',
        costPer1M: 1.20,
        tags: ['Specialized', 'Summarization']
      });
      break;

    default:
      results.push({
        modelName: 'Gemma 7B Instruct',
        score: 85,
        reasoning: 'Well-balanced model for general use cases',
        contextWindow: '8K',
        costPer1M: 0.70,
        tags: ['Balanced', 'Versatile']
      });
  }

  // Add 2 more recommendations to make it 3
  if (results.length < 3) {
    results.push({
      modelName: 'Mistral 7B OpenOrca',
      score: 82,
      reasoning: 'High-quality instruction-following model with good performance',
      contextWindow: '32K',
      costPer1M: 0.60,
      tags: ['Balanced', 'Instruct']
    });
  }

  if (results.length < 3) {
    results.push({
      modelName: 'Qwen 2.5 14B',
      score: 80,
      reasoning: 'Medium-sized model with strong capabilities across tasks',
      contextWindow: '32K',
      costPer1M: 2.80,
      tags: ['Balanced', 'Efficient']
    });
  }

  // Add monthly cost calculation
  if (requirements.monthlyUsage) {
    const usageMultiplier = getUsageMultiplier(requirements.monthlyUsage);
    results.forEach(model => {
      if (model.costPer1M) {
        model.monthlyCost = model.costPer1M * usageMultiplier;
      }
    });
  }

  return results.slice(0, 3);
}

function getUsageMultiplier(monthlyUsage: string): number {
  switch (monthlyUsage) {
    case 'light':
    case '1':
      return 1; // 1M tokens
    case 'medium':
    case '10':
      return 10; // 10M tokens
    case 'heavy':
    case '100':
      return 100; // 100M tokens
    case 'enterprise':
    case '1000':
      return 1000; // 1B tokens
    default:
      return 1;
  }
}

export async function POST(request: NextRequest) {
  try {
    const requirements: UserRequirements = await request.json();
    
    // Use fallback recommendations for reliable deployment
    const recommendations = getFallbackRecommendations(requirements);
    
    return NextResponse.json({
      success: true,
      recommendations,
      source: 'static'
    });
    
  } catch (error) {
    console.error('Error in recommendations API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}