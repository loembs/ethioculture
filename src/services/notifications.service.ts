// =============================================
// SERVICE NOTIFICATIONS - SUPABASE
// =============================================
import { supabase } from '@/config/supabase'

export const notificationsService = {
  // Récupérer les notifications
  async getNotifications(limit: number = 20) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Récupérer les notifications non lues
  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.id)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  },

  // Marquer comme lue
  async markAsRead(notificationId: number) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
  },

  // Marquer toutes comme lues
  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userData.id)
      .eq('is_read', false)

    if (error) throw error
  },

  // S'abonner aux notifications en temps réel
  subscribeToNotifications(callback: (notification: any) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => callback(payload.new)
      )
      .subscribe()
  }
}

