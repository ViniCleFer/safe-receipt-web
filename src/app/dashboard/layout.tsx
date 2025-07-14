/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Layers,
  LayoutDashboard,
  LogOut,
  Users,
  ListCheck,
  ClipboardList,
} from 'lucide-react';
import Image from 'next/image';
import { getSession, getUser } from '../actions';
import { getUserByEmail, logout } from './actions';
import { getInitials } from '@/utils/get-iniciais';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import LogoYpe from '@/assets/logo-ype.svg';
import { TipoPerfil, User } from '@/types/user';
import type {
  User as SupabaseUser,
  Session as SupabaseSession,
} from '@supabase/supabase-js';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session !== null && user === null) {
      getUser()
        .then((data: any) => setUser(data))
        .catch((err: any) => console.error('Page Error Get user', err));
    }
  }, [session, user]);

  useEffect(() => {
    if (user === null) {
      getSession()
        .then((session: any) => {
          console.log('session', session);
          if (session === null) {
            router.push('/login');
          }
          setSession(session);
        })
        .catch((err: any) => console.error('Page Error Get session', err));
    }
  }, [user, router]);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error logout', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar user={user} pathname={pathname} router={router} />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="cursor-pointer" />
            <div className="flex items-center gap-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {getInitials(user?.user_metadata?.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">
                      {user?.user_metadata?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    {isLoading ? (
                      <Spinner size="small" className="text-destructive" />
                    ) : (
                      <LogOut className="text-destructive mr-2 h-4 w-4" />
                    )}
                    <span className="text-destructive">Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function DashboardSidebar({
  user: userSupabase,
  pathname,
  router,
}: {
  user: SupabaseUser | null;
  pathname: string;
  router: any;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userSupabase && userSupabase !== null && user === null) {
      getUserByEmail(userSupabase.email!)
        .then((data: any) => {
          console.log('data', data);
          setUser(data?.data);
        })
        .catch((err: any) => console.error('Page Error Get user', err));
    }
  }, [userSupabase, user]);

  const navItems = [
    {
      title: 'Carta Controle',
      icon: ClipboardList,
      route: '/dashboard/cartas-controle',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Formulários PTP',
      icon: ListCheck,
      route: '/dashboard/forms-ptp',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Laudos CRM',
      icon: LayoutDashboard,
      route: '/dashboard/laudos-crm',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Divergências',
      icon: Layers,
      route: '/dashboard/divergencias',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Usuários',
      icon: Users,
      route: '/dashboard/usuarios',
      permission: TipoPerfil.ADMIN,
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div
            className={
              isCollapsed
                ? 'flex items-center justify-center h-10'
                : 'flex items-center gap-2 px-2 h-10'
            }
          >
            <Image src={LogoYpe} alt="Logo Ypê" width={50} height={50} />
            {!isCollapsed && <span className="text-lg font-semibold">Ypê</span>}
          </div>
          <Separator />
        </SidebarHeader>
        <SidebarContent>
          {user && (
            <SidebarGroup>
              <SidebarGroupLabel>Acompanhamento</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {user?.profile === TipoPerfil.ADMIN
                    ? navItems?.map(item => (
                        <SidebarMenuItem key={item.title}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                tooltip={isCollapsed ? item.title : undefined}
                                isActive={pathname === item.route}
                                onClick={() => handleNavigation(item.route)}
                                className="cursor-pointer"
                              >
                                <item.icon
                                  className={`${
                                    pathname === item.route
                                      ? 'text-primary'
                                      : 'default'
                                  }`}
                                />
                                <span
                                  className={`${
                                    pathname === item.route
                                      ? 'text-primary'
                                      : 'default'
                                  }`}
                                >
                                  {item.title}
                                </span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {isCollapsed && (
                              <TooltipContent
                                side="right"
                                className="cursor-pointer"
                              >
                                {item.title}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </SidebarMenuItem>
                      ))
                    : navItems
                        ?.filter(item => item.permission === TipoPerfil.MEMBER)
                        ?.map(item => (
                          <SidebarMenuItem key={item.title}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  tooltip={isCollapsed ? item.title : undefined}
                                  isActive={pathname === item.route}
                                  onClick={() => handleNavigation(item.route)}
                                  className="cursor-pointer"
                                >
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.title}</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              {isCollapsed && (
                                <TooltipContent
                                  side="right"
                                  className="cursor-pointer"
                                >
                                  {item.title}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </SidebarMenuItem>
                        ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
