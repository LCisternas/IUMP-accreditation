'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRGenerator } from '@/components/qr-generator';
import { mockAuth, mockTickets } from '@/lib/mock-data';
import { QRCodeSVG } from 'qrcode.react';
import {
  User,
  Church,
  Ticket,
  CheckCircle,
  Clock,
  LogOut,
  CreditCard,
  Coffee,
  Utensils,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Representa cada ticket asociado al usuario
export interface Tick {
  id: string;
  is_used: boolean;
  qr_code: string;
  used_at: string | null;
  user_id: string;
  created_at: string;
  ticket_type: string;
}

// Representa el usuario junto con sus tickets
export interface User {
  rut: string;
  email: string;
  phone: string;
  gender: string; // puede quedar vacío si no se informa
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
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error, 'error logout');
    } else {
      router.push('/');
    }
  };

  const getUserAndTickerts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select(
          `
            *,
            TICKS: tickets(*)
          `
        )
        .eq('id', user?.id)
        .single();
      if (error) {
        console.log('error en user get', error);
      } else {
        console.log(data);
        //@ts-expect-error jsjsjsjsj
        setUser(data);
      }
    }
  };

  useEffect(() => {
    getUserAndTickerts();
  }, []);

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
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">RUT</label>
                <p className="text-lg font-mono">{user.rut}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nombre Completo
                </label>
                <p className="text-lg">{user.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Teléfono
                </label>
                <p className="text-lg">{user.phone || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Iglesia
                </label>
                <p className="text-lg flex items-center gap-2">
                  <Church className="h-4 w-4" />
                  {user.church_id || 'No asignada'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Zona
                </label>
                <p className="text-lg">{user.zone_id || 'No asignada'}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
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

        {/* Cupones/Tickets */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <Ticket className="h-5 w-5" />
            Mis Cupones
          </h2>

          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.TICKS.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={ticket.is_used ? 'opacity-60' : ''}
                >
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2"></CardTitle>
                    <CardDescription>
                      {ticket.is_used ? (
                        <span className="text-red-600">
                          Canjeado el{' '}
                          {new Date(ticket.used_at!).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-600">
                          Disponible para canjear
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <h2>{ticket.ticket_type}</h2>
                    <div className="flex justify-center">
                      <QRCodeSVG value={ticket.qr_code} size={256} />
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {ticket.qr_code}
                    </p>
                    <Badge variant={ticket.is_used ? 'destructive' : 'default'}>
                      {ticket.is_used ? 'Canjeado' : 'Disponible'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tienes cupones asignados aún</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
