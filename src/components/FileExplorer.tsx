import React, { useState } from 'react'
import { useRepoStore } from '@/store/repo'
import { CampaignFile } from '@/types'
import {
  File,
  Plus,
  Folder,
  Target,
  Search,
  FileText,
  Settings,
  Trash2
} from 'lucide-react'

const FILE_TYPE_ICONS = {
  'ad-campaign': Target,
  'seo-hub': Search,
  'content-spec': FileText,
  'automation': Settings,
  'config': Settings
}

export const FileExplorer: React.FC = () => {
  const { currentRepo, currentFile, selectFile, createFile, deleteFile } = useRepoStore()
  const [newFileType, setNewFileType] = useState<CampaignFile['type']>('ad-campaign')
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)

  const handleCreateFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    if (!name) return

    try {
      const fileName = name.endsWith('.yaml') ? name : `${name}.yaml`
      const newFile = await createFile(fileName, newFileType, getDefaultContent(newFileType))
      selectFile(newFile)
      setShowNewFileDialog(false)
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  }

  const getDefaultContent = (type: CampaignFile['type']): string => {
    switch (type) {
      case 'ad-campaign':
        return `name: "New Campaign"
platform: "google-ads"
budget:
  daily: 100
  total: 3000
targeting:
  demographics:
    age: "25-54"
    gender: "all"
  interests: []
  keywords: []
ads:
  - headline: "Your Compelling Headline"
    description: "Describe your value proposition"
    call_to_action: "Learn More"
    landing_page: "https://example.com"
bidding:
  strategy: "target_cpa"
  target_cpa: 220`

      case 'seo-hub':
        return `title: "SEO Hub Title"
meta_description: "Compelling meta description"
target_keywords:
  - "primary keyword"
  - "secondary keyword"
content_pillars:
  - topic: "Main Topic"
    pages: []
internal_linking:
  strategy: "hub_and_spoke"
  anchor_texts: []`

      case 'content-spec':
        return `title: "Content Piece Title"
type: "blog_post"
target_audience: "Target personas"
word_count: 1500
structure:
  - section: "Introduction"
    points: []
  - section: "Main Content"
    points: []
  - section: "Conclusion"
    points: []
cta: "Call to action"
distribution:
  channels: []`

      default:
        return `# New ${type.replace('-', ' ')}
# Add your configuration here`
    }
  }

  if (!currentRepo) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <Folder className="h-12 w-12 mx-auto mb-2" />
          <p>Select a repository to view files</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Files</h3>
          <button
            onClick={() => setShowNewFileDialog(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500">{currentRepo.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentRepo.files.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <File className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No files yet</p>
            <button
              onClick={() => setShowNewFileDialog(true)}
              className="text-primary-600 hover:text-primary-700 text-sm mt-1"
            >
              Create your first file
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {currentRepo.files.map((file) => {
              const IconComponent = FILE_TYPE_ICONS[file.type] || File
              const isSelected = currentFile?.id === file.id

              return (
                <div
                  key={file.id}
                  className={`group flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectFile(file)}
                >
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this file?')) {
                        deleteFile(file.id)
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New File</h3>

            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="campaign-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as CampaignFile['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ad-campaign">Ad Campaign</option>
                  <option value="seo-hub">SEO Hub</option>
                  <option value="content-spec">Content Spec</option>
                  <option value="automation">Automation</option>
                  <option value="config">Config</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewFileDialog(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}