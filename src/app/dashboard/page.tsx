/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutDashboard,
  LogOut,
  // Package,
  // Settings,
  // User as UserIcon,
  Users,
  ListCheck,
  Sheet,
} from 'lucide-react';
import dayjs from 'dayjs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useState } from 'react';
import {
  getAllFormsPtp,
  getAllUsers,
  getDivergencesRequest,
  getLaudosCrmRequest,
  getUserByEmail,
  logout,
} from './actions';
import { FormPtp } from '@/types/form-ptp';
import LogoYpe from '@/assets/logo-ype.svg';
import Image from 'next/image';
import {
  Session as SupabaseSession,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { getSession, getUser } from '../actions';
import { getInitials } from '@/utils/get-iniciais';
import { LaudoCrm } from '@/types/laudo-crm';
import { tiposNaoConformidade as tiposNaoConformidadeList } from '@/utils/tiposNaoConformidade';
import { Divergencia, TipoDivergencia } from '@/types/divergencia';
import { TipoPerfil, User } from '@/types/user';
import { getTipoPerfil } from '@/utils/get-tipo-perfil';
import { Switch } from '@/components/ui/switch';
import { generateExcelFormsPtp } from '@/utils/generate-excel-forms-ptp';
import { generateExcelLaudosCrm } from '@/utils/generate-excel-laudos-crm';
import { generateExcelDivergencias } from '@/utils/generate-excel-divergencias';
import { Spinner } from '@/components/ui/spinner';
import { getTipoEspecificacao } from '@/utils/get-tipo-especificacao';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('forms-ptp');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);

  React.useEffect(() => {
    if (session !== null && user === null) {
      getUser()
        .then(data => setUser(data))
        .catch(err => console.error('Page Error Get user', err));
    }
  }, [session]);

  React.useEffect(() => {
    if (user === null) {
      getSession()
        .then(session => {
          console.log('session', session);
          if (session === null) {
            logout();
          }

          setSession(session);
        })
        .catch(err => console.error('Page Error Get session', err));
    }
  }, [user]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
        />
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
                  {/* <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            {activePage === 'forms-ptp' && <FormPtpContent />}
            {activePage === 'laudos-crm' && <LaudoCrmContent />}
            {activePage === 'divergencias' && <DivergenciasContent />}
            {activePage === 'usuarios' && <UsersContent />}
            {activePage === 'Analytics' && <AnalyticsContent />}
            {activePage === 'Orders' && <OrdersContent />}
            {activePage === 'Calendar' && <CalendarContent />}
            {activePage === 'Settings' && <SettingsContent />}
            {activePage === 'Help' && <HelpContent />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function DashboardSidebar({
  activePage,
  setActivePage,
  user: userSupabase,
}: {
  activePage: any;
  setActivePage: (page: any) => void;
  user: SupabaseUser | null;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    if (userSupabase && userSupabase !== null && user === null) {
      getUserByEmail(userSupabase.email!)
        .then(data => setUser(data))
        .catch(err => console.error('Page Error Get user', err));
    }
  }, [userSupabase, user]);

  const navItems = [
    {
      title: 'Formulários PTP',
      icon: ListCheck,
      route: 'forms-ptp',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Laudos CRM',
      icon: LayoutDashboard,
      route: 'laudos-crm',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Divergências',
      icon: Layers,
      route: 'divergencias',
      permission: TipoPerfil.MEMBER,
    },
    {
      title: 'Usuários',
      icon: Users,
      route: 'usuarios',
      permission: TipoPerfil.ADMIN,
    },
    // { title: 'Analytics', icon: BarChart3 },
    // { title: 'Orders', icon: Layers },
    // { title: 'Calendar', icon: Calendar },
    // { title: 'Settings', icon: Settings },
    // { title: 'Help', icon: LifeBuoy },
  ];

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
            {/* <Package className="h-6 w-6" /> */}
            <Image src={LogoYpe} alt="Logo Ypê" width={50} height={50} />
            {!isCollapsed && (
              <span className="text-lg font-semibold">Ypê Salto</span>
            )}
          </div>
          <Separator />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Acompanhamento</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {user &&
                  navItems
                    ?.filter(item => item.permission === user?.profile)
                    ?.map(item => (
                      <SidebarMenuItem key={item.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              tooltip={isCollapsed ? item.title : undefined}
                              isActive={activePage === item.route}
                              onClick={() => setActivePage(item.route)}
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
        </SidebarContent>
        {/* <SidebarFooter>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="Avatar"
                />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter> */}
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}

// Dashboard page content
function FormPtpContent() {
  const [allProducts, setAllProducts] = React.useState<FormPtp[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [isLoadingPtp, setIsLoadingPtp] = React.useState(false);

  React.useEffect(() => {
    getAllFormsPtp()
      .then(data => {
        console.log('teste', data?.data);
        const ok = data !== null ? data?.data : [];
        setAllProducts([...ok]);
      })
      .catch(err => {
        console.log('erro', err);
      });
  }, []);

  const filteredProducts = React.useMemo(() => {
    return allProducts?.filter(
      product =>
        product?.conferente
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase()) ||
        product?.notaFiscal
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase()) ||
        product?.opcaoUp?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
    );
  }, [searchQuery, allProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: any) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleGeneratePtpExcel = async () => {
    try {
      setIsLoadingPtp(true);

      return await generateExcelFormsPtp();
    } catch (error) {
      console.log('error', error);
      return;
    } finally {
      setIsLoadingPtp(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Formulários PTP</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore os formulários PTP
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Input
            placeholder="Digite um conferente, nota fiscal, UP"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer"
                onClick={() => handleGeneratePtpExcel()}
                disabled={isLoadingPtp}
              >
                {isLoadingPtp ? (
                  <Spinner size="small" className="text-white" />
                ) : (
                  <Sheet className="h-5 w-5" />
                )}
                Gerar Relatório
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Relatório em Excel
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de itens</CardTitle>
          <CardDescription>
            Mostrando {startIndex + 1}-
            {Math.min(endIndex, filteredProducts?.length)} de{' '}
            {filteredProducts?.length} formulários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b bg-muted/50 p-3 font-medium">
              {/* <div>ID</div> */}
              <div>Conferente</div>
              <div>Nota Fiscal</div>
              <div>UP Origem</div>
              <div>Qtd. Analisada</div>
              <div>Data Recebimento</div>
              <div>Tipo</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: FormPtp) => (
                <div key={product.id} className="grid grid-cols-6 border-b p-3">
                  {/* <div>#{product?.id?.substring(0, 8)}</div> */}
                  <div>{product?.conferente}</div>
                  <div>{product?.notaFiscal}</div>
                  <div>{product?.opcaoUp}</div>
                  <div>{product?.qtdAnalisada}</div>
                  <div>{dayjs(product?.dataExecucao).format('DD/MM/YYYY')}</div>
                  <div>
                    <Badge variant="default">
                      {getTipoEspecificacao(product?.tipoEspecificacao)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum Formulário PTP encontrado
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Itens por página</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
                <span className="sr-only">Primeira</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;

                  // Logic to show pages around current page
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? 'default' : 'outline'
                      }
                      size="icon"
                      onClick={() => handlePageChange(pageNumber)}
                      className="h-8 w-8"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
                <span className="sr-only">Última</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Home page content
function LaudoCrmContent() {
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [isLoadingLaudo, setIsLoadingLaudo] = React.useState(false);

  React.useEffect(() => {
    getLaudosCrmRequest()
      .then(data => {
        console.log('laudos', data?.data);
        const ok = data !== null ? data?.data : [];

        if (ok?.length > 0) {
          let laudosCrm: any[] = [];

          for (const laudoCrm of ok as any[]) {
            laudosCrm = [
              ...laudosCrm,
              {
                ...laudoCrm,
                evidencias: [],
              },
            ];
          }

          const tiposNaoConformidadeFormatted = laudosCrm.map(laudo => {
            const tiposNaoConformidade = laudo?.tiposNaoConformidade;
            const lotes = laudo?.lotes;
            const codigosProdutos = laudo?.codigoProdutos;

            let tiposNaoConformidadeFormatted = '';

            if (tiposNaoConformidade?.length > 0) {
              tiposNaoConformidadeFormatted = tiposNaoConformidade
                .map(
                  (tipo: string) =>
                    '- ' +
                    tiposNaoConformidadeList?.find(item => item?.value === tipo)
                      ?.label,
                )
                .join('\n');
            } else {
              tiposNaoConformidadeFormatted = 'Sem tipos de não conformidade';
            }

            let lotesFormatted = '';

            if (lotes?.length > 0) {
              lotesFormatted = lotes
                .map((lote: string) => '- ' + lote)
                .join('\n');
            } else {
              lotesFormatted = 'Sem lotes cadastrados';
            }

            let codigosProdutosFormatted = '';

            if (codigosProdutos?.length > 0) {
              codigosProdutosFormatted = codigosProdutos
                .map((codigoProduto: string) => '- ' + codigoProduto)
                .join('\n');
            } else {
              codigosProdutosFormatted = 'Sem códigos de produtos cadastrados';
            }

            return {
              ...laudo,
              observacoes: laudo?.observacoes || 'Sem observações',
              tiposNaoConformidade: tiposNaoConformidadeFormatted,
              lotes: lotesFormatted,
              codigosProdutos: codigosProdutosFormatted,
            };
          });

          console.log('laudosCrm => ', JSON.stringify(laudosCrm, null, 2));

          setAllProducts([...tiposNaoConformidadeFormatted]);
        }
      })
      .catch(err => {
        console.log('erro', err);
      });
  }, []);

  const filteredProducts = React.useMemo(() => {
    return allProducts?.filter(
      product =>
        product?.transportador
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase()) ||
        product?.remessa?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.placa?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
    );
  }, [searchQuery, allProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: any) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleGenerateLaudoExcel = async () => {
    try {
      setIsLoadingLaudo(true);

      return await generateExcelLaudosCrm();
    } catch (error) {
      console.log('error', error);
      return;
    } finally {
      setIsLoadingLaudo(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Laudos CRM</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore os laudos CRM
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Input
            placeholder="Digite um transportador, remessa ou placa"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer"
                onClick={() => handleGenerateLaudoExcel()}
                disabled={isLoadingLaudo}
              >
                {isLoadingLaudo ? (
                  <Spinner size="small" className="text-white" />
                ) : (
                  <Sheet className="h-5 w-5" />
                )}
                Gerar Relatório
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Relatório em Excel
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de itens</CardTitle>
          <CardDescription>
            Mostrando {startIndex + 1}-
            {Math.min(endIndex, filteredProducts?.length)} de{' '}
            {filteredProducts?.length} formulários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b bg-muted/50 p-3 font-medium">
              {/* <div>ID</div> */}
              <div>Transportador</div>
              <div>Remessa</div>
              <div>Placa</div>
              <div>Turno</div>
              <div>CD Origem</div>
              <div>Data Identificação</div>
              {/* <div>Status</div> */}
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: LaudoCrm) => (
                <div key={product.id} className="grid grid-cols-6 border-b p-3">
                  {/* <div>#{product?.id?.substring(0, 8)}</div> */}
                  <div>{product?.transportador}</div>
                  <div>{product?.remessa}</div>
                  <div>{product?.placa}</div>
                  <div>{product?.turno}</div>
                  <div>{product?.cdOrigem}</div>
                  <div>
                    {dayjs(product?.dataIdentificacao).format('DD/MM/YYYY')}
                  </div>
                  {/* <div>
                      <Badge
                        variant={
                          product?.status === FormPtpStatus.EM_ANDAMENTO
                            ? 'outline'
                            : product?.status === FormPtpStatus.FINALIZADO
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {getFormPtpStatus(product?.status)}
                      </Badge>
                    </div> */}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum Formulário PTP encontrado
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Itens por página</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
                <span className="sr-only">Primeira</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;

                  // Logic to show pages around current page
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? 'default' : 'outline'
                      }
                      size="icon"
                      onClick={() => handlePageChange(pageNumber)}
                      className="h-8 w-8"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
                <span className="sr-only">Última</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Products page content
function DivergenciasContent() {
  const [allProductsFalta, setAllProductsFalta] = React.useState<Divergencia[]>(
    [],
  );
  const [allProductsSobra, setAllProductsSobra] = React.useState<Divergencia[]>(
    [],
  );
  const [allProductsInversao, setAllProductsInversao] = React.useState<
    Divergencia[]
  >([]);
  const [searchQueryFalta, setSearchQueryFalta] = React.useState('');
  const [currentPageFalta, setCurrentPageFalta] = React.useState(1);
  const [itemsPerPageFalta, setItemsPerPageFalta] = React.useState(10);
  const [searchQuerySobra, setSearchQuerySobra] = React.useState('');
  const [currentPageSobra, setCurrentPageSobra] = React.useState(1);
  const [itemsPerPageSobra, setItemsPerPageSobra] = React.useState(10);
  const [searchQueryInversao, setSearchQueryInversao] = React.useState('');
  const [currentPageInversao, setCurrentPageInversao] = React.useState(1);
  const [itemsPerPageInversao, setItemsPerPageInversao] = React.useState(10);
  const [isLoadingDivergencia, setIsLoadingDivergencia] = React.useState(false);

  React.useEffect(() => {
    getDivergencesRequest()
      .then(data => {
        console.log('teste', data?.data);
        const ok = data !== null ? data?.data : [];
        setAllProductsFalta([
          ...ok?.filter(
            (divergencia: Divergencia) =>
              divergencia?.tipoDivergencia === TipoDivergencia.FALTA,
          ),
        ]);
        setAllProductsSobra([
          ...ok?.filter(
            (divergencia: Divergencia) =>
              divergencia?.tipoDivergencia === TipoDivergencia.SOBRA,
          ),
        ]);
        setAllProductsInversao([
          ...ok?.filter(
            (divergencia: Divergencia) =>
              divergencia?.tipoDivergencia === TipoDivergencia.INVERSAO,
          ),
        ]);
      })
      .catch(err => {
        console.log('erro', err);
      });
  }, []);

  const filteredProductsFalta = React.useMemo(() => {
    return allProductsFalta?.filter(
      product =>
        product?.notaFiscal
          ?.toLowerCase()
          ?.includes(searchQueryFalta?.toLowerCase()) ||
        product?.skuFaltandoFisicamente
          ?.toLowerCase()
          ?.includes(searchQueryFalta?.toLowerCase()),
    );
  }, [searchQueryFalta, allProductsFalta]);

  // Calculate pagination
  const totalPagesFalta = Math.ceil(
    filteredProductsFalta.length / itemsPerPageFalta,
  );
  const startIndexFalta = (currentPageFalta - 1) * itemsPerPageFalta;
  const endIndexFalta = startIndexFalta + itemsPerPageFalta;
  const currentProductsFalta = filteredProductsFalta.slice(
    startIndexFalta,
    endIndexFalta,
  );

  // Handle page change
  const handlePageChangeFalta = (page: any) => {
    setCurrentPageFalta(page);
  };

  // Handle items per page change
  const handleItemsPerPageChangeFalta = (value: any) => {
    setItemsPerPageFalta(Number(value));
    setCurrentPageFalta(1); // Reset to first page when changing items per page
  };

  const filteredProductsSobra = React.useMemo(() => {
    return allProductsSobra?.filter(
      product =>
        product?.notaFiscal
          ?.toLowerCase()
          ?.includes(searchQuerySobra?.toLowerCase()) ||
        product?.skuSobrandoFisicamente
          ?.toLowerCase()
          ?.includes(searchQuerySobra?.toLowerCase()),
    );
  }, [searchQuerySobra, allProductsSobra]);

  // Calculate pagination
  const totalPagesSobra = Math.ceil(
    filteredProductsSobra.length / itemsPerPageSobra,
  );
  const startIndexSobra = (currentPageSobra - 1) * itemsPerPageSobra;
  const endIndexSobra = startIndexSobra + itemsPerPageSobra;
  const currentProductsSobra = filteredProductsSobra.slice(
    startIndexSobra,
    endIndexSobra,
  );

  // Handle page change
  const handlePageChangeSobra = (page: any) => {
    setCurrentPageSobra(page);
  };

  // Handle items per page change
  const handleItemsPerPageChangeSobra = (value: any) => {
    setItemsPerPageSobra(Number(value));
    setCurrentPageSobra(1); // Reset to first page when changing items per page
  };

  const filteredProductsInversao = React.useMemo(() => {
    return allProductsInversao?.filter(
      product =>
        product?.notaFiscal
          ?.toLowerCase()
          ?.includes(searchQueryInversao?.toLowerCase()) ||
        product?.skuNotaFiscal
          ?.toLowerCase()
          ?.includes(searchQueryInversao?.toLowerCase()) ||
        product?.skuRecebemosFisicamente
          ?.toLowerCase()
          ?.includes(searchQueryInversao?.toLowerCase()),
    );
  }, [searchQueryInversao, allProductsInversao]);

  // Calculate pagination
  const totalPagesInversao = Math.ceil(
    filteredProductsInversao.length / itemsPerPageInversao,
  );
  const startIndexInversao = (currentPageInversao - 1) * itemsPerPageInversao;
  const endIndexInversao = startIndexInversao + itemsPerPageInversao;
  const currentProductsInversao = filteredProductsInversao.slice(
    startIndexInversao,
    endIndexInversao,
  );

  // Handle page change
  const handlePageChangeInversao = (page: any) => {
    setCurrentPageInversao(page);
  };

  // Handle items per page change
  const handleItemsPerPageChangeInversao = (value: any) => {
    setItemsPerPageInversao(Number(value));
    setCurrentPageInversao(1); // Reset to first page when changing items per page
  };

  const handleGenerateDivergenciaExcel = async () => {
    try {
      setIsLoadingDivergencia(true);

      return await generateExcelDivergencias();
    } catch (error) {
      console.log('error', error);
      return;
    } finally {
      setIsLoadingDivergencia(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Divergências</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore as divergências
          </p>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="cursor-pointer"
              onClick={() => handleGenerateDivergenciaExcel()}
              disabled={isLoadingDivergencia}
            >
              {isLoadingDivergencia ? (
                <Spinner size="small" className="text-white" />
              ) : (
                <Sheet className="h-5 w-5" />
              )}
              Gerar Relatório
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Relatório em Excel
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Falta</h2>

            <div className="w-full md:w-1/3">
              <Input
                placeholder="Digite um Sku ou nota fiscal"
                value={searchQueryFalta}
                onChange={e => {
                  setSearchQueryFalta(e.target.value);
                  setCurrentPageFalta(1); // Reset to first page on search
                }}
                className="w-full"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listagem de itens</CardTitle>
              <CardDescription>
                Mostrando {startIndexFalta + 1}-
                {Math.min(endIndexFalta, filteredProductsFalta?.length)} de{' '}
                {filteredProductsFalta?.length} divergências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b bg-muted/50 p-3 font-medium">
                  <div>Sku</div>
                  <div>Qtd.</div>
                  <div>Nota Fiscal</div>
                  <div>Data Identificação</div>
                </div>
                {currentProductsFalta?.length > 0 ? (
                  currentProductsFalta?.map((product: Divergencia) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-4 border-b p-3"
                    >
                      <div>{product?.skuFaltandoFisicamente}</div>
                      <div>{product?.qtdFaltandoFisicamente}</div>
                      <div>{product?.notaFiscal || 'N/A'}</div>
                      <div>
                        {dayjs(product?.created_at).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma divergência de falta encontrada
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Itens por página
                  </p>
                  <Select
                    value={itemsPerPageFalta.toString()}
                    onValueChange={handleItemsPerPageChangeFalta}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPageFalta} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeFalta(1)}
                    disabled={currentPageFalta === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                    <span className="sr-only">Primeira</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeFalta(currentPageFalta - 1)}
                    disabled={currentPageFalta === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                  </Button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from(
                      { length: Math.min(totalPagesFalta, 5) },
                      (_, i) => {
                        let pageNumberFalta;

                        if (totalPagesFalta <= 5) {
                          pageNumberFalta = i + 1;
                        } else if (currentPageFalta <= 3) {
                          pageNumberFalta = i + 1;
                        } else if (currentPageFalta >= totalPagesFalta - 2) {
                          pageNumberFalta = totalPagesFalta - 4 + i;
                        } else {
                          pageNumberFalta = currentPageFalta - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumberFalta}
                            variant={
                              currentPageFalta === pageNumberFalta
                                ? 'default'
                                : 'outline'
                            }
                            size="icon"
                            onClick={() =>
                              handlePageChangeFalta(pageNumberFalta)
                            }
                            className="h-8 w-8"
                          >
                            {pageNumberFalta}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeFalta(currentPageFalta + 1)}
                    disabled={
                      currentPageFalta === totalPagesFalta ||
                      totalPagesFalta === 0
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeFalta(totalPagesFalta)}
                    disabled={
                      currentPageFalta === totalPagesFalta ||
                      totalPagesFalta === 0
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                    <span className="sr-only">Última</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Sobra</h2>

            <div className="w-full md:w-1/3">
              <Input
                placeholder="Digite um Sku ou nota fiscal"
                value={searchQuerySobra}
                onChange={e => {
                  setSearchQuerySobra(e.target.value);
                  setCurrentPageSobra(1); // Reset to first page on search
                }}
                className="w-full"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listagem de itens</CardTitle>
              <CardDescription>
                Mostrando {startIndexSobra + 1}-
                {Math.min(endIndexSobra, filteredProductsSobra?.length)} de{' '}
                {filteredProductsSobra?.length} divergências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b bg-muted/50 p-3 font-medium">
                  <div>Sku</div>
                  <div>Qtd.</div>
                  <div>Nota Fiscal</div>
                  <div>Data Identificação</div>
                </div>
                {currentProductsSobra?.length > 0 ? (
                  currentProductsSobra?.map((product: Divergencia) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-4 border-b p-3"
                    >
                      <div>{product?.skuSobrandoFisicamente}</div>
                      <div>{product?.qtdSobrandoFisicamente}</div>
                      <div>{product?.notaFiscal || 'N/A'}</div>
                      <div>
                        {dayjs(product?.created_at).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma divergência de Sobra encontrada
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Itens por página
                  </p>
                  <Select
                    value={itemsPerPageSobra.toString()}
                    onValueChange={handleItemsPerPageChangeSobra}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPageSobra} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeSobra(1)}
                    disabled={currentPageSobra === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                    <span className="sr-only">Primeira</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeSobra(currentPageSobra - 1)}
                    disabled={currentPageSobra === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                  </Button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from(
                      { length: Math.min(totalPagesSobra, 5) },
                      (_, i) => {
                        let pageNumberSobra;

                        if (totalPagesSobra <= 5) {
                          pageNumberSobra = i + 1;
                        } else if (currentPageSobra <= 3) {
                          pageNumberSobra = i + 1;
                        } else if (currentPageSobra >= totalPagesSobra - 2) {
                          pageNumberSobra = totalPagesSobra - 4 + i;
                        } else {
                          pageNumberSobra = currentPageSobra - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumberSobra}
                            variant={
                              currentPageSobra === pageNumberSobra
                                ? 'default'
                                : 'outline'
                            }
                            size="icon"
                            onClick={() =>
                              handlePageChangeSobra(pageNumberSobra)
                            }
                            className="h-8 w-8"
                          >
                            {pageNumberSobra}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeSobra(currentPageSobra + 1)}
                    disabled={
                      currentPageSobra === totalPagesSobra ||
                      totalPagesSobra === 0
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeSobra(totalPagesSobra)}
                    disabled={
                      currentPageSobra === totalPagesSobra ||
                      totalPagesSobra === 0
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                    <span className="sr-only">Última</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Inversão</h2>

            <div className="w-full md:w-1/3">
              <Input
                placeholder="Digite um sku da nota fiscal, sku que recebemos ou nota fiscal"
                value={searchQueryInversao}
                onChange={e => {
                  setSearchQueryInversao(e.target.value);
                  setCurrentPageInversao(1); // Reset to first page on search
                }}
                className="w-full"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listagem de itens</CardTitle>
              <CardDescription>
                Mostrando {startIndexInversao + 1}-
                {Math.min(endIndexInversao, filteredProductsInversao?.length)}{' '}
                de {filteredProductsInversao?.length} divergências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b bg-muted/60 p-3 font-medium">
                  <div>Sku Nota Fiscal</div>
                  <div>Qtd. Nota Fiscal</div>
                  <div>Sku Recebemos</div>
                  <div>Qtd. Recebemos</div>
                  <div>Nota Fiscal</div>
                  <div>Data Identificação</div>
                </div>
                {currentProductsInversao?.length > 0 ? (
                  currentProductsInversao?.map((product: Divergencia) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-6 border-b p-3"
                    >
                      <div>{product?.skuNotaFiscal}</div>
                      <div>{product?.qtdNotaFiscal}</div>
                      <div>{product?.skuRecebemosFisicamente}</div>
                      <div>{product?.qtdRecebemosFisicamente}</div>
                      <div>{product?.notaFiscal || 'N/A'}</div>
                      <div>
                        {dayjs(product?.created_at).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma divergência de Inversao encontrada
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Itens por página
                  </p>
                  <Select
                    value={itemsPerPageInversao.toString()}
                    onValueChange={handleItemsPerPageChangeInversao}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPageInversao} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeInversao(1)}
                    disabled={currentPageInversao === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                    <span className="sr-only">Primeira</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handlePageChangeInversao(currentPageInversao - 1)
                    }
                    disabled={currentPageInversao === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Anterior</span>
                  </Button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from(
                      { length: Math.min(totalPagesInversao, 5) },
                      (_, i) => {
                        let pageNumberInversao;

                        if (totalPagesInversao <= 5) {
                          pageNumberInversao = i + 1;
                        } else if (currentPageInversao <= 3) {
                          pageNumberInversao = i + 1;
                        } else if (
                          currentPageInversao >=
                          totalPagesInversao - 2
                        ) {
                          pageNumberInversao = totalPagesInversao - 4 + i;
                        } else {
                          pageNumberInversao = currentPageInversao - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumberInversao}
                            variant={
                              currentPageInversao === pageNumberInversao
                                ? 'default'
                                : 'outline'
                            }
                            size="icon"
                            onClick={() =>
                              handlePageChangeInversao(pageNumberInversao)
                            }
                            className="h-8 w-8"
                          >
                            {pageNumberInversao}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handlePageChangeInversao(currentPageInversao + 1)
                    }
                    disabled={
                      currentPageInversao === totalPagesInversao ||
                      totalPagesInversao === 0
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChangeInversao(totalPagesInversao)}
                    disabled={
                      currentPageInversao === totalPagesInversao ||
                      totalPagesInversao === 0
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                    <span className="sr-only">Última</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other pages
function UsersContent() {
  const [allProducts, setAllProducts] = React.useState<User[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  React.useEffect(() => {
    getAllUsers()
      .then(data => {
        console.log('users', data?.data);
        const ok = data !== null ? data?.data : [];
        setAllProducts([...ok]);
      })
      .catch(err => {
        console.log('erro', err);
      });
  }, []);

  const filteredProducts = React.useMemo(() => {
    return allProducts?.filter(
      product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.profile?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
    );
  }, [searchQuery, allProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: any) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore os usuários
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Digite um conferente, nota fiscal, UP"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de usuários</CardTitle>
          <CardDescription>
            Mostrando {startIndex + 1}-
            {Math.min(endIndex, filteredProducts?.length)} de{' '}
            {filteredProducts?.length} usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 border-b bg-muted/50 p-3 font-medium">
              {/* <div>ID</div> */}
              <div>Nome</div>
              <div>E-mail</div>
              <div>Permissão</div>
              <div>Status</div>
              <div>Data Inclusão</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: User) => (
                <div key={product.id} className="grid grid-cols-5 border-b p-3">
                  {/* <div>#{product?.id?.substring(0, 8)}</div> */}
                  <div>{product?.name}</div>
                  <div className="truncate text-ellipsis">{product?.email}</div>
                  <div>
                    <Badge
                      variant={
                        product?.profile === TipoPerfil.MEMBER
                          ? 'outline'
                          : product?.profile === TipoPerfil.ADMIN
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {getTipoPerfil(product?.profile)}
                    </Badge>
                  </div>
                  <div>
                    <Switch
                      className=""
                      checked={product?.status}
                      onCheckedChange={() => {
                        console.log('teste');
                        // adicionar a função de editar status
                      }}
                    />
                  </div>
                  <div>{dayjs(product?.created_at).format('DD/MM/YYYY')}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum Formulário PTP encontrado
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Itens por página</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
                <span className="sr-only">Primeira</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;

                  // Logic to show pages around current page
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? 'default' : 'outline'
                      }
                      size="icon"
                      onClick={() => handlePageChange(pageNumber)}
                      className="h-8 w-8"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
                <span className="sr-only">Última</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      <p className="text-muted-foreground">
        View your business performance metrics.
      </p>
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/25" />
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <p className="text-muted-foreground">Track and manage customer orders.</p>
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/25" />
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      <p className="text-muted-foreground">Schedule and manage your events.</p>
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Monthly View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/25" />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">
        Configure your application preferences.
      </p>
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/25" />
        </CardContent>
      </Card>
    </div>
  );
}

function HelpContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
      <p className="text-muted-foreground">
        Get assistance with using the application.
      </p>
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Support Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/25" />
        </CardContent>
      </Card>
    </div>
  );
}
