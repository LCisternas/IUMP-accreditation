'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  User as LucideUser,
  Church,
  Ticket,
  CheckCircle,
  Clock,
  LogOut,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';

const QrReader = dynamic(() => import('react-qr-barcode-scanner'), {
  ssr: false,
});

export interface Tick {
  id: string;
  is_used: boolean;
  qr_code: string;
  used_at: string | null;
  user_id: string;
  created_at: string;
  ticket_type: string;
}

export interface User {
  rut: string;
  email: string;
  phone: string;
  gender: string;
  age: number | null;
  church_id: string;
  region_id: string;
  zone_id: string;
  is_accredited: boolean;
  created_at: string;
  update_at: string | null;
  role: string;
  id: string;
  full_name: string;
  TICKS: Tick[];
}

export default function AttendeePage() {
  const [user, setUser] = useState<User>({
    rut: '',
    email: '',
    phone: '',
    gender: '',
    age: null,
    church_id: '',
    region_id: '',
    zone_id: '',
    is_accredited: false,
    created_at: '',
    update_at: null,
    role: '',
    id: '',
    full_name: '',
    TICKS: [],
  });

  const [scanActive, setScanActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastScan, setLastScan] = useState<string>('');
  const [modalState, setModalState] = useState<{
    open: boolean;
    status: 'success' | 'error' | null;
  }>({ open: false, status: null });

  const router = useRouter();
  const supabase = createClient();

  const toggleScanner = () => {
    setScanActive((prev) => !prev);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push('/');
  };

  const getUserAndTickets = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select(`*, TICKS: tickets(*)`)
        .eq('id', user.id)
        .single();
      if (!error) {
        setUser(data as User);
      }
    }
  };

  useEffect(() => {
    getUserAndTickets();
  }, []);

  const handleScan = async (data: string | null) => {
    if (!data || status !== 'idle' || data === lastScan) return;

    const qrCode = data;
    setLastScan(qrCode);
    setStatus('idle');

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq('qr_code', qrCode)
      .eq('is_used', false)
      .select()
      .single();

    if (ticket && !error) {
      setStatus('success');
      setModalState({ open: true, status: 'success' });
      getUserAndTickets();
    } else {
      setStatus('error');
      setModalState({ open: true, status: 'error' });
    }

    setTimeout(() => setStatus('idle'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Acreditación
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Información personal y cupones del evento
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Información del usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideUser className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">RUT</label>
              <p className="text-lg font-mono">{user.rut}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Nombre Completo</label>
              <p className="text-lg">{user.full_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Teléfono</label>
              <p className="text-lg">{user.phone || 'No registrado'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Iglesia</label>
              <p className="text-lg flex items-center gap-2">
                <Church className="h-4 w-4" />
                {user.church_id || 'No asignada'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Zona</label>
              <p className="text-lg">{user.zone_id || 'No asignada'}</p>
            </div>
            <div className="col-span-full pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Estado de Acreditación:
                </span>
                <Badge variant={user.is_accredited ? 'default' : 'secondary'}>
                  {user.is_accredited ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Acreditado
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Pendiente
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escáner QR */}
        <div className="pt-8 border-t text-center space-y-4">
          <h2 className="text-xl font-semibold">Escanear Código QR</h2>
          <div className="w-full max-w-sm mx-auto border rounded-md overflow-hidden">
            <div>
              <button onClick={toggleScanner}>
                {scanActive ? 'Detener Escaneo' : 'Iniciar Escaneo'}
              </button>

              {scanActive && (
                <QrReader
                  onUpdate={(err, result) => {
                    if (result) handleScan(result.getText());
                  }}
                  width={400}
                  height={300}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Feedback */}
      <Dialog
        open={modalState.open}
        onOpenChange={(open) =>
          !open && setModalState({ open: false, status: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalState.status === 'success' ? (
                <>
                  <CheckCircle className="text-green-500" />
                  ¡Ticket validado!
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" />
                  Código inválido
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {modalState.status === 'success'
                ? 'El ticket ha sido validado correctamente.'
                : 'Este código es inválido o ya fue canjeado.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Entendido</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
