import { create } from 'zustand'
import { CampaignRepo, CampaignFile } from '@/types'
import { supabase } from '@/lib/supabase'

interface RepoState {
  repos: CampaignRepo[]
  currentRepo: CampaignRepo | null
  currentFile: CampaignFile | null
  loading: boolean

  fetchRepos: () => Promise<void>
  createRepo: (name: string, description?: string) => Promise<CampaignRepo>
  selectRepo: (repo: CampaignRepo) => void
  selectFile: (file: CampaignFile) => void

  createFile: (name: string, type: CampaignFile['type'], content?: string) => Promise<CampaignFile>
  updateFile: (fileId: string, content: string) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
}

export const useRepoStore = create<RepoState>((set, get) => ({
  repos: [],
  currentRepo: null,
  currentFile: null,
  loading: false,

  fetchRepos: async () => {
    set({ loading: true })
    try {
      const { data: repos, error } = await supabase
        .from('campaign_repos')
        .select(`
          *,
          files:campaign_files(*)
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ repos: repos || [] })
    } catch (error) {
      console.error('Failed to fetch repos:', error)
    } finally {
      set({ loading: false })
    }
  },

  createRepo: async (name: string, description?: string) => {
    const { data, error } = await supabase
      .from('campaign_repos')
      .insert({ name, description })
      .select()
      .single()

    if (error) throw error

    const newRepo = { ...data, files: [] }
    set(state => ({ repos: [newRepo, ...state.repos] }))
    return newRepo
  },

  selectRepo: (repo: CampaignRepo) => {
    set({ currentRepo: repo, currentFile: null })
  },

  selectFile: (file: CampaignFile) => {
    set({ currentFile: file })
  },

  createFile: async (name: string, type: CampaignFile['type'], content = '') => {
    const { currentRepo } = get()
    if (!currentRepo) throw new Error('No repo selected')

    const path = `/${name}`
    const { data, error } = await supabase
      .from('campaign_files')
      .insert({
        repo_id: currentRepo.id,
        name,
        path,
        content,
        type
      })
      .select()
      .single()

    if (error) throw error

    set(state => ({
      currentRepo: state.currentRepo ? {
        ...state.currentRepo,
        files: [...state.currentRepo.files, data]
      } : null
    }))

    return data
  },

  updateFile: async (fileId: string, content: string) => {
    const { error } = await supabase
      .from('campaign_files')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', fileId)

    if (error) throw error

    set(state => ({
      currentRepo: state.currentRepo ? {
        ...state.currentRepo,
        files: state.currentRepo.files.map(file =>
          file.id === fileId ? { ...file, content } : file
        )
      } : null,
      currentFile: state.currentFile?.id === fileId
        ? { ...state.currentFile, content }
        : state.currentFile
    }))
  },

  deleteFile: async (fileId: string) => {
    const { error } = await supabase
      .from('campaign_files')
      .delete()
      .eq('id', fileId)

    if (error) throw error

    set(state => ({
      currentRepo: state.currentRepo ? {
        ...state.currentRepo,
        files: state.currentRepo.files.filter(file => file.id !== fileId)
      } : null,
      currentFile: state.currentFile?.id === fileId ? null : state.currentFile
    }))
  }
}))