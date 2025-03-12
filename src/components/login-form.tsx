'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Spinner } from './ui/spinner';
// import { login } from '@/app/login/actions';

interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps extends React.ComponentPropsWithoutRef<'form'> {
  signIn: (data: FormData) => Promise<void>;
  className?: string;
}

const formValidation = () => {
  return z.object({
    email: z.string({ required_error: 'O campo RE/E-mail é obrigatório.' }),
    password: z.string({ required_error: 'O campo senha é obrigatório' }),
  });
};

export function LoginForm({ className, signIn, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formValidation()),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleLogin(data: FormData) {
    console.log(data);
    setIsLoading(true);
    try {
      await signIn(data);
    } catch (error) {
      console.error('Error logging in', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit(handleLogin)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entre na sua conta</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            {...register('email')}
          />
          <ErrorMessage errors={errors} name="email" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            required
            {...register('password')}
          />
          <ErrorMessage errors={errors} name="password" />
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading && <Spinner size="small" className="text-white" />}
          Entrar
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        Não tem uma conta?{' '}
        <a href="#" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div> */}
    </form>
  );
}
