# Amazon Bedrock LLM Selector CLI

A command-line application that helps you find the perfect Hugging Face model on Amazon Bedrock for your specific use case. 

## Features

- 🚀 **Interactive CLI Interface** - User-friendly prompts using @inquirer/prompts
- 🎨 **Colorful Output** - Beautiful terminal output with chalk styling
- 🤖 **AI-Powered Recommendations** - Uses Claude Sonnet 4 to analyze and rank models
- 📊 **Comprehensive Analysis** - Evaluates models based on multiple criteria
- 🔍 **Real-time Model Data** - Fetches latest models from SageMaker Hub

## Requirements

- Node.js 18 or higher
- AWS credentials configured (for Bedrock and SageMaker access)
- Access to Amazon Bedrock Claude Sonnet 4 model
- Access to SageMaker Hub

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd HF-LLM-Calc
```

2. Install dependencies:
```bash
npm install
```

## Usage

Run the application:
```bash
npm start
```

The application will guide you through a series of questions to understand your requirements:

1. **Task Type**: Choose from Text Generation, Code Generation, Summarization, Translation, Question-Answering, or Multi-Modal
2. **Accuracy Priority**: High, Medium, or Basic accuracy requirements
3. **Speed Priority**: High Speed, Medium Speed, or Speed Not Critical
4. **Data Privacy & Security**: High (HIPAA, PCI, GDPR), Medium (PII handling), or Standard
5. **Model Size Preference**: Large (Best Performance), Medium (Balanced), or Small (Fast & Efficient)
6. **Context Window**: Any, 4K, 8K, 32K, or 128K+ tokens
7. **Expected Monthly Usage**: Light (1M), Medium (10M), Heavy (100M), or Enterprise (1B+) tokens per month

After collecting your requirements, the application will:
- Fetch available Hugging Face models from the SageMaker Hub
- Use Claude Sonnet 4 to analyze and rank the models
- Present the top 3 recommendations with detailed explanations

## Sample Output

```
🚀 Amazon Bedrock LLM Selector

The right model for the right task. Automatically.

? What type of task do you need? Text Generation
? What accuracy level do you require? High Accuracy
? What speed requirement do you have? Medium Speed
...

🔍 Fetching available models from SageMaker Hub...
✅ Found 150 available models
🤖 Analyzing models with Claude Sonnet 4...

✨ Top 3 Model Recommendations

🥇 Recommendation 1
Model: Llama-2-70b-chat-hf
Score: 95/100
Reasoning: This model excels at text generation tasks with high accuracy...

🥈 Recommendation 2
Model: Mistral-7B-Instruct-v0.1
Score: 88/100
Reasoning: Provides excellent balance between performance and efficiency...

🥉 Recommendation 3
Model: CodeLlama-34b-Instruct-hf
Score: 82/100
Reasoning: While primarily designed for code, it offers strong text capabilities...

Thank you for using the LLM Calculator! 🎉
```

## AWS Configuration

Make sure your AWS credentials are configured with access to:
- Amazon Bedrock (specifically Claude Sonnet 4)
- SageMaker Hub

You can configure AWS credentials using:
- AWS CLI: `aws configure`
- Environment variables
- IAM roles (for EC2 instances)
- AWS credential files

Required permissions:
- `bedrock:InvokeModel`
- `sagemaker:ListHubContents`

## Project Structure

```
├── index.ts          # Main application entry point
├── sagemaker.ts      # SageMaker Hub integration
├── package.json      # Project dependencies
└── README.md         # This file
```

## Dependencies

- `@inquirer/prompts` - Interactive CLI prompts
- `chalk` - Terminal styling
- `@aws-sdk/client-bedrock-runtime` - Bedrock API client
- `@aws-sdk/client-sagemaker` - SageMaker API client
- `tsx` - TypeScript execution

## Development

To run in development mode:
```bash
npx tsx index.ts
```

## License

This project is private and proprietary.
