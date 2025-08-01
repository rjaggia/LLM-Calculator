export interface UserRequirements {
  taskType: string;
  accuracyPriority: string;
  speedPriority: string;
  dataPrivacy: string;
  modelSize: string;
  contextWindow: string;
  monthlyUsage: string;
}

export interface ModelRecommendation {
  modelName: string;
  score: number;
  reasoning: string;
  contextWindow?: string;
  costPer1M?: number;
  monthlyCost?: number;
  tags?: string[];
}

export interface BedrockModel {
  HubContentName: string;
  HubContentDisplayName?: string;
  HubContentDescription?: string;
  HubContentSearchKeywords?: string[];
}

export class RecommendationService {
  private bedrockClient: any;

  constructor(region: string = 'us-east-1') {
    // Only import AWS SDK on server side
    if (typeof window === 'undefined') {
      const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
      this.bedrockClient = new BedrockRuntimeClient({ region });
    }
  }

  async getModelRecommendations(
    requirements: UserRequirements,
    availableModels: BedrockModel[]
  ): Promise<ModelRecommendation[]> {
    // Return fallback if no Bedrock client (client-side)
    if (!this.bedrockClient) {
      return this.getFallbackRecommendations(requirements);
    }

    const prompt = `You are an AI model selection expert. Given the user requirements and available Hugging Face models on Amazon Bedrock, analyze and recommend the top 3 models that best match their needs.

User Requirements:
- Task Type: ${requirements.taskType}
- Accuracy Priority: ${requirements.accuracyPriority}
- Speed Priority: ${requirements.speedPriority}
- Data Privacy & Security: ${requirements.dataPrivacy}
- Model Size Preference: ${requirements.modelSize}
- Context Window: ${requirements.contextWindow}
- Expected Monthly Usage: ${requirements.monthlyUsage}

Available Models:
${availableModels.map((model, index) => `${index + 1}. ${model.HubContentDisplayName || model.HubContentName} - ${model.HubContentDescription || 'No description'}`).join('\n')}

Please analyze each model against the requirements and provide exactly 3 recommendations in the following JSON format:
{
  "recommendations": [
    {
      "modelName": "exact model name from the list",
      "score": 95,
      "reasoning": "detailed explanation of why this model fits the requirements",
      "contextWindow": "estimated context window (e.g., 4K, 8K, 32K, 128K)",
      "costPer1M": 2.50,
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}

Consider factors like:
- Model architecture suitability for the task type
- Performance vs speed trade-offs based on priorities
- Model size alignment with preferences
- Security and privacy capabilities
- Cost efficiency for usage patterns
- Context window capabilities

Provide only valid JSON response, no additional text.`;

    try {
      const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
      const command = new InvokeModelCommand({
        modelId: 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
        contentType: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      const response = await this.bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const content = responseBody.content[0].text;
      
      // Parse the JSON response
      const parsed = JSON.parse(content);
      
      // Add monthly cost calculation if usage is specified
      const recommendations = parsed.recommendations.map((rec: ModelRecommendation) => {
        if (requirements.monthlyUsage && rec.costPer1M) {
          const usageMultiplier = this.getUsageMultiplier(requirements.monthlyUsage);
          rec.monthlyCost = (rec.costPer1M * usageMultiplier);
        }
        return rec;
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations from Bedrock:', error);
      return this.getFallbackRecommendations(requirements);
    }
  }

  private getUsageMultiplier(monthlyUsage: string): number {
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

  // Fallback recommendations when Bedrock is not available
  getFallbackRecommendations(requirements: UserRequirements): ModelRecommendation[] {
    const fallbackModels: ModelRecommendation[] = [];

    // Task-based recommendations
    switch (requirements.taskType) {
      case 'text_generation':
      case 'generation':
        if (requirements.modelSize === 'small' && requirements.speedPriority === 'high') {
          fallbackModels.push({
            modelName: 'Phi 3.5 Mini',
            score: 92,
            reasoning: 'Ultra-fast small model optimized for quick text generation',
            contextWindow: '128K',
            costPer1M: 0.15,
            tags: ['Fast', 'Small', 'Efficient']
          });
        } else if (requirements.accuracyPriority === 'high') {
          fallbackModels.push({
            modelName: 'Qwen 2.5 72B',
            score: 95,
            reasoning: 'Highest accuracy for complex text generation tasks',
            contextWindow: '128K',
            costPer1M: 8.00,
            tags: ['Accurate', 'Large', 'Premium']
          });
        } else {
          fallbackModels.push({
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
        fallbackModels.push({
          modelName: 'Qwen 2.5 72B',
          score: 94,
          reasoning: 'Excellent code generation with strong reasoning capabilities',
          contextWindow: '128K',
          costPer1M: 8.00,
          tags: ['Code', 'Large', 'Accurate']
        });
        break;

      case 'summarization':
        fallbackModels.push({
          modelName: 'BART Large CNN SamSum',
          score: 90,
          reasoning: 'Specialized summarization model trained on conversation data',
          contextWindow: '4K',
          costPer1M: 1.20,
          tags: ['Specialized', 'Summarization']
        });
        break;

      default:
        fallbackModels.push({
          modelName: 'Gemma 7B Instruct',
          score: 85,
          reasoning: 'Well-balanced model for general use cases',
          contextWindow: '8K',
          costPer1M: 0.70,
          tags: ['Balanced', 'Versatile']
        });
    }

    // Add 2 more recommendations to make it 3
    if (fallbackModels.length < 3) {
      fallbackModels.push({
        modelName: 'Mistral 7B OpenOrca',
        score: 82,
        reasoning: 'High-quality instruction-following model with good performance',
        contextWindow: '32K',
        costPer1M: 0.60,
        tags: ['Balanced', 'Instruct']
      });
    }

    if (fallbackModels.length < 3) {
      fallbackModels.push({
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
      const usageMultiplier = this.getUsageMultiplier(requirements.monthlyUsage);
      fallbackModels.forEach(model => {
        if (model.costPer1M) {
          model.monthlyCost = model.costPer1M * usageMultiplier;
        }
      });
    }

    return fallbackModels.slice(0, 3);
  }
}