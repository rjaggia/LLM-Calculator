import { SageMakerClient, ListHubContentsCommand, HubContentInfo } from '@aws-sdk/client-sagemaker';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const sageMakerClient = new SageMakerClient();
const CACHE_FILE = join(__dirname, 'models-cache.json');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getHuggingFaceModelsFromSageMakerHub = async () => {
    // Check cache first
    if (existsSync(CACHE_FILE)) {
        const cacheData = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
        const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION;
        
        if (!isExpired) {
            console.log("Using cached models data...");
            console.log(`Found ${cacheData.models.length} Bedrock capable Hugging Face models (cached)`);
            return cacheData.models;
        }
    }

    let NextToken: string | undefined
    let models: HubContentInfo[] = []
    console.log("Getting models from SageMakerPublicHub...")
    
    let retryCount = 0;
    const maxRetries = 5;
    
    do {
        try {
            const { HubContentSummaries, NextToken: NextNextToken } = await sageMakerClient.send(new ListHubContentsCommand({
                HubName: "SageMakerPublicHub",
                HubContentType: "Model",
                MaxResults: 50, // Reduced from 100 to avoid rate limits
                NextToken
            }))
            NextToken = NextNextToken
            if (!HubContentSummaries || HubContentSummaries.length === 0) {
                //hack: NextToken is never undefined even when there are no more models to return. So using this check as a hack for now
                break
            }
            models = models.concat(HubContentSummaries)
            retryCount = 0; // Reset retry count on successful request
            
            // Add a small delay between requests to avoid rate limiting
            await sleep(100);
        } catch (error: any) {
            if (error.name === 'ThrottlingException' && retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
                await sleep(delay);
                retryCount++;
                continue; // Don't increment NextToken, retry the same request
            }
            throw error; // Re-throw if not throttling or max retries exceeded
        }
    } while (NextToken)
    
    console.log(`Found ${models.length} models in total`)
    const bedrockModels = models.filter(model => model.HubContentSearchKeywords?.includes("@capability:bedrock_console"))
    console.log(`Found ${bedrockModels.length} Bedrock capable models`)
    const huggingFaceBedrockModels = bedrockModels.filter(model => model.HubContentSearchKeywords?.includes("@framework:huggingface"))
    console.log(`Found ${huggingFaceBedrockModels.length} Bedrock capable Hugging Face models`)
    
    // Cache the results
    try {
        writeFileSync(CACHE_FILE, JSON.stringify({
            timestamp: Date.now(),
            models: huggingFaceBedrockModels
        }));
        console.log("Models data cached successfully");
    } catch (error) {
        console.warn("Failed to cache models data:", error);
    }
    
    return huggingFaceBedrockModels
}

//getHuggingFaceModelsFromSageMakerHub().catch(console.error)
