import { SageMakerClient, ListHubContentsCommand, HubContentInfo } from '@aws-sdk/client-sagemaker';

export interface CachedModels {
  timestamp: number;
  models: HubContentInfo[];
}

export class SageMakerService {
  private sageMakerClient: SageMakerClient;
  private cacheFile: string;
  private cacheDuration: number;

  constructor(region: string = 'us-east-1', cacheFile?: string) {
    this.sageMakerClient = new SageMakerClient({ region });
    this.cacheFile = cacheFile || 'models-cache.json';
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getHuggingFaceModelsFromSageMakerHub(): Promise<HubContentInfo[]> {
    // For web deployment, we'll use a fallback approach since we can't cache files
    if (typeof window !== 'undefined') {
      return this.getFallbackModels();
    }

    let NextToken: string | undefined;
    let models: HubContentInfo[] = [];
    console.log("Getting models from SageMakerPublicHub...");
    
    let retryCount = 0;
    const maxRetries = 5;
    
    do {
      try {
        const { HubContentSummaries, NextToken: NextNextToken } = await this.sageMakerClient.send(
          new ListHubContentsCommand({
            HubName: "SageMakerPublicHub",
            HubContentType: "Model",
            MaxResults: 50,
            NextToken
          })
        );
        
        NextToken = NextNextToken;
        if (!HubContentSummaries || HubContentSummaries.length === 0) {
          break;
        }
        
        models = models.concat(HubContentSummaries);
        retryCount = 0;
        
        await this.sleep(100);
      } catch (error: any) {
        if (error.name === 'ThrottlingException' && retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
          await this.sleep(delay);
          retryCount++;
          continue;
        }
        console.error('Error fetching models from SageMaker:', error);
        return this.getFallbackModels();
      }
    } while (NextToken);
    
    console.log(`Found ${models.length} models in total`);
    const bedrockModels = models.filter(model => 
      model.HubContentSearchKeywords?.includes("@capability:bedrock_console")
    );
    console.log(`Found ${bedrockModels.length} Bedrock capable models`);
    
    const huggingFaceBedrockModels = bedrockModels.filter(model => 
      model.HubContentSearchKeywords?.includes("@framework:huggingface")
    );
    console.log(`Found ${huggingFaceBedrockModels.length} Bedrock capable Hugging Face models`);
    
    return huggingFaceBedrockModels;
  }

  private getFallbackModels(): HubContentInfo[] {
    // Fallback models when SageMaker API is not available
    return [
      {
        HubContentName: 'huggingface-llm-phi-3-5-mini-instruct',
        HubContentDisplayName: 'Phi 3.5 Mini Instruct',
        HubContentDescription: 'Microsoft Phi 3.5 Mini instruction-tuned model',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-gemma-7b-instruct',
        HubContentDisplayName: 'Gemma 7B Instruct',
        HubContentDescription: 'Google Gemma 7B instruction-tuned model',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-qwen2-5-72b-instruct',
        HubContentDisplayName: 'Qwen 2.5 72B Instruct',
        HubContentDescription: 'Alibaba Qwen 2.5 72B instruction-tuned model',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-mistral-7b-openorca',
        HubContentDisplayName: 'Mistral 7B OpenOrca',
        HubContentDescription: 'Mistral 7B fine-tuned on OpenOrca dataset',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-bart-large-cnn-samsum',
        HubContentDisplayName: 'BART Large CNN SamSum',
        HubContentDescription: 'BART Large fine-tuned for summarization',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-qwen2-5-14b-instruct',
        HubContentDisplayName: 'Qwen 2.5 14B Instruct',
        HubContentDescription: 'Alibaba Qwen 2.5 14B instruction-tuned model',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-yi-1-5-34b-chat',
        HubContentDisplayName: 'Yi 1.5 34B Chat',
        HubContentDescription: '01.AI Yi 1.5 34B chat model',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      },
      {
        HubContentName: 'huggingface-llm-whisper-large-v3-turbo',
        HubContentDisplayName: 'Whisper Large V3 Turbo',
        HubContentDescription: 'OpenAI Whisper Large V3 Turbo for speech recognition',
        HubContentSearchKeywords: ['@framework:huggingface', '@capability:bedrock_console']
      }
    ];
  }
}