/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sheet } from 'lucide-react';
import { getDivergencesRequest } from './actions';
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
import { Divergencia, TipoDivergencia } from '@/types/divergencia';
import { generateExcelDivergencias } from '@/utils/generate-excel-divergencias';

export default function DivergenciasPage() {
  const [allProductsFalta, setAllProductsFalta] = useState<Divergencia[]>([]);
  const [allProductsSobra, setAllProductsSobra] = useState<Divergencia[]>([]);
  const [allProductsInversao, setAllProductsInversao] = useState<Divergencia[]>(
    [],
  );
  const [searchQueryFalta, setSearchQueryFalta] = useState('');
  const [currentPageFalta, setCurrentPageFalta] = useState(1);
  const [itemsPerPageFalta, setItemsPerPageFalta] = useState(10);
  const [searchQuerySobra, setSearchQuerySobra] = useState('');
  const [currentPageSobra, setCurrentPageSobra] = useState(1);
  const [itemsPerPageSobra, setItemsPerPageSobra] = useState(10);
  const [searchQueryInversao, setSearchQueryInversao] = useState('');
  const [currentPageInversao, setCurrentPageInversao] = useState(1);
  const [itemsPerPageInversao, setItemsPerPageInversao] = useState(10);
  const [isLoadingDivergencia, setIsLoadingDivergencia] = useState(false);

  useEffect(() => {
    getDivergencesRequest()
      .then(data => {
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

  const filteredProductsFalta = useMemo(() => {
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

  const filteredProductsSobra = useMemo(() => {
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

  const filteredProductsInversao = useMemo(() => {
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

      {/* Falta Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Falta</h3>
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Digite um SKU ou nota fiscal"
              value={searchQueryFalta}
              onChange={(e: any) => {
                setSearchQueryFalta(e.target.value);
                setCurrentPageFalta(1);
              }}
              className="w-full"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Divergências de Falta</CardTitle>
            <CardDescription>
              Mostrando {startIndexFalta + 1}-
              {Math.min(endIndexFalta, filteredProductsFalta?.length)} de{' '}
              {filteredProductsFalta?.length} divergências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-4 border-b bg-muted/50 p-3 font-medium">
                <div>Nota Fiscal</div>
                <div>SKU Faltando</div>
                <div>Quantidade</div>
                <div>Data</div>
              </div>
              {currentProductsFalta?.length > 0 ? (
                currentProductsFalta?.map((product: Divergencia) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-4 border-b p-3"
                  >
                    <div>{product?.notaFiscal}</div>
                    <div>{product?.skuFaltandoFisicamente}</div>
                    <div>{product?.qtdFaltandoFisicamente}</div>
                    <div>
                      {new Date(product?.created_at).toLocaleDateString()}
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
                          onClick={() => handlePageChangeFalta(pageNumberFalta)}
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

      {/* Sobra Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Sobra</h3>
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Digite um SKU ou nota fiscal"
              value={searchQuerySobra}
              onChange={(e: any) => {
                setSearchQuerySobra(e.target.value);
                setCurrentPageSobra(1);
              }}
              className="w-full"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Divergências de Sobra</CardTitle>
            <CardDescription>
              Mostrando {startIndexSobra + 1}-
              {Math.min(endIndexSobra, filteredProductsSobra?.length)} de{' '}
              {filteredProductsSobra?.length} divergências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-4 border-b bg-muted/50 p-3 font-medium">
                <div>Nota Fiscal</div>
                <div>SKU Sobrando</div>
                <div>Quantidade</div>
                <div>Data</div>
              </div>
              {currentProductsSobra?.length > 0 ? (
                currentProductsSobra?.map((product: Divergencia) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-4 border-b p-3"
                  >
                    <div>{product?.notaFiscal}</div>
                    <div>{product?.skuSobrandoFisicamente}</div>
                    <div>{product?.qtdSobrandoFisicamente}</div>
                    <div>
                      {new Date(product?.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma divergência de sobra encontrada
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
                          onClick={() => handlePageChangeSobra(pageNumberSobra)}
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

      {/* Inversão Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Inversão</h3>
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Digite um SKU ou nota fiscal"
              value={searchQueryInversao}
              onChange={(e: any) => {
                setSearchQueryInversao(e.target.value);
                setCurrentPageInversao(1);
              }}
              className="w-full"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Divergências de Inversão</CardTitle>
            <CardDescription>
              Mostrando {startIndexInversao + 1}-
              {Math.min(endIndexInversao, filteredProductsInversao?.length)} de{' '}
              {filteredProductsInversao?.length} divergências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b bg-muted/50 p-3 font-medium">
                <div>Nota Fiscal</div>
                <div>SKU Nota Fiscal</div>
                <div>SKU Recebido</div>
                <div>Quantidade</div>
                <div>Data</div>
              </div>
              {currentProductsInversao?.length > 0 ? (
                currentProductsInversao?.map((product: Divergencia) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-5 border-b p-3"
                  >
                    <div>{product?.notaFiscal}</div>
                    <div>{product?.skuNotaFiscal}</div>
                    <div>{product?.skuRecebemosFisicamente}</div>
                    <div>{product?.qtdRecebemosFisicamente}</div>
                    <div>
                      {new Date(product?.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma divergência de inversão encontrada
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
  );
}
