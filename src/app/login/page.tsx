import Image from 'next/image';

import logo from '@/assets/logo.svg';

import { LoginForm } from '@/components/login-form';
import { signIn } from './actions';

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src={logo}
              alt="Image"
              className="h-6 w-6 items-center justify-center rounded-md"
            />
            VF Code Ltda.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm signIn={signIn} />
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="text-sm text-gray-750">
            @Copyright VF Code LTDA {new Date().getFullYear()}
          </span>
          <span className="text-sm text-gray-750">
            Versão {process.env.NEXT_PUBLIC_VERSION}
          </span>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:flex items-center justify-center">
        <Image
          src={logo}
          alt="Image"
          className="rounded-md absolute h-[30%] w-[30%] object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
