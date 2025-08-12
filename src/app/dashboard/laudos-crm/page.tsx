/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sheet, Eye, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { getLaudosCrmRequest } from './actions';
import { getTurno } from '@/utils/get-turno';

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
import { LaudoCrm } from '@/types/laudo-crm';
import { generateExcelLaudosCrm } from '@/utils/generate-excel-laudos-crm';

export default function LaudosCrmPage() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<LaudoCrm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoadingLaudo, setIsLoadingLaudo] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<LaudoCrm | null>(null);

  useEffect(() => {
    getLaudosCrmRequest()
      .then((data: any) => {
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

          const tiposNaoConformidadeFormatted = laudosCrm.map((laudo: any) => {
            const turno = getTurno(laudo?.turno);

            return {
              ...laudo,
              turno,
              observacoes: laudo?.observacoes || 'Sem observações',
            };
          });

          setAllProducts([...tiposNaoConformidadeFormatted]);
        }
      })
      .catch((err: any) => {
        console.log('erro', err);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts?.filter(
      (product: any) =>
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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
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
    router.push(`/dashboard/laudos-crm/${laudoCrm.id}`);
  };

  // Handle delete confirmation
  const handleDeleteClick = (laudoCrm: LaudoCrm) => {
    setProductToDelete(laudoCrm);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = () => {
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
            <div
              className="grid border-b bg-muted/50 p-3 font-medium"
              style={{ gridTemplateColumns: '16% 18% 16% 10% 10% 10% 10% 10%' }}
            >
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
                <div
                  key={product.id}
                  className="grid border-b p-2"
                  style={{
                    gridTemplateColumns: '16% 18% 16% 10% 10% 10% 10% 10%',
                  }}
                >
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
                Nenhum Laudo CRM encontrado
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
