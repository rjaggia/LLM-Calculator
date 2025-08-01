import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService, UserRequirements } from '../../../lib/recommendation-service';
import { SageMakerService } from '../../../lib/sagemaker-service';

export async function POST(request: NextRequest) {
  try {
    const requirements: UserRequirements = await request.json();
    
    // Initialize services
    const recommendationService = new RecommendationService();
    const sageMakerService = new SageMakerService();
    
    try {
      // Try to get real models from SageMaker
      const availableModels = await sageMakerService.getHuggingFaceModelsFromSageMakerHub();
      
      if (availableModels.length > 0) {
        // Use Bedrock for recommendations with real models
        const recommendations = await recommendationService.getModelRecommendations(
          requirements,
          availableModels
        );
        
        return NextResponse.json({
          success: true,
          recommendations,
          source: 'bedrock'
        });
      }
    } catch (error) {
      console.warn('Failed to get recommendations from Bedrock, using fallback:', error);
    }
    
    // Fallback to static recommendations
    const fallbackRecommendations = recommendationService.getFallbackRecommendations(requirements);
    
    return NextResponse.json({
      success: true,
      recommendations: fallbackRecommendations,
      source: 'fallback'
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