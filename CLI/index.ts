import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { getHuggingFaceModelsFromSageMakerHub } from './sagemaker';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

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
}

const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

async function collectUserRequirements(): Promise<UserRequirements> {
  console.log(chalk.cyan.bold('\n🚀 Amazon Bedrock LLM Selector\n'));
  console.log(chalk.gray('The right model for the right task. Automatically.\n'));

  const taskType = await select({
    message: 'What type of task do you need?',
    choices: [
      { name: 'Text Generation', value: 'text_generation' },
      { name: 'Code Generation', value: 'code_generation' },
      { name: 'Summarization', value: 'summarization' },
      { name: 'Translation', value: 'translation' },
      { name: 'Question-Answering', value: 'question_answering' },
      { name: 'Multi-Modal', value: 'multi_modal' },
    ],
  });

  const accuracyPriority = await select({
    message: 'What accuracy level do you require?',
    choices: [
      { name: 'High Accuracy', value: 'high' },
      { name: 'Medium Accuracy', value: 'medium' },
      { name: 'Basic Accuracy', value: 'basic' },
    ],
  });

  const speedPriority = await select({
    message: 'What speed requirement do you have?',
    choices: [
      { name: 'High Speed', value: 'high' },
      { name: 'Medium Speed', value: 'medium' },
      { name: 'Speed Not Critical', value: 'low' },
    ],
  });

  const dataPrivacy = await select({
    message: 'What are your data privacy and security requirements?',
    choices: [
      { name: 'High (HIPAA, PCI, GDPR)', value: 'high' },
      { name: 'Medium (PII handling)', value: 'medium' },
      { name: 'Standard', value: 'standard' },
    ],
  });

  const modelSize = await select({
    message: 'What model size preference do you have?',
    choices: [
      { name: 'Large (Best Performance)', value: 'large' },
      { name: 'Medium (Balanced)', value: 'medium' },
      { name: 'Small (Fast & Efficient)', value: 'small' },
    ],
  });

  const contextWindow = await select({
    message: 'What context window do you need?',
    choices: [
      { name: 'Any context window', value: 'any' },
      { name: '4K tokens', value: '4k' },
      { name: '8K tokens', value: '8k' },
      { name: '32K tokens', value: '32k' },
      { name: '128K+ tokens', value: '128k+' },
    ],
  });

  const monthlyUsage = await select({
    message: 'What is your expected monthly usage?',
    choices: [
      { name: 'Light (1M tokens/month)', value: 'light' },
      { name: 'Medium (10M tokens/month)', value: 'medium' },
      { name: 'Heavy (100M tokens/month)', value: 'heavy' },
      { name: 'Enterprise (1B+ tokens/month)', value: 'enterprise' },
    ],
  });

  return {
    taskType,
    accuracyPriority,
    speedPriority,
    dataPrivacy,
    modelSize,
    contextWindow,
    monthlyUsage,
  };
}

async function getModelRecommendations(
  requirements: UserRequirements,
  availableModels: any[]
): Promise<ModelRecommendation[]> {
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
      "reasoning": "detailed explanation of why this model fits the requirements"
    },
    {
      "modelName": "exact model name from the list", 
      "score": 88,
      "reasoning": "detailed explanation of why this model fits the requirements"
    },
    {
      "modelName": "exact model name from the list",
      "score": 82,
      "reasoning": "detailed explanation of why this model fits the requirements"
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

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const content = responseBody.content[0].text;
    
    // Parse the JSON response
    const parsed = JSON.parse(content);
    return parsed.recommendations;
  } catch (error) {
    console.error(chalk.red('Error getting recommendations from Bedrock:'), error);
    throw error;
  }
}

function displayRecommendations(recommendations: ModelRecommendation[]) {
  console.log(chalk.green.bold('\n✨ Top 3 Model Recommendations\n'));

  recommendations.forEach((rec, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    console.log(chalk.yellow.bold(`${medal} Recommendation ${index + 1}`));
    console.log(chalk.blue.bold(`Model: ${rec.modelName}`));
    console.log(chalk.cyan(`Score: ${rec.score}/100`));
    console.log(chalk.white(`Reasoning: ${rec.reasoning}\n`));
  });
}

async function main() {
  try {
    console.log(chalk.magenta('🔄 Starting LLM Calculator...'));
    
    // Collect user requirements
    const requirements = await collectUserRequirements();
    
    console.log(chalk.yellow('\n🔍 Fetching available models from SageMaker Hub...'));
    
    // Get available models
    const availableModels = await getHuggingFaceModelsFromSageMakerHub();
    
    if (availableModels.length === 0) {
      console.log(chalk.red('❌ No models found. Please check your AWS configuration.'));
      return;
    }
    
    console.log(chalk.green(`✅ Found ${availableModels.length} available models`));
    console.log(chalk.yellow('🤖 Analyzing models with Claude Sonnet 4...'));
    
    // Get recommendations from Claude
    const recommendations = await getModelRecommendations(requirements, availableModels);
    
    // Display results
    displayRecommendations(recommendations);
    
    console.log(chalk.gray('Thank you for using the LLM Calculator! 🎉'));
    
  } catch (error) {
    console.error(chalk.red('❌ An error occurred:'), error);
    process.exit(1);
  }
}

// Run the application
main();
