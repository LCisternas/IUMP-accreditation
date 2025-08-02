'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  Users,
  Mail,
  Phone,
  UserPlus,
  MapPin,
} from 'lucide-react';
import {
  getMembersByChurch,
  updateUserAccreditation,
  mockAuth,
  type Church,
} from '@/lib/mock-data';
import { AddMemberModal } from './add-member-modal';
import { createClient } from '@/lib/supabase/client';

interface ChurchDetailsModalProps {
  church: Church | null;
  isOpen: boolean;
  onClose: () => void;
  onMembersUpdate?: () => void;
  churchID: ChurchINFO;
}

export interface Region {
  id: string;
  name: string;
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  region_id: string;
}

export interface User {
  id: string;
  age: number;
  rut: string;
  role: string;           // UUID of the role
  email: string;
  phone: string;          // E.164 format
  gender: string;
  zone_id: string;        // UUID of the zone
  church_id: string;      // UUID of the church
  full_name: string;
  region_id: string;      // UUID of the region
  updated_at: string | null;  // ISO 8601 timestamp or null
  created_at: string;         // ISO 8601 timestamp
  is_accredited: boolean;
}

export interface ChurchINFO {
  id: string;
  name: string;
  region_id: string;
  zone_id: string;
  created_at: string; // ISO 8601 timestamp
  USERS: User[]
}

export function ChurchDetailsModal({
  church,
  isOpen,
  onClose,
  onMembersUpdate,
  churchID,
}: ChurchDetailsModalProps) {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [churchDisplay, setChurchDisplay] = useState<ChurchINFO[]>([]);

  const supabase = createClient();

  const getChurchMembers = async () => {
    const { data, error } = await supabase
      .from('churches')
      .select(
        `
          *,
          USERS: users(*)
        `
      )
      .eq('id', churchID.id);
    if (error) {
      console.log(error, 'ERROR GET CHURCH INFO');
    } else {
      console.log(data);
      //@ts-expect-error sssss
      setChurchDisplay(data as ChurchINFO[]);
    }
  };

  useEffect(() => {
    if (churchID) {
      getChurchMembers();
    }
  }, [churchID]);

  console.log(churchDisplay, "aqui");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {/* {church.name} */}
            </DialogTitle>
            <DialogDescription>
              Información detallada de la iglesia y gestión de miembros
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Miembros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{members.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de miembros */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Miembros de la Iglesia</CardTitle>
                    <CardDescription>
                      {/* {canAccredit
                        ? 'Gestiona el estado de acreditación de los miembros'
                        : 'Lista de miembros de la iglesia'} */}
                    </CardDescription>
                  </div>
                  {/* {canAddMembers && (
                    <Button
                      onClick={() => setShowAddMember(true)}
                      disabled={availableSlots <= 0}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Miembro
                    </Button>
                  )} */}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Cargando miembros...</p>
                  </div>
                ) : churchDisplay.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RUT</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Estado</TableHead>
                        {/* {canAccredit && <TableHead>Acciones</TableHead>} */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {churchDisplay.map((member) => (
                        member.USERS.map(i => (
                          <TableRow key={member.id}>
                          <TableCell className="font-mono text-sm">
                            {i.rut}
                          </TableCell>
                          <TableCell className="font-medium">
                            {i.full_name}
                          </TableCell>
                          <TableCell>{i.email}</TableCell>
                          <TableCell>
                            {i.phone || 'No registrado'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                i.is_accredited ? 'default' : 'secondary'
                              }
                            >
                              {i.is_accredited ? (
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
                          </TableCell>
                          {/* {canAccredit && (
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleToggleAccreditation(
                                    member.id,
                                    member.is_accredited
                                  )
                                }
                              >
                                {member.is_accredited
                                  ? 'Desacreditar'
                                  : 'Acreditar'}
                              </Button>
                            </TableCell>
                          )} */}
                        </TableRow>
                        ))
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No hay miembros registrados en esta iglesia
                    </p>
                    {/* {canAddMembers && (
                      <Button onClick={() => setShowAddMember(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Agregar Primer Miembro
                      </Button>
                    )} */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
