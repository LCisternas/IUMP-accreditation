"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserX, AlertTriangle, HelpCircle } from "lucide-react"
import type { User } from "@/lib/mock-data"

interface DeleteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  member: User | null
  isAccredited: boolean
}

export function DeleteMemberModal({ isOpen, onClose, onConfirm, member, isAccredited }: DeleteMemberModalProps) {
  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-600" />
            Eliminar Miembro
          </DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas eliminar este miembro?</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del miembro */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium">{member.full_name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">RUT: {member.rut}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email: {member.email}</p>
          </div>

          {/* Alerta si está acreditado */}
          {isAccredited ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>No se puede eliminar este miembro</strong>
                <br />
                El miembro ya está acreditado. Para eliminarlo debe dirigirse a la mesa de soporte en el evento.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                Esta acción eliminará permanentemente al miembro y su cupón de almuerzo asociado.
              </AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            {isAccredited ? (
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Ir a Mesa de Soporte
              </Button>
            ) : (
              <Button variant="destructive" onClick={onConfirm} className="flex-1">
                <UserX className="h-4 w-4 mr-2" />
                Eliminar Miembro
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
