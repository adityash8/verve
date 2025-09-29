import React, { useState } from 'react'
import { useRepoStore } from '@/store/repo'
import { aiService } from '@/lib/ai'
import { Bot, Send, Lightbulb, AlertTriangle, Zap } from 'lucide-react'

interface AiSuggestion {
  type: string
  content: string
  confidence: number
  bias_type?: string
  explanation: string
}

export const AiCopilot: React.FC = () => {
  const { currentFile } = useRepoStore()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !currentFile) return

    setLoading(true)
    try {
      const response = await aiService.getSuggestions({
        content: currentFile.content,
        type: determineQueryType(query),
        context: {
          platform: 'google-ads' // Could be extracted from file content
        }
      })

      setSuggestions(response.suggestions)
    } catch (error) {
      console.error('AI request failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const determineQueryType = (query: string): 'optimization' | 'debug' | 'copy-variant' => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes('debug') || lowerQuery.includes('problem') || lowerQuery.includes('issue')) {
      return 'debug'
    }
    if (lowerQuery.includes('copy') || lowerQuery.includes('headline') || lowerQuery.includes('rewrite')) {
      return 'copy-variant'
    }
    return 'optimization'
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'debug':
        return AlertTriangle
      case 'optimization':
        return Zap
      default:
        return Lightbulb
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const quickPrompts = [
    'Optimize for lower CPA',
    'Debug high cost issues',
    'Suggest copy variants',
    'Apply scarcity bias',
    'Improve targeting'
  ]

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Bot className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">AI Copilot</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI to optimize, debug, or suggest..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={!currentFile}
            />
            <button
              type="submit"
              disabled={loading || !query.trim() || !currentFile}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {!currentFile && (
            <p className="text-xs text-gray-500">Select a file to get AI suggestions</p>
          )}
        </form>

        {/* Quick Prompts */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setQuery(prompt)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                disabled={!currentFile}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="text-center py-8">
            <Bot className="h-8 w-8 mx-auto mb-2 text-primary-600 animate-pulse" />
            <p className="text-sm text-gray-500">AI is thinking...</p>
          </div>
        )}

        {suggestions.length > 0 && !loading && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Suggestions</h4>
            {suggestions.map((suggestion, index) => {
              const IconComponent = getIcon(suggestion.type)
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <IconComponent className="h-4 w-4 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {suggestion.type.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(suggestion.confidence)}`}>
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>

                      {suggestion.bias_type && (
                        <div className="mb-2">
                          <span className="inline-block text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {suggestion.bias_type.replace('_', ' ')}
                          </span>
                        </div>
                      )}

                      <p className="text-sm text-gray-700 mb-2">
                        {suggestion.content}
                      </p>

                      <p className="text-xs text-gray-500">
                        {suggestion.explanation}
                      </p>

                      <button className="mt-2 text-xs btn-primary">
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Bot className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Ask AI for optimization suggestions</p>
          </div>
        )}
      </div>
    </div>
  )
}