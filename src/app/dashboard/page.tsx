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
  ClipboardList,
  Pencil,
  Trash2,
  X,
  Eye,
} from 'lucide-react';
import dayjs from 'dayjs';
import { pdf } from '@react-pdf/renderer';

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
  createUser,
  deleteUser,
  getAllFormsPtp,
  getAllUsers,
  getCartasControleByIdRequest,
  getCartasControleRequest,
  getDivergencesRequest,
  getLaudosCrmByIdRequest,
  getLaudosCrmRequest,
  getUserByEmail,
  logout,
  updateUser,
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
import { CartaControle } from '@/types/carta-controle';
import { generateExcelCartasControle } from '@/utils/generate-excel-cartas-controle';
import { listaTurnos } from '@/utils/listaTurnos';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';
import CartaControleDocument from '@/components/pdf-carta-controle';
// import logo from '@/assets/logo.svg';
import { getTurno } from '@/utils/get-turno';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { getTipoEvidencia } from '@/utils/get-tipo-evidencia';
import LaudoCrmDocument from '@/components/pdf-laudo-crm';
import { getInfosPorOrdem } from '@/utils/get-infos-por-ordem';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('forms-ptp');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [laudoCrmSelected, setLaudoCrmSelected] =
    React.useState<LaudoCrm | null>(null);
  const [cartaControleSelected, setCartaControleSelected] =
    React.useState<CartaControle | null>(null);

  React.useEffect(() => {
    console.log('laudoCrmSelected', laudoCrmSelected);
  }, [laudoCrmSelected]);

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
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            {activePage === 'forms-ptp' && <FormPtpContent />}
            {activePage === 'laudos-crm' && laudoCrmSelected === null && (
              <LaudoCrmContent setLaudoCrmSelected={setLaudoCrmSelected} />
            )}
            {activePage === 'divergencias' && <DivergenciasContent />}
            {activePage === 'cartas-controle' &&
              cartaControleSelected === null && (
                <CartasControleContent
                  setCartaControleSelected={setCartaControleSelected}
                />
              )}
            {activePage === 'usuarios' && <UsersContent />}
            {activePage === 'Analytics' && <AnalyticsContent />}
            {activePage === 'Orders' && <OrdersContent />}
            {activePage === 'Calendar' && <CalendarContent />}
            {activePage === 'Settings' && <SettingsContent />}
            {activePage === 'Help' && <HelpContent />}
            {activePage === 'laudos-crm' && laudoCrmSelected && (
              <DetalhesLaudoCrmContent
                laudoCrmSelected={laudoCrmSelected}
                onBack={() => setLaudoCrmSelected(null)}
              />
            )}
            {activePage === 'cartas-controle' && cartaControleSelected && (
              <DetalhesCartaControleContent
                cartaControleSelected={cartaControleSelected}
                onBack={() => setCartaControleSelected(null)}
              />
            )}
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
        .then(data => {
          console.log('data', data);
          setUser(data?.data);
        })
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
      title: 'Carta Controle',
      icon: ClipboardList,
      route: 'cartas-controle',
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
                                isActive={activePage === item.route}
                                onClick={() => setActivePage(item.route)}
                                className="cursor-pointer"
                              >
                                <item.icon
                                  className={`${
                                    activePage === item.route
                                      ? 'text-primary'
                                      : 'default'
                                  }`}
                                />
                                <span
                                  className={`${
                                    activePage === item.route
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
          )}
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
            placeholder="Digite um conferente/técnico, nota fiscal, UP"
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
              <div>Conferente/Técnico</div>
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
                  <div>{product?.notaFiscal ? product?.notaFiscal : 'N/A'}</div>
                  <div>{product?.opcaoUp ? product?.opcaoUp : 'N/A'}</div>
                  <div>
                    {product?.qtdAnalisada ? product?.qtdAnalisada : 'N/A'}
                  </div>
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

// Laudo Crm Page content
function LaudoCrmContent({ setLaudoCrmSelected }: any) {
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [isLoadingLaudo, setIsLoadingLaudo] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<LaudoCrm | null>(
    null,
  );

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
              },
            ];
          }

          const tiposNaoConformidadeFormatted = laudosCrm.map(laudo => {
            const tiposNaoConformidade = laudo?.tiposNaoConformidade;
            const lotes = laudo?.lotes;
            const codigosProdutos = laudo?.codigoProdutos;
            const turno = getTurno(laudo?.turno);

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
              turno,
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

  // Handle edit product
  const handleEdit = (laudoCrm: LaudoCrm) => {
    setLaudoCrmSelected(laudoCrm);
  };

  // Handle delete confirmation
  const handleDeleteClick = (laudoCrm: LaudoCrm) => {
    setProductToDelete(laudoCrm);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = () => {
    // Here you would implement the actual deletion logic
    console.log(`Deleting product: ${productToDelete?.id}`);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
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
            <div className="grid grid-cols-8 border-b bg-muted/50 p-3 font-medium">
              <div>Nota Fiscal/DT</div>
              <div>Transportador</div>
              <div>Remessa</div>
              <div>Placa</div>
              <div>Turno</div>
              <div>CD Origem</div>
              <div>Data Identificação</div>
              <div className="justify-self-center">Ações</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: LaudoCrm) => (
                <div key={product.id} className="grid grid-cols-8 border-b p-2">
                  <div className="flex-wrap break-words p-1">
                    {product?.notaFiscal}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.transportador}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.remessa}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.placa}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.turno}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.cdOrigem}
                  </div>
                  <div>
                    {dayjs(product?.dataIdentificacao).format('DD/MM/YYYY')}
                  </div>
                  <div className="flex space-x-2 justify-self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                            className="cursor-pointer h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remover</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirma Deleção</DialogTitle>
            <DialogDescription>
              Você tem certeza que quer apagar esse Laudo CRM? Essa ação não
              poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="py-4">
              <p className="font-medium">Detalhes Laudo CRM:</p>
              <p>
                <span className="text-muted-foreground">Remessa:</span>{' '}
                {productToDelete.remessa}
              </p>
              <p>
                <span className="text-muted-foreground">Nota Fiscal/DT:</span>{' '}
                {productToDelete.notaFiscal}
              </p>
              <p>
                <span className="text-muted-foreground">Turno:</span>{' '}
                {productToDelete.turno}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Detalhes Laudo Crm Page
function DetalhesLaudoCrmContent({
  laudoCrmSelected,
  onBack,
}: {
  laudoCrmSelected: LaudoCrm | null;
  onBack: () => void;
}) {
  const [laudoCrm, setLaudoCrm] = React.useState<LaudoCrm | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');

  React.useEffect(() => {
    if (laudoCrmSelected && laudoCrmSelected !== null) {
      getLaudosCrmByIdRequest(laudoCrmSelected?.id)
        .then(response => {
          console.log('response getLaudosCrmByIdRequest', response);

          if (response?.status === 200) {
            const data = response?.data[0];

            setLaudoCrm(data);
          }

          // if (response?.status === 200) {
          //   let laudosCrm: any[] = [];

          //   if (response?.data?.length === 1) {
          //     for await (const laudoCrm of response?.data as any[]) {
          //       const evidencias = laudoCrm?.evidencias;

          //       let urlsEvidencias: any[] = [];

          //       if (evidencias?.length === 0) {
          //         urlsEvidencias = [];
          //       } else {
          //         for await (const evidenciaId of evidencias) {
          //           const { data } = await getLaudoCrmEvidencesRequest(
          //             laudoCrm?.id,
          //             evidenciaId,
          //           );

          //           const evidencia = data?.publicUrl;

          //           if (evidencia) {
          //             urlsEvidencias = [...urlsEvidencias, evidencia];
          //           } else {
          //             urlsEvidencias = [...urlsEvidencias];
          //           }
          //         }
          //       }

          //       laudosCrm = [
          //         ...laudosCrm,
          //         {
          //           ...laudoCrm,
          //           evidencias: [...urlsEvidencias],
          //         },
          //       ];
          //     }

          //     const tiposNaoConformidadeFormatted = laudosCrm.map(laudo => {
          //       const tiposNaoConformidade = laudo?.tiposNaoConformidade;
          //       const lotes = laudo?.lotes;
          //       const codigosProdutos = laudo?.codigoProdutos;
          //       const qtdCaixasNaoConformes = laudo?.qtdCaixasNaoConformes;

          //       let tiposNaoConformidadeFormatted = '';

          //       if (tiposNaoConformidade?.length > 0) {
          //         tiposNaoConformidadeFormatted = tiposNaoConformidade
          //           .map(
          //             (tipo: string) =>
          //               '- ' +
          //               tiposNaoConformidadeList?.find(
          //                 item => item?.value === tipo,
          //               )?.label,
          //           )
          //           .join('\n');
          //       } else {
          //         tiposNaoConformidadeFormatted =
          //           'Sem tipos de não conformidade';
          //       }

          //       let lotesFormatted = '';

          //       if (lotes?.length > 0) {
          //         lotesFormatted = lotes
          //           .map((lote: string) => '- ' + lote?.trim())
          //           .join('\n');
          //       } else {
          //         lotesFormatted = 'Sem lotes cadastrados';
          //       }

          //       let codigosProdutosFormatted = '';

          //       if (codigosProdutos?.length > 0) {
          //         codigosProdutosFormatted = codigosProdutos
          //           .map(
          //             (codigoProduto: string) => '- ' + codigoProduto?.trim(),
          //           )
          //           .join('\n');
          //       } else {
          //         codigosProdutosFormatted =
          //           'Sem códigos de produtos cadastrados';
          //       }

          //       let qtdCaixasNaoConformesFormatted = '';

          //       if (qtdCaixasNaoConformes?.length > 0) {
          //         qtdCaixasNaoConformesFormatted = qtdCaixasNaoConformes
          //           .map(
          //             (qtdCaixasNaoConforme: string) =>
          //               '- ' + qtdCaixasNaoConforme?.trim(),
          //           )
          //           .join('\n');
          //       } else {
          //         qtdCaixasNaoConformesFormatted =
          //           'Sem códigos de produtos cadastrados';
          //       }

          //       const upOrigem = listaUPsOrigem?.find(
          //         u => u?.value === laudo?.upOrigem,
          //       )?.label;
          //       const cdOrigem = listaCDsOrigem?.find(
          //         u => u?.value === laudo?.cdOrigem,
          //       )?.label;

          //       return {
          //         ...laudo,
          //         upOrigem: upOrigem || 'Sem UP de Origem',
          //         cdOrigem: cdOrigem || 'Sem CD de Origem',
          //         observacoes: laudo?.observacoes || 'Sem observações',
          //         tiposNaoConformidade: tiposNaoConformidadeFormatted,
          //         lotes: lotesFormatted,
          //         codigosProdutos: codigosProdutosFormatted,
          //         qtdCaixasNaoConformes: qtdCaixasNaoConformesFormatted,
          //       };
          //     });

          //     console.log(
          //       'laudosCrm => ',
          //       JSON.stringify(tiposNaoConformidadeFormatted[0], null, 2),
          //     );

          //     setLaudoCrm({ ...(tiposNaoConformidadeFormatted[0] as any) });
          //   }
          // }
        })
        .catch(err => console.error('Page Error Get user', err));
    }
  }, [laudoCrmSelected]);

  // Function to open image preview
  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleDownload = async () => {
    if (!laudoCrm) return;

    // console.log('laudoCrm', laudoCrm);
    // Gerar o PDF com os dados dinâmicos
    const blob = await pdf(<LaudoCrmDocument data={laudoCrm} />).toBlob();

    // Criar link de download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laudo CRM - NF ${laudoCrm?.notaFiscal}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Detalhes</h2>
          <p className="text-muted-foreground">
            Detalhes da informação sobre o Laudo CRM
          </p>
        </div>
        <Button variant="outline" onClick={onBack} className="cursor-pointer">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card key={laudoCrmSelected?.id} className="overflow-hidden pt-0">
        <CardHeader className="flex flex-row  items-center justify-between bg-primary/5 py-3">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-bold">
              ID: {laudoCrmSelected?.id}
            </CardTitle>

            <CardDescription>
              Data:{' '}
              {dayjs(laudoCrmSelected?.dataIdentificacao).format('DD/MM/YYYY')}
            </CardDescription>
          </div>
          {/* <Badge variant="outline" className="ml-auto">
            {
              listaTurnos?.find(
                turno => turno?.value === laudoCrmSelected?.turno,
              )?.label
            }
          </Badge> */}
          <Button className="cursor-pointer" onClick={handleDownload}>
            Baixar PDF
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between gap-3">
            <div className="flex w-[50%] flex-col gap-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">
                  Nota Fiscal/DT
                </p>
                <p>{laudoCrmSelected?.notaFiscal}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Transportador
                </p>
                <p>{laudoCrmSelected?.transportador}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Remessa</p>
                <p>{laudoCrmSelected?.remessa}</p>
              </div>
            </div>
            <div className="flex w-[50%] flex-col gap-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Conferente</p>
                <p>{laudoCrmSelected?.conferente}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">UP Origem</p>
                <p>
                  {
                    listaUPsOrigem?.find(
                      up => up?.value === laudoCrmSelected?.upOrigem,
                    )?.label
                  }
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">CD Origem</p>
                <p>
                  {
                    listaCDsOrigem?.find(
                      up => up?.value === laudoCrmSelected?.cdOrigem,
                    )?.label
                  }
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-muted-foreground mb-1">
              Observações
            </p>
            <p className="text-sm">{laudoCrmSelected?.observacoes}</p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground mb-2">
              Evidências ({laudoCrm?.evidencias?.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {laudoCrm &&
                laudoCrm?.evidencias?.length > 0 &&
                laudoCrm?.evidencias?.map((img, index) => (
                  <div key={index} className="flex">
                    <Image
                      src={img}
                      alt={`Evidence ${index + 1}`}
                      className="h-50 w-50 object-cover rounded-md border hover:opacity-90 cursor-pointer"
                      onClick={() => openImagePreview(img)}
                      width={200}
                      height={200}
                    />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogTitle />
        <DialogContent className="w-200 h-200 max-w-[80vw] max-h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <DialogClose className="cursor-pointer rounded-full bg-background/80 p-2 backdrop-blur-sm hover:bg-black/10">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex items-center justify-center w-full h-full">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Preview"
                className="w-200 h-200 max-w-full max-h-[80vh] object-contain"
                width={800}
                height={800}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Divergencias page content
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

// Carta Controle page content
function CartasControleContent({ setCartaControleSelected }: any) {
  const [allProducts, setAllProducts] = React.useState<CartaControle[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [isLoadingPtp, setIsLoadingPtp] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] =
    React.useState<CartaControle | null>(null);

  React.useEffect(() => {
    getCartasControleRequest()
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
        product?.turno?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.documentoTransporte
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase()) ||
        product?.remessa?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
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

      return await generateExcelCartasControle();
    } catch (error) {
      console.log('error', error);
      return;
    } finally {
      setIsLoadingPtp(false);
    }
  };

  // Handle edit product
  const handleEdit = (cartaControle: CartaControle) => {
    setCartaControleSelected(cartaControle);
  };

  // Handle delete confirmation
  const handleDeleteClick = (cartaControle: CartaControle) => {
    setProductToDelete(cartaControle);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = () => {
    // Here you would implement the actual deletion logic
    console.log(`Deleting product: ${productToDelete?.id}`);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cartas Controle</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore as cartas controle
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Input
            placeholder="Digite um conferente/técnico, nota fiscal, UP"
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
            {filteredProducts?.length} cartas controle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-8 border-b bg-muted/50 p-3 font-medium">
              {/* <div>ID</div> */}
              <div>Conferente/Técnico</div>
              <div>Turno</div>
              <div>Remessa</div>
              <div>Doc. Transporte (DT)</div>
              <div>Doca</div>
              <div>Capacidade Veículo</div>
              <div>Data Recebimento</div>
              <div>Ações</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: CartaControle) => (
                <div key={product.id} className="grid grid-cols-8 border-b p-3">
                  {/* <div>#{product?.id?.substring(0, 8)}</div> */}
                  <div>{product?.conferente}</div>
                  <div>
                    {listaTurnos.find(t => t.value === product.turno)?.label}
                  </div>
                  <div>{product?.remessa}</div>
                  <div>{product?.documentoTransporte}</div>
                  <div>{product?.doca}</div>
                  <div>{product?.capacidadeVeiculo}</div>
                  <div>
                    {dayjs(product?.dataIdentificacao).format('DD/MM/YYYY')}
                  </div>
                  <div className="flex space-x-2 justify-self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                            className="cursor-pointer h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remover</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma carta controle encontrada
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirma Deleção</DialogTitle>
            <DialogDescription>
              Você tem certeza que quer apagar essa Carta Controle? Essa ação
              não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="py-4">
              <p className="font-medium">Detalhes Carta Controle:</p>
              <p>
                <span className="text-muted-foreground">Conferente:</span>{' '}
                {productToDelete?.conferente}
              </p>
              <p>
                <span className="text-muted-foreground">Remessa:</span>{' '}
                {productToDelete?.remessa}
              </p>
              <p>
                <span className="text-muted-foreground">
                  documentoTransporte:
                </span>{' '}
                {productToDelete?.documentoTransporte}
              </p>
              <p>
                <span className="text-muted-foreground">Doca:</span>{' '}
                {productToDelete?.doca}
              </p>
              <p>
                <span className="text-muted-foreground">Turno:</span>{' '}
                {productToDelete?.turno}
              </p>
              <p>
                <span className="text-muted-foreground">Evidênias:</span>{' '}
                {productToDelete?.evidencias?.length}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Detalhes Carta Controle Page
function DetalhesCartaControleContent({
  cartaControleSelected,
  onBack,
}: {
  cartaControleSelected: CartaControle | null;
  onBack: () => void;
}) {
  const [cartaControle, setCartaControle] =
    React.useState<CartaControle | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');

  React.useEffect(() => {
    if (cartaControleSelected && cartaControleSelected !== null) {
      getCartasControleByIdRequest(cartaControleSelected?.id)
        .then(response => {
          console.log('response getCartasControleByIdRequest', response);

          if (response?.status === 200) {
            const data = response?.data[0];

            setCartaControle(data);
          }
        })
        .catch(err => console.error('Page Error Get user', err));
    }
  }, [cartaControleSelected]);

  // Function to open image preview
  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleDownload = async () => {
    if (!cartaControle) return;
    // Gerar o PDF com os dados dinâmicos
    const blob = await pdf(
      <CartaControleDocument data={cartaControle} />,
    ).toBlob();

    // Criar link de download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Carta Controle - DT ${cartaControle?.documentoTransporte}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Detalhes</h2>
          <p className="text-muted-foreground">
            Detalhes da informação sobre a Carta Controle
          </p>
        </div>
        <Button variant="outline" onClick={onBack} className="cursor-pointer">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card key={cartaControleSelected?.id} className="overflow-hidden pt-0">
        <CardHeader className="flex flex-row  items-center justify-between bg-primary/5 py-3">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-bold">
              ID: {cartaControleSelected?.id}
            </CardTitle>

            <CardDescription>
              Data:{' '}
              {dayjs(cartaControleSelected?.dataIdentificacao).format(
                'DD/MM/YYYY',
              )}
            </CardDescription>
          </div>
          {/* <Badge variant="outline" className="ml-auto">
            {
              listaTurnos?.find(
                turno => turno?.value === cartaControleSelected?.turno,
              )?.label
            }
          </Badge> */}
          <Button className="cursor-pointer" onClick={handleDownload}>
            Baixar PDF
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between gap-3">
            <div className="flex w-[50%] flex-col gap-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">
                  Documento Transporte
                </p>
                <p>{cartaControleSelected?.documentoTransporte}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Remessa</p>
                <p>{cartaControleSelected?.remessa}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Conferente</p>
                <p>{cartaControleSelected?.conferente}</p>
              </div>
            </div>
            <div className="flex w-[50%] flex-col gap-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Turno</p>
                <p>{cartaControleSelected?.turno}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Doca</p>
                <p>{cartaControleSelected?.doca}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Capacidade Veículo
                </p>
                <p>{cartaControleSelected?.capacidadeVeiculo}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-muted-foreground mb-1">
              Observações
            </p>
            <p className="text-sm">{cartaControleSelected?.observacoes}</p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground mb-2">
              Evidências ({cartaControle?.evidencias?.length})
            </p>
            {/* <div className="flex flex-col w-full gap-4"> */}
            {cartaControle &&
              cartaControle?.evidencias?.length > 0 &&
              getInfosPorOrdem(cartaControle?.evidencias)?.map(
                (img: any, index) => (
                  <div key={index} className="flex flex-col gap-4 mb-4">
                    <span className="text-lg font-bold">
                      {getTipoEvidencia(img?.grupo)}
                    </span>
                    <div className="flex flex-row flex-wrap gap-2 mb-3">
                      {img?.data?.map((imgData: any, indexData: number) => (
                        <Image
                          key={indexData}
                          src={imgData?.url}
                          alt={`Evidence ${indexData + 1}`}
                          className="h-50 w-50 object-cover rounded-md border hover:opacity-90 cursor-pointer"
                          onClick={() => openImagePreview(imgData?.url)}
                          width={200}
                          height={200}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            {/* </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogTitle />
        <DialogContent className="w-200 h-200 max-w-[80vw] max-h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <DialogClose className="cursor-pointer rounded-full bg-background/80 p-2 backdrop-blur-sm hover:bg-black/10">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex items-center justify-center w-full h-full">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Preview"
                className="w-200 h-200 max-w-full max-h-[80vh] object-contain"
                width={800}
                height={800}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// User Page content
function UsersContent() {
  const [allUsers, setAllUsers] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [drawerFormData, setDrawerFormData] = React.useState({
    id: '',
    name: '',
    email: '',
    password: '',
    profile: TipoPerfil.MEMBER,
    status: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [drawerCreateOpen, setDrawerCreateOpen] = React.useState(false);

  React.useEffect(() => {
    getAllUsers()
      .then(data => {
        console.log('users', data?.data);
        const ok = data !== null ? data?.data : [];
        setAllUsers([...ok]);
      })
      .catch(err => {
        console.log('erro', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = React.useMemo(() => {
    return allUsers?.filter(
      product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.profile?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
    );
  }, [searchQuery, allUsers]);

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

  // Handle delete confirmation
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    // Here you would implement the actual deletion logic
    console.log(`Deleting product: ${userToDelete?.id}`);

    const response = await deleteUser(userToDelete?.id);
    console.log('response', response);

    if (response?.status === 204) {
      const userFiltered = allUsers?.filter(
        user => user?.id !== userToDelete?.id,
      );

      setAllUsers([...userFiltered]);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Handle view product in drawer
  const handleEdit = (user: User) => {
    setDrawerFormData({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      profile: user?.profile,
      status: user?.status,
      password: user?.password,
    });
    setDrawerOpen(true);
  };

  const handleDrawerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDrawerFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save changes from drawer
  const handleSaveDrawerChanges = async () => {
    setIsLoading(true);

    try {
      const response = await updateUser(drawerFormData);

      if (
        response?.data &&
        response?.data?.length > 0 &&
        response?.status === 200
      ) {
        const data = response?.data[0];

        const userIndex = allUsers?.findIndex(user => user?.id === data?.id);

        if (userIndex > -1) {
          allUsers[userIndex] = data;

          setAllUsers([...allUsers]);
        }

        setDrawerOpen(false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
    // Here you would implement the actual update logic
  };

  const handleUserCreate = () => {
    setDrawerCreateOpen(true);
  };

  // Handle save changes from drawer
  const handleSaveUser = async () => {
    setIsLoading(true);

    try {
      const response = await createUser(drawerFormData);

      if (response?.data && response?.data?.length > 0 && response !== null) {
        const users = response?.data;

        console.log('users', users);
        setAllUsers([...users]);

        setDrawerCreateOpen(false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
    // Here you would implement the actual update logic
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
            placeholder="Digite um nome, e-mail ou tipo do perfil"
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
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Listagem de usuários</CardTitle>
            <CardDescription>
              Mostrando {startIndex + 1}-
              {Math.min(endIndex, filteredProducts?.length)} de{' '}
              {filteredProducts?.length} usuários
            </CardDescription>
          </div>
          <Button className="cursor-pointer" onClick={handleUserCreate}>
            Cadastrar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b bg-muted/50 p-3 font-medium">
              {/* <div>ID</div> */}
              <div>Nome</div>
              <div>E-mail</div>
              <div>Permissão</div>
              <div>Status</div>
              <div>Data Inclusão</div>
              <div className="justify-self-center">Ações</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: User) => (
                <div key={product.id} className="grid grid-cols-6 border-b p-3">
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
                  <div className="flex space-x-2 justify-self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                            className="cursor-pointer h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remover</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirma Deleção</DialogTitle>
            <DialogDescription>
              Você tem certeza que quer apagar esse usuário? Essa ação não
              poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="py-4">
              <p className="font-medium">Detalhes do usuário:</p>
              <p>
                <span className="text-muted-foreground">Nome:</span>{' '}
                {userToDelete.name}
              </p>
              <p>
                <span className="text-muted-foreground">E-mail:</span>{' '}
                {userToDelete.email}
              </p>
              <p>
                <span className="text-muted-foreground">Profile:</span>{' '}
                {userToDelete.profile}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Editar Usuário</DrawerTitle>
              <DrawerDescription>
                {userToDelete &&
                  `Usuário #${userToDelete?.id} - ${userToDelete?.name}`}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="drawer-name">Nome</Label>
                  <Input
                    id="drawer-name"
                    name="name"
                    placeholder="Digite o nome"
                    value={drawerFormData?.name}
                    onChange={handleDrawerInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="drawer-email">E-mail</Label>
                  <Input
                    id="drawer-name"
                    name="email"
                    placeholder="Digite o e-mail"
                    value={drawerFormData?.email}
                    onChange={handleDrawerInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="drawer-profile">Perfil</Label>
                  <Select
                    value={drawerFormData?.profile}
                    onValueChange={value =>
                      setDrawerFormData((prev: any) => ({
                        ...prev,
                        profile: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" id="drawer-profile">
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TipoPerfil.ADMIN}>Admin</SelectItem>
                      <SelectItem value={TipoPerfil.MEMBER}>Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button
                className="cursor-pointer"
                onClick={handleSaveDrawerChanges}
                disabled={isLoading}
              >
                {isLoading && <Spinner size="small" className="text-white" />}
                Salvar
              </Button>
              <DrawerClose asChild>
                <Button
                  disabled={isLoading}
                  className="cursor-pointer"
                  variant="outline"
                >
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={drawerCreateOpen}
        onOpenChange={setDrawerCreateOpen}
        direction="right"
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Criar Usuário</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="drawer-name">Nome</Label>
                  <Input
                    id="drawer-name"
                    name="name"
                    placeholder="Digite o nome"
                    value={drawerFormData?.name}
                    onChange={handleDrawerInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="drawer-email">E-mail</Label>
                  <Input
                    id="drawer-email"
                    name="email"
                    type="email"
                    placeholder="Digite o e-mail"
                    value={drawerFormData?.email}
                    onChange={handleDrawerInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="drawer-password">Senha</Label>
                  <Input
                    id="drawer-password"
                    name="password"
                    placeholder="Digite uma senha"
                    value={drawerFormData?.password}
                    onChange={handleDrawerInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="drawer-profile">Perfil</Label>
                  <Select
                    value={drawerFormData?.profile}
                    onValueChange={value =>
                      setDrawerFormData((prev: any) => ({
                        ...prev,
                        profile: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" id="drawer-profile">
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TipoPerfil.ADMIN}>Admin</SelectItem>
                      <SelectItem value={TipoPerfil.MEMBER}>Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button
                className="cursor-pointer"
                onClick={handleSaveUser}
                disabled={isLoading}
              >
                {isLoading && <Spinner size="small" className="text-white" />}
                Cadastrar
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
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
