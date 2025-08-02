'use client';

import { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Redirigir si ya está logueado
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user.email) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`*, ROL: role(*)`)
          .eq('email', session.user.email)
          .single();

        if (!userError && userData?.ROL?.name) {
          if (userData.ROL.name === 'ADMIN') {
            router.replace('/admin');
          } else if (userData.ROL.name === 'LEADER') {
            router.replace('/monitor');
          } else if (userData.ROL.name === 'KITCHEN') {
            router.replace('/cocina');
          } else {
            router.replace('/attendee');
          }
        }
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`*, ROL: role(*)`)
      .eq('rut', rut)
      .single();

    if (userError || !userData?.email) {
      console.log(userError, 'ERROR USER TABLE');
      setLoading(false);
      setError('Credenciales erróneas');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password,
    });

    if (signInError) {
      console.log(signInError, 'ERROR AUTH');
      setLoading(false);
      setError('Credenciales erróneas');
      return;
    }

    if (userData.ROL?.name === 'ADMIN') {
      router.push('/admin');
    } else if (userData.ROL?.name === 'LEADER') {
      router.push('/monitor');
    } else if (userData.ROL?.name === 'KITCHEN') {
      router.push('/cocina');
    } else {
      router.push('/attendee');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rut">RUT</Label>
        <Input
          id="rut"
          type="text"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
          placeholder="997983519"
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Tu RUT sin dígito verificador"
        />
      </div>

      {error && (
        <Alert className="border-red-500 bg-transparent">
          <AlertDescription className="text-red-500">{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};

export default LoginForm;
