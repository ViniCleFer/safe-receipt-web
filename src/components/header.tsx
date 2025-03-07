'use client';
import React from 'react';
// import { useSettings } from '@/contexts/settings-context';
import { usePathname } from 'next/navigation';
import { Link as LinkIcon } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { Separator } from '@radix-ui/react-separator';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import Link from 'next/link';

export function Header() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  // const { settings } = useSettings();
  const fullname = 'Vinicius Fernandes';

  return (
    <header className="flex h-16 shrink-0 justify-between pr-5 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <span className="text-muted-foreground">/</span>
            <LinkIcon
              href={`/${pathSegments.slice(0, index + 1).join('/')}`}
              className="text-sm font-medium"
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </LinkIcon>
          </React.Fragment>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38184074.jpg-M4vCjTSSWVw5RwWvvmrxXBcNVU8MBU.jpeg"
                alt={fullname}
              />
              <AvatarFallback>
                {fullname
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fullname}</p>
              <p className="text-xs leading-none text-muted-foreground">
                vinicius@email.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/perfil">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
    // <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    //   <div className="flex items-center gap-2 px-4">
    //     <SidebarTrigger className="-ml-1" />
    //     <Separator orientation="vertical" className="mr-2 h-4" />
    //     {pathSegments.map((segment, index) => (
    //       <React.Fragment key={segment}>
    //         <span className="text-muted-foreground">/</span>
    //         <Link
    //           href={`/${pathSegments.slice(0, index + 1).join('/')}`}
    //           className="text-sm font-medium"
    //         >
    //           {segment.charAt(0).toUpperCase() + segment.slice(1)}
    //         </Link>
    //       </React.Fragment>
    //     ))}
    //   </div>
    //   <DropdownMenu>
    //     <DropdownMenuTrigger asChild>
    //       <Button variant="ghost" className="relative h-8 w-8 rounded-full">
    //         <Avatar className="h-8 w-8">
    //           <AvatarImage src={settings.avatar} alt={settings.fullName} />
    //           <AvatarFallback>
    //             {settings.fullName
    //               .split(' ')
    //               .map(n => n[0])
    //               .join('')}
    //           </AvatarFallback>
    //         </Avatar>
    //       </Button>
    //     </DropdownMenuTrigger>
    //     <DropdownMenuContent className="w-56" align="end" forceMount>
    //       <DropdownMenuLabel className="font-normal">
    //         <div className="flex flex-col space-y-1">
    //           <p className="text-sm font-medium leading-none">
    //             {settings.fullName}
    //           </p>
    //           <p className="text-xs leading-none text-muted-foreground">
    //             {settings.email}
    //           </p>
    //         </div>
    //       </DropdownMenuLabel>
    //       <DropdownMenuSeparator />
    //       <DropdownMenuItem asChild>
    //         <Link href="/settings">Profile</Link>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem asChild>
    //         <Link href="/settings">Settings</Link>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>Log out</DropdownMenuItem>
    //     </DropdownMenuContent>
    //   </DropdownMenu>
    // </header>
  );
}
