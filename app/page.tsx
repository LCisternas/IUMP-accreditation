import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Church } from 'lucide-react';
import LoginForm from '@/components/form/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Church className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Sistema de Acreditación</CardTitle>
          <CardDescription>
            Ingresa tu RUT y contraseña para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <div className="mt-2 pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              <strong>Desarrollado por RETSIC SPA</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
