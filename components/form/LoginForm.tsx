'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { formatRUT } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: UserData, error: UserError } = await supabase
      .from('users')
      .select(
        `
          *,
          ROL: role(*)
        `
      )
      .eq('rut', rut)
      .single();

    if (UserError) {
      console.log(UserError, 'ERROR USER TABLE');
      setLoading(false);
      setError('Credenciales erroneas');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: UserData.email ? UserData.email : "",
        password: password,
      });
      if (error) {
        console.log(error, 'ERROR USER AUTH');
        setLoading(false);
        setError('Credenciales erroneas');
      } else {
        if (UserData.ROL?.name === 'ADMIN') {
          router.push('/admin');
        } else if (UserData.ROL?.name === 'LEADER') {
          router.push('/monitor');
        } else if (UserData.ROL?.name === 'KITCHEN') {
          router.push('/cocina');
        } else {
          router.push('/attendee');
        }
      }
    }
  };

  console.log(rut, password)

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
          placeholder="Tu RUT sin digito verificador"
        />
      </div>

      {error && (
        <Alert className='border-red-500 bg-transparent'>
          <AlertDescription className='text-red-500'>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};

export default LoginForm;
