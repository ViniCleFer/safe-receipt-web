/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Plus, Trash2, Pencil, ChevronRight } from 'lucide-react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from './actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { TipoPerfil, Permission, User } from '@/types/user';

export default function UsuariosPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [drawerFormData, setDrawerFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    profile: TipoPerfil.MEMBER,
    permissions: [Permission.MOBILE, Permission.WEB],
    status: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [drawerCreateOpen, setDrawerCreateOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllUsers()
      .then((data: any) => {
        console.log('users', data?.data);
        const ok = data !== null ? data?.data : [];
        setAllUsers([...ok]);
      })
      .catch((err: any) => {
        console.log('erro', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Handle delete confirmation
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

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
      permissions: user?.permissions,
      status: user?.status,
      password: user?.password || '',
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
        const updatedUsers = allUsers.map(user =>
          user.id === drawerFormData.id
            ? { ...user, ...response.data[0] }
            : user,
        );
        setAllUsers(updatedUsers);
        setDrawerOpen(false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserStatusChange = async (userId: string, status: boolean) => {
    setIsLoading(true);

    try {
      const response = await updateUserStatus(userId, status);

      if (response?.data && response?.status === 200) {
        const updatedUsers = allUsers.map(user =>
          user.id === userId ? { ...user, status } : user,
        );
        setAllUsers(updatedUsers);
      }
    } catch (error) {
      console.log('handleUserStatusChange error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserCreate = () => {
    setDrawerCreateOpen(true);
    setDrawerFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      profile: TipoPerfil.MEMBER,
      permissions: [Permission.MOBILE, Permission.WEB],
      status: false,
    });
  };

  // Handle save changes from drawer
  const handleSaveUser = async () => {
    setIsLoading(true);

    try {
      const response = await createUser(drawerFormData);

      if (response?.data && response?.data?.length > 0 && response !== null) {
        setAllUsers(response.data);
        setDrawerCreateOpen(false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Input
            placeholder="Digite nome, email ou perfil"
            value={searchQuery}
            onChange={(e: any) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full"
          />
          <Button onClick={handleUserCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
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
            <div className="grid grid-cols-6 border-b bg-muted/50 p-3 font-medium">
              <div>Nome</div>
              <div>Email</div>
              <div>Perfil</div>
              <div>Permissões</div>
              <div>Status</div>
              <div className="justify-self-center">Ações</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((user: User) => (
                <div key={user.id} className="grid grid-cols-6 border-b p-2">
                  <div className="flex-wrap break-words p-1">{user?.name}</div>
                  <div className="flex-wrap break-words p-1">{user?.email}</div>
                  <div className="flex-wrap break-words p-1">
                    <Badge
                      variant={
                        user?.profile === TipoPerfil.ADMIN
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {user?.profile === TipoPerfil.ADMIN ? 'Admin' : 'Membro'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 p-1">
                    {user?.permissions?.map((permission: Permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  <div className="p-1">
                    <Switch
                      checked={user?.status}
                      onCheckedChange={checked =>
                        handleUserStatusChange(user.id, checked)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex space-x-2 justify-self-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            className="cursor-pointer h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
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
                            onClick={() => handleDeleteClick(user)}
                            className="cursor-pointer h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
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
                Nenhum usuário encontrado
              </div>
            )}
          </div>

          {/* Pagination */}
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
              Você tem certeza que quer apagar este usuário? Essa ação não
              poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="py-4">
              <p className="font-medium">Detalhes do Usuário:</p>
              <p>
                <span className="text-muted-foreground">Nome:</span>{' '}
                {userToDelete.name}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{' '}
                {userToDelete.email}
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

      {/* Edit User Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="h-full w-[400px] ml-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Usuário</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={drawerFormData.name}
                onChange={handleDrawerInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={drawerFormData.email}
                onChange={handleDrawerInputChange}
              />
            </div>
            <div>
              <Label htmlFor="profile">Perfil</Label>
              <Select
                value={drawerFormData.profile}
                onValueChange={value =>
                  setDrawerFormData(prev => ({
                    ...prev,
                    profile: value as TipoPerfil,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoPerfil.ADMIN}>Admin</SelectItem>
                  <SelectItem value={TipoPerfil.MEMBER}>Membro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSaveDrawerChanges} disabled={isLoading}>
              {isLoading ? <Spinner size="small" /> : 'Salvar'}
            </Button>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Create User Drawer */}
      <Drawer
        open={drawerCreateOpen}
        onOpenChange={setDrawerCreateOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-[400px] ml-auto">
          <DrawerHeader>
            <DrawerTitle>Criar Usuário</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={drawerFormData.name}
                onChange={handleDrawerInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={drawerFormData.email}
                onChange={handleDrawerInputChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={drawerFormData.password}
                onChange={handleDrawerInputChange}
              />
            </div>
            <div>
              <Label htmlFor="profile">Perfil</Label>
              <Select
                value={drawerFormData.profile}
                onValueChange={value =>
                  setDrawerFormData(prev => ({
                    ...prev,
                    profile: value as TipoPerfil,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoPerfil.ADMIN}>Admin</SelectItem>
                  <SelectItem value={TipoPerfil.MEMBER}>Membro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSaveUser} disabled={isLoading}>
              {isLoading ? <Spinner size="small" /> : 'Criar'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDrawerCreateOpen(false)}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
