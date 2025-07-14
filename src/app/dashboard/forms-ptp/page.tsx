'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sheet } from 'lucide-react';
import dayjs from 'dayjs';
import { getAllFormsPtp, generateExcelFormsPtp } from './actions';
import { getTipoEspecificacao } from '@/utils/get-tipo-especificacao';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
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
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { FormPtp } from '@/types/form-ptp';

export default function FormsPtpPage() {
  const [allProducts, setAllProducts] = useState<FormPtp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoadingPtp, setIsLoadingPtp] = useState(false);

  useEffect(() => {
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

  const filteredProducts = useMemo(() => {
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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
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
