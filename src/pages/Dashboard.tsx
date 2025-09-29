import React, { useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { FileExplorer } from '@/components/FileExplorer'
import { CodeEditor } from '@/components/Editor'
import { AiCopilot } from '@/components/AiCopilot'
import { useRepoStore } from '@/store/repo'
import { EmptyState } from '@/components/EmptyState'

export const Dashboard: React.FC = () => {
  const { fetchRepos, currentFile } = useRepoStore()

  useEffect(() => {
    fetchRepos()
  }, [fetchRepos])

  return (
    <Layout>
      <div className="flex h-full">
        <FileExplorer />

        <div className="flex-1">
          {currentFile ? (
            <CodeEditor file={currentFile} />
          ) : (
            <EmptyState />
          )}
        </div>

        <AiCopilot />
      </div>
    </Layout>
  )
}