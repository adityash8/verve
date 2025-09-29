import { create } from 'zustand'
import { User } from '@/types'
import { auth } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await auth.signInWithPassword({ email, password })
    if (error) throw error

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url
        }
      })
    }
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url
        }
      })
    }
  },

  signOut: async () => {
    const { error } = await auth.signOut()
    if (error) throw error
    set({ user: null })
  },

  signInWithGoogle: async () => {
    const { error } = await auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) throw error
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await auth.getSession()

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url
          },
          loading: false
        })
      } else {
        set({ user: null, loading: false })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      set({ user: null, loading: false })
    }
  }
}))

auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
        avatar_url: session.user.user_metadata?.avatar_url
      }
    })
  } else {
    useAuthStore.setState({ user: null })
  }
})