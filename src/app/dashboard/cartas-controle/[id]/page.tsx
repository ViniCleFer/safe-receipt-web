'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, X } from 'lucide-react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { pdf } from '@react-pdf/renderer';

import { getCartasControleByIdRequest } from '../actions';

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
  DialogClose,
} from '@/components/ui/dialog';
import CartaControleDocument from '@/components/pdf-carta-controle';

import { CartaControle } from '@/types/carta-controle';

export default function CartaControleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cartaControleId = params.id as string;

  const [cartaControle, setCartaControle] = useState<CartaControle | null>(
    null,
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartaControleId) {
      getCartasControleByIdRequest(cartaControleId)
        .then(response => {
          if (response?.status === 200 && response?.data?.length > 0) {
            const data = response?.data[0];
            setCartaControle(data);
          }
        })
        .catch(err => console.error('Page Error Get carta controle', err))
        .finally(() => setLoading(false));
    }
  }, [cartaControleId]);

  // Function to open image preview
  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleDownload = async () => {
    if (!cartaControle) return;

    const blob = await pdf(
      <CartaControleDocument data={cartaControle} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carta-controle-${cartaControle.remessa}-${dayjs(
      cartaControle.dataIdentificacao,
    ).format('DD-MM-YYYY')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!cartaControle) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium">Carta Controle não encontrada</p>
          <p className="text-muted-foreground mb-4">
            A carta controle solicitada não existe ou foi removida.
          </p>
          <Button onClick={() => router.push('/dashboard/cartas-controle')}>
            Voltar para listagem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/cartas-controle')}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detalhes da Carta Controle
            </h1>
            <p className="text-muted-foreground">
              Remessa: {cartaControle.remessa} • DT:{' '}
              {cartaControle.documentoTransporte}
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} className="cursor-pointer">
          Baixar PDF
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Dados principais da carta controle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Data de Identificação
              </label>
              <p className="text-sm font-medium">
                {dayjs(cartaControle.dataIdentificacao).format('DD/MM/YYYY')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Turno
              </label>
              <p className="text-sm font-medium">{cartaControle.turno}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Conferente/Técnico
              </label>
              <p className="text-sm font-medium">{cartaControle.conferente}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Documento de Transporte
              </label>
              <p className="text-sm font-medium">
                {cartaControle.documentoTransporte}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Remessa
              </label>
              <p className="text-sm font-medium">{cartaControle.remessa}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Doca
              </label>
              <p className="text-sm font-medium">{cartaControle.doca}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Capacidade do Veículo
              </label>
              <p className="text-sm font-medium">
                {cartaControle.capacidadeVeiculo}
              </p>
            </div>
            {cartaControle.users && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Usuário Responsável
                </label>
                <p className="text-sm font-medium">
                  {cartaControle.users.name}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Data de Criação
              </label>
              <p className="text-sm font-medium">
                {dayjs(cartaControle.created_at).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observations Card */}
      {cartaControle.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {cartaControle.observacoes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Evidence Cards */}
      {cartaControle.evidencias && cartaControle.evidencias.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Evidências</h2>
          {cartaControle.evidencias.map(
            (
              evidenciaGroup: {
                grupo: string;
                data: { url: string; tipo: string }[];
              },
              groupIndex: number,
            ) => (
              <Card key={groupIndex}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {evidenciaGroup.grupo?.replace(/_/g, ' ').toLowerCase()}
                  </CardTitle>
                  <CardDescription>
                    {evidenciaGroup.data?.length} imagem(ns)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {evidenciaGroup.data?.map(
                      (
                        evidencia: { url: string; tipo: string },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                          onClick={() => openImagePreview(evidencia.url)}
                        >
                          <Image
                            src={evidencia.url}
                            alt={`Evidência ${evidenciaGroup.grupo} ${
                              index + 1
                            }`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Visualização da Evidência</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>
          <div className="relative w-full h-[70vh] p-4">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Evidência ampliada"
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
