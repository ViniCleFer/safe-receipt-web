/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { toast } from 'sonner';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Spinner } from './ui/spinner';

import { getUserByEmail, revalidateDashboard } from '@/app/dashboard/actions';

interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps extends React.ComponentPropsWithoutRef<'form'> {
  signIn: (data: FormData) => Promise<{ session: any; error: any }>;
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
      const { session, error } = await signIn(data);

      if (error) {
        setIsLoading(false);

        return toast.error(
          'Erro ao logar um usuário, por favor tente novamente mais tarde',
          {
            position: 'top-center',
            className: 'bg-red-500 text-white',
            style: {
              color: 'white',
              backgroundColor: 'oklch(0.637 0.237 25.331)',
            },
          },
        );
      }

      if (session) {
        const { user } = session;

        const { data: userData, error: userError } = await getUserByEmail(
          user?.email,
        );

        if (userError) {
          setIsLoading(false);
          return toast.error(
            'Erro ao buscar um usuário pelo ID, por favor tente novamente mais tarde',
            {
              position: 'top-center',
              className: 'bg-red-500 text-white',
              style: {
                color: 'white',
                backgroundColor: 'oklch(0.637 0.237 25.331)',
              },
            },
          );
        }

        if (
          userData?.permissions?.length === 0 ||
          !userData?.permissions?.includes('WEB')
        ) {
          setIsLoading(false);
          return toast.error(
            'Você não tem permissão para acessar esta área. Por favor, entre em contato com o administrador do sistema para obter acesso.',
            {
              position: 'top-center',
              className: 'bg-red-500 text-white',
              style: {
                color: 'white',
                backgroundColor: 'oklch(0.637 0.237 25.331)',
              },
            },
          );
        }

        await revalidateDashboard();
      }
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
