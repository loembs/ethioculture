// =============================================
// NOTIFICATION BELL
// =============================================
import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { notificationsService } from '@/services/notifications.service'
import { ScrollArea } from '@/components/ui/scroll-area'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()

    // S'abonner aux nouvelles notifications
    const subscription = notificationsService.subscribeToNotifications((newNotif) => {
      setNotifications(prev => [newNotif, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadNotifications() {
    try {
      const data = await notificationsService.getNotifications(10)
      setNotifications(data)
    } catch (error) {
      // Utilisateur non connecté
    }
  }

  async function loadUnreadCount() {
    try {
      const count = await notificationsService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      // Utilisateur non connecté
    }
  }

  async function handleMarkAsRead(id: number) {
    await notificationsService.markAsRead(id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => notificationsService.markAllAsRead()}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune notification
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notif.is_read ? 'bg-background' : 'bg-blue-50'
                  }`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.message}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

