import React from 'react'
import { useRepoStore } from '@/store/repo'
import { FileText, Plus, Zap } from 'lucide-react'

export const EmptyState: React.FC = () => {
  const { currentRepo } = useRepoStore()

  if (!currentRepo) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Verve
          </h2>
          <p className="text-gray-600 mb-6">
            Your AI-powered marketing IDE. Create a repository to start managing your campaigns like code.
          </p>
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Store campaigns as version-controlled files</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Get AI suggestions and optimizations</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Deploy directly to ad platforms</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No file selected
        </h3>
        <p className="text-gray-600 mb-4">
          Choose a file from the explorer or create a new one to start editing.
        </p>
        <div className="text-sm text-gray-500">
          <p>💡 Tip: Use Cmd+K to quickly access AI suggestions</p>
        </div>
      </div>
    </div>
  )
}