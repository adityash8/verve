import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useRepoStore } from '@/store/repo'
import { CampaignFile } from '@/types'
import * as yaml from 'js-yaml'

interface EditorProps {
  file: CampaignFile
}

export const CodeEditor: React.FC<EditorProps> = ({ file }) => {
  const { updateFile } = useRepoStore()
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleChange = (value: string | undefined) => {
    if (value !== undefined && value !== file.content) {
      updateFile(file.id, value)
    }
  }

  const getLanguage = (file: CampaignFile) => {
    if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
      return 'yaml'
    }
    if (file.name.endsWith('.json')) {
      return 'json'
    }
    return 'yaml' // Default to YAML for campaign files
  }

  const validateContent = (content: string) => {
    try {
      if (getLanguage(file) === 'yaml') {
        yaml.load(content)
      } else if (getLanguage(file) === 'json') {
        JSON.parse(content)
      }
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{file.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{file.type.replace('-', ' ')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded text-xs ${
              validateContent(file.content)
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {validateContent(file.content) ? 'Valid' : 'Invalid'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage(file)}
          value={file.content}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Fira Code, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
          }}
        />
      </div>
    </div>
  )
}