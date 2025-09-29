import React from 'react'
import { useAuthStore } from '@/store/auth'
import { useRepoStore } from '@/store/repo'
import { LogOut, Plus, Settings, User } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuthStore()
  const { repos, currentRepo, createRepo } = useRepoStore()

  const handleCreateRepo = async () => {
    const name = prompt('Repository name:')
    if (name) {
      try {
        await createRepo(name)
      } catch (error) {
        console.error('Failed to create repo:', error)
      }
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Verve</h1>
          <p className="text-sm text-gray-600">Marketing IDE</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <User className="h-5 w-5 text-primary-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Repositories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Repositories</h3>
              <button
                onClick={handleCreateRepo}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {repos.map((repo) => (
                <button
                  key={repo.id}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                    currentRepo?.id === repo.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{repo.name}</div>
                  {repo.description && (
                    <div className="text-xs text-gray-500 mt-1">{repo.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="flex-1 btn-secondary text-xs">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </button>
            <button
              onClick={signOut}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}