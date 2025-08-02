'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Papa from 'papaparse';
import {
  ChurchIcon,
  Users,
  UserCheck,
  Plus,
  LogOut,
  MapPin,
  Settings,
  User,
  Shield,
  Eye,
  ChefHat,
} from 'lucide-react';
import { ExcelUploader } from '@/components/excel-uploader';
import {
  mockChurches,
  mockAuth,
  getChurchesGroupedByZone,
  mockUsers,
} from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

// Importar los componentes
import { ChurchDetailsModal } from '@/components/church-details-modal';
import { NewChurchModal } from '@/components/new-church-modal';
import { ZoneManagementModal } from '@/components/zone-management-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { v4 as uuid } from 'uuid';
import { Input } from '@/components/ui/input';

type Region = {
  id: string;
  name: string;
  created_at: string;
};

type Zone = {
  id: string;
  name: string;
  code: string;
  region_id: string;
  created_at: string;
};

export type User = {
  id: string;
  rut: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  is_accredited: boolean | null;
};

/** Iglesia con conteo de usuarios */
export type Church = {
  id: string;
  name: string;
  region_id: string | null;
  zone_id: string | null;
  created_at: string;
  updated_at: string | null;
  regions: { id: string; name: string } | null;
  zones: { id: string; name: string; code: string; region_id: string } | null;
  user_count: number; // ← aquí va el total de users
};

type RawChurch = Church & { users: User[] };

// Estructura para el grouping
export type ZoneGroup = {
  zone: string;
  churches: Church[];
};
export type RegionGroup = {
  region: string;
  zones: ZoneGroup[];
};

