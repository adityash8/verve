interface AiSuggestionRequest {
  content: string
  type: 'optimization' | 'debug' | 'copy-variant'
  context?: {
    platform?: string
    metrics?: Record<string, number>
    target?: Record<string, number>
  }
}

interface AiSuggestionResponse {
  suggestions: Array<{
    type: string
    content: string
    confidence: number
    bias_type?: string
    explanation: string
  }>
}

export class AiService {
  constructor(private _apiKey: string) {
    // API key will be used for actual Claude API calls in production
    console.log('AI Service initialized with API key:', _apiKey ? 'provided' : 'missing')
  }

  async getSuggestions(request: AiSuggestionRequest): Promise<AiSuggestionResponse> {
    // Simulated AI service - in production, this would call Claude API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay

    const mockSuggestions = this.generateMockSuggestions(request)

    return {
      suggestions: mockSuggestions
    }
  }

  private generateMockSuggestions(request: AiSuggestionRequest) {
    const suggestions = []

    if (request.type === 'optimization') {
      suggestions.push({
        type: 'bid_strategy',
        content: 'Consider switching to Target CPA bidding with $220 target',
        confidence: 0.85,
        explanation: 'Based on your current CPA trends, Target CPA bidding could improve efficiency'
      })

      suggestions.push({
        type: 'copy_variant',
        content: 'Try scarcity-based headlines: "Limited Time: Get 50% Off"',
        confidence: 0.78,
        bias_type: 'scarcity',
        explanation: 'Scarcity bias can increase urgency and conversion rates'
      })
    }

    if (request.type === 'debug') {
      if (request.context?.metrics?.cpa && request.context.metrics.cpa > 250) {
        suggestions.push({
          type: 'targeting_fix',
          content: 'Your CPA is high. Consider narrowing audience targeting or adjusting bid strategy',
          confidence: 0.90,
          explanation: 'High CPA often indicates broad targeting or competitive bidding issues'
        })
      }
    }

    if (request.type === 'copy-variant') {
      suggestions.push({
        type: 'headline_variant',
        content: 'Alternative: "Join 10,000+ Users Who Saved 40% This Month"',
        confidence: 0.82,
        bias_type: 'social_proof',
        explanation: 'Social proof can increase trust and conversion rates'
      })
    }

    return suggestions
  }

  async debugCampaign(_campaignData: any, metrics: Record<string, number>) {
    const issues = []

    // Check for common issues
    if (metrics.cpa > 300) {
      issues.push({
        type: 'high_cpa',
        severity: 'high',
        description: 'Cost per acquisition is significantly above target',
        suggestions: [
          'Review and narrow audience targeting',
          'Adjust bid strategy to Target CPA',
          'Pause underperforming ad groups'
        ]
      })
    }

    if (metrics.roas < 2) {
      issues.push({
        type: 'low_roas',
        severity: 'medium',
        description: 'Return on ad spend is below profitable threshold',
        suggestions: [
          'Optimize landing pages for conversions',
          'Test new ad creative variations',
          'Review attribution settings'
        ]
      })
    }

    return { issues }
  }
}

// Export a default instance with environment API key
export const aiService = new AiService(
  import.meta.env.VITE_ANTHROPIC_API_KEY || 'demo-key'
)