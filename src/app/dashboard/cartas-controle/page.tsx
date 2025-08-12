/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sheet, Eye, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { getCartasControleRequest } from './actions';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { CartaControle } from '@/types/carta-controle';
import { listaTurnos } from '@/utils/listaTurnos';
import { generateExcelCartasControle } from '@/utils/generate-excel-cartas-controle';

export default function CartasControlePage() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<CartaControle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoadingPtp, setIsLoadingPtp] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<CartaControle | null>(
    null,
  );

  useEffect(() => {
    getCartasControleRequest()
      .then((data: any) => {
        console.log('teste', data?.data);
        const ok = data !== null ? data?.data : [];
        setAllProducts([...ok]);
      })
      .catch((err: any) => {
        console.log('erro', err);
      });
  }, []);

  const filteredProducts = useMemo(() => {
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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
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
    router.push(`/dashboard/cartas-controle/${cartaControle.id}`);
  };

  // Handle delete confirmation
  const handleDeleteClick = (cartaControle: CartaControle) => {
    setProductToDelete(cartaControle);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = () => {
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
            placeholder="Digite conferente, turno, documento ou remessa"
            value={searchQuery}
            onChange={(e: any) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
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
            <div
              className="grid border-b bg-muted/50 p-3 font-medium"
              style={{ gridTemplateColumns: '20% 10% 15% 15% 10% 10% 10% 10%' }}
            >
              {/* <div>ID</div> */}
              <div>Conferente/Técnico</div>
              <div>Turno</div>
              <div>Remessa</div>
              <div>Doc. Transporte (DT)</div>
              <div>Doca</div>
              <div>Capacidade Veículo</div>
              <div>Data Recebimento</div>
              <div className="justify-self-center">Ações</div>
            </div>
            {currentProducts?.length > 0 ? (
              currentProducts?.map((product: CartaControle) => (
                <div
                  key={product.id}
                  className="grid border-b p-2"
                  style={{
                    gridTemplateColumns: '20% 10% 15% 15% 10% 10% 10% 10%',
                  }}
                >
                  {/* <div>#{product?.id?.substring(0, 8)}</div> */}
                  <div className="flex-wrap break-words p-1">
                    {product?.conferente}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {listaTurnos.find(t => t.value === product.turno)?.label}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.remessa}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.documentoTransporte}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.doca}
                  </div>
                  <div className="flex-wrap break-words p-1">
                    {product?.capacidadeVeiculo}
                  </div>
                  <div className="flex-wrap break-words p-1">
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
                <span className="text-muted-foreground">Remessa:</span>{' '}
                {productToDelete.remessa}
              </p>
              <p>
                <span className="text-muted-foreground">
                  Documento Transporte:
                </span>{' '}
                {productToDelete.documentoTransporte}
              </p>
              <p>
                <span className="text-muted-foreground">Conferente:</span>{' '}
                {productToDelete.conferente}
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