export default function AdminDashboard() {
  const [churches, setChurches] = useState(mockChurches);
  const [churchesGrouped, setChurchesGrouped] = useState<
    { zone: any; churches: any[] }[]
  >([]);
  const [stats, setStats] = useState({
    totalChurches: 0,
    totalMembers: 0,
    totalAccredited: 0,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Estados para los modales
  const [selectedChurch, setSelectedChurch] = useState<any>(null);
  const [showChurchDetails, setShowChurchDetails] = useState(false);
  const [showNewChurch, setShowNewChurch] = useState(false);
  const [showZoneManagement, setShowZoneManagement] = useState(false);

  const loadData = () => {
    // Simular carga de datos
    setTimeout(() => {
      const totalMembers = churches.reduce(
        (sum, church) => sum + church.member_count,
        0
      );
      const totalAccredited = churches.reduce(
        (sum, church) => sum + church.accredited_count,
        0
      );
      const grouped = getChurchesGroupedByZone();

      setStats({
        totalChurches: churches.length,
        totalMembers,
        totalAccredited,
      });
      setChurchesGrouped(grouped);
      setLoading(false);
    }, 500);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error, 'error logout');
    } else {
      router.push('/');
    }
  };

  // const handleUploadComplete = () => {
  //   // Simular actualización de datos después de carga
  //   const updatedChurches = churches.map((church) => ({
  //     ...church,
  //     member_count: church.member_count + Math.floor(Math.random() * 10) + 1,
  //     accredited_count:
  //       church.accredited_count + Math.floor(Math.random() * 5) + 1,
  //   }));
  //   setChurches(updatedChurches);
  //   loadData();
  // };

  const handleViewChurch = (church: any) => {
    setSelectedChurch(church);
    setShowChurchDetails(true);
  };

  const handleNewChurch = () => {
    setShowNewChurch(true);
  };

  const handleZoneManagement = () => {
    setShowZoneManagement(true);
  };

  const handleChurchAdded = () => {
    loadData();
  };

  const handleZoneAdded = () => {
    loadData();
  };

  const handleMembersUpdate = () => {
    loadData();
  };

  const [groupedArray, setGroupedArray] = useState<RegionGroup[]>([]);
  const [churches1, setChurches1] = useState<RegionGroup[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCsvFile(file);
  };

  // —————————————
  // ③ Lógica de inserción en Supabase
  // —————————————
  const handleUploadComplete = async (rows: any[]) => {
    for (const row of rows) {
      const rut = row['RUT'];
      const fullName = row['NOMBRE COMPLETO'];
      const email = row['EMAIL'];
      const phone = row['FONO'];
      const gender = row['GÉNERO'];
      const age = row['EDAD'] ? Number(row['EDAD']) : null;
      const region = row['REGIÓN'];
      const zone = row['ZONA'];
      const church = row['IGLESIA'];

      // ————————————————
      // a) Crear usuario en Auth vía /api/create-user
      // ————————————————
      let userId = '';
      try {
        const res = await fetch('/api/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: rut,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error creando usuario');
        userId = json.user.id;
      } catch (err: any) {
        console.error('Error al crear el usuario en AUTH', err);
        // setShowError('Error al crear el usuario en AUTH');
        // setIsLoading(false);
        // return;
      }

      // ————————————————
      // b) Insertar en public.users
      // ————————————————
      if (userId !== '') {
        const { error: userError } = await supabase.from('users').insert({
          id: userId,
          rut,
          email,
          phone,
          gender,
          age,
          full_name: fullName,
          created_at: new Date().toISOString(),
          church_id: church,
          region_id: region,
          zone_id: zone,
          is_accredited: true,
          role: '2ba27049-3a46-44a4-a980-40e83fe31dfe',
          update_at: null,
          // añade aquí church_id, region_id, zone_id si los resuelves antes
        });
        if (userError) {
          console.error('User insert error:', userError);
          continue;
        }

        // ————————————————
        // c) Crear 2 tickets con QR únicos
        // ————————————————
        const tickets = ['Almuerzo', 'Once'].map((type) => ({
          user_id: userId,
          ticket_type: type,
          qr_code: uuid(),
          is_used: false,
          created_at: new Date().toISOString(),
        }));
        const { error: ticketError } = await supabase
          .from('tickets')
          .insert(tickets);
        if (ticketError) {
          console.error('Tickets insert error:', ticketError);
        }
      }
    }

    // Recarga tu lista de datos si es necesario
    // loadData?.();
  };

  // —————————————
  // ⑤ Parsear CSV y disparar la lógica
  // —————————————
  const handleUploadFromState = () => {
    if (!csvFile) {
      alert('Selecciona primero un archivo .csv');
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        await handleUploadComplete(results.data as any[]);
      },

      error: (err) => {
        console.error('Error parseando CSV:', err);
        alert('Error al leer el CSV. Revisa la consola.');
      },
    });
  };

  const getChurchesByZoneAndRegion = async () => {
    setLoading(true);

    // 1) Traigo rawData incluyendo users(id)
    const { data, error } = await supabase.from('churches').select(`
        id,
        name,
        region_id,
        zone_id,
        created_at,
        regions(id, name),
        zones(id, name, code, region_id),
        users(id)     -- sólo traigo el id para contar
      `);

    if (error) {
      console.error('ERROR CHURCH INFO', error);
      setLoading(false);
      return;
    }

    if (!data) {
      setGroupedArray([]);
      setLoading(false);
      return;
    }

    // 2) Transformo cada RawChurch a Church, calculando user_count
    const rawData = data as unknown as RawChurch[];
    const churchesWithCount: Church[] = rawData.map(({ users, ...ch }) => ({
      ...ch,
      user_count: users.length,
    }));

    // 3) Agrupo en estructura intermedia
    const temp = churchesWithCount.reduce<
      Record<string, Record<string, Church[]>>
    >((acc, church) => {
      const regionName = church.regions?.name ?? 'Sin Región';
      const zoneName = church.zones?.name ?? 'Sin Zona';

      if (!acc[regionName]) acc[regionName] = {};
      if (!acc[regionName][zoneName]) acc[regionName][zoneName] = [];

      acc[regionName][zoneName].push(church);
      return acc;
    }, {} as Record<string, Record<string, Church[]>>);

    // 4) Paso a array final
    const finalArray: RegionGroup[] = Object.entries(temp).map(
      ([region, zonesObj]) => ({
        region,
        zones: Object.entries(zonesObj).map(([zone, churches]) => ({
          zone,
          churches,
        })),
      })
    );

    setGroupedArray(finalArray);
    setLoading(false);
  };

  useEffect(() => {
    getChurchesByZoneAndRegion();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  console.log(groupedArray);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Panel de Administración
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gestiona iglesias, miembros y acreditaciones
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Iglesias
              </CardTitle>
              <ChurchIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChurches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Miembros
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acreditados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccredited}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalMembers > 0
                  ? Math.round(
                      (stats.totalAccredited / stats.totalMembers) * 100
                    )
                  : 0}
                % del total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="churches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="churches">Iglesias por Zona</TabsTrigger>
            <TabsTrigger value="users">Usuarios por Rol</TabsTrigger>
            <TabsTrigger value="upload">Carga Masiva</TabsTrigger>
          </TabsList>

          <TabsContent value="churches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Iglesias por Región y Zona
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleZoneManagement}>
                  <Settings className="h-4 w-4 mr-2" />
                  Gestionar Zonas
                </Button>
                <Button onClick={handleNewChurch}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Iglesia
                </Button>
              </div>
            </div>

            <div className="space-y-12">
              {groupedArray.map((regionData, regionIndex) => (
                <div key={regionIndex} className="space-y-6">
                  {/* Encabezado de región */}
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200 dark:border-blue-800">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Región {regionData.region}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {regionData.zones.reduce(
                          (total: number, zone: any) =>
                            total + zone.churches.length,
                          0
                        )}{' '}
                        iglesias en {regionData.zones.length} zonas
                      </p>
                    </div>
                  </div>

                  {/* Zonas dentro de la región */}
                  <div className="space-y-8 ml-4">
                    {regionData.zones.map((zoneData, zoneIndex) => (
                      <div key={zoneIndex} className="space-y-4">
                        {/* Encabezado de zona */}
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded">
                            <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {zoneData.zone}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Código:{' '}
                              {zoneData.churches[0]?.zones?.code || 'N/A'}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {zoneData.churches.length} iglesias
                          </Badge>
                        </div>

                        {/* Iglesias de la zona */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
                          {zoneData.churches.map((church) => (
                            <Card
                              key={church.id}
                              className="hover:shadow-md transition-shadow"
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                  {church.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">
                                    Miembros: {church.user_count}
                                  </span>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full bg-transparent"
                                  onClick={() => handleViewChurch(church)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver Detalles
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {churchesGrouped.length === 0 && (
                <div className="text-center py-12">
                  <ChurchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No hay iglesias registradas
                  </p>
                  <Button onClick={handleNewChurch}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Iglesia
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Usuarios por Rol
              </h2>
            </div>

            <div className="space-y-8">
              {/* Administradores */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Shield className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Administradores
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usuarios con acceso completo al sistema
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === 'admin').length}{' '}
                    usuarios
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers
                    .filter((u) => u.role === 'admin')
                    .map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-600" />
                            {user.full_name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {user.rut}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">
                              Teléfono: {user.phone || 'No registrado'}
                            </p>
                            <p className="text-gray-600">
                              Iglesia: {user.church_name || 'No asignada'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge
                              variant={
                                user.is_accredited ? 'default' : 'secondary'
                              }
                            >
                              {user.is_accredited ? 'Acreditado' : 'Pendiente'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Personal de Cocina */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Personal de Cocina
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usuarios encargados del canje de tickets
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === 'cocina').length}{' '}
                    usuarios
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers
                    .filter((u) => u.role === 'cocina')
                    .map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <ChefHat className="h-4 w-4 text-orange-600" />
                            {user.full_name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {user.rut}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">
                              Teléfono: {user.phone || 'No registrado'}
                            </p>
                            <p className="text-gray-600">
                              Iglesia: {user.church_name || 'No asignada'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge
                              variant={
                                user.is_accredited ? 'default' : 'secondary'
                              }
                            >
                              {user.is_accredited ? 'Acreditado' : 'Pendiente'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Monitores */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Monitores
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usuarios encargados de gestionar sus iglesias
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === 'monitor').length}{' '}
                    usuarios
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers
                    .filter((u) => u.role === 'monitor')
                    .map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            {user.full_name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {user.rut}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">
                              Teléfono: {user.phone || 'No registrado'}
                            </p>
                            <p className="text-gray-600">
                              Iglesia: {user.church_name || 'No asignada'}
                            </p>
                            <p className="text-gray-600">
                              Zona: {user.zone_name || 'No asignada'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge
                              variant={
                                user.is_accredited ? 'default' : 'secondary'
                              }
                            >
                              {user.is_accredited ? 'Acreditado' : 'Pendiente'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Asistentes */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Asistentes
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Miembros de las iglesias registrados para el evento
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {mockUsers.filter((u) => u.role === 'attendee').length}{' '}
                    usuarios
                  </Badge>
                </div>

                {mockUsers.filter((u) => u.role === 'attendee').length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>RUT</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Iglesia</TableHead>
                            <TableHead>Zona</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockUsers
                            .filter((u) => u.role === 'attendee')
                            .map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-mono text-sm">
                                  {user.rut}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {user.full_name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  {user.phone || 'No registrado'}
                                </TableCell>
                                <TableCell>
                                  {user.church_name || 'No asignada'}
                                </TableCell>
                                <TableCell>
                                  {user.zone_name || 'No asignada'}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      user.is_accredited
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {user.is_accredited
                                      ? 'Acreditado'
                                      : 'Pendiente'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No hay asistentes registrados
                    </p>
                    <p className="text-sm text-gray-500">
                      Los asistentes se registran a través de las iglesias
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mb-4"
            />

            {/* Botón para procesar el CSV */}
            <input
              type="button"
              value="Procesar Archivo"
              onClick={handleUploadFromState}
              disabled={!csvFile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      <ChurchDetailsModal
        church={selectedChurch}
        isOpen={showChurchDetails}
        onClose={() => setShowChurchDetails(false)}
        onMembersUpdate={handleMembersUpdate}
        churchID={selectedChurch}
      />

      <NewChurchModal
        isOpen={showNewChurch}
        onClose={() => setShowNewChurch(false)}
        onChurchAdded={handleChurchAdded}
      />

      <ZoneManagementModal
        isOpen={showZoneManagement}
        onClose={() => setShowZoneManagement(false)}
        onZoneAdded={handleZoneAdded}
      />
    </div>
  );
}
