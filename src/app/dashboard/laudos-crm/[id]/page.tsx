'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, X } from 'lucide-react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { pdf } from '@react-pdf/renderer';
import { getLaudosCrmByIdRequest } from '../actions';
import { listaUPsOrigem, listaCDsOrigem } from '@/utils/listaUPs';
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
import LaudoCrmDocument from '@/components/pdf-laudo-crm';
import { LaudoCrm } from '@/types/laudo-crm';

export default function LaudoCrmDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const laudoCrmId = params.id as string;

  const [laudoCrm, setLaudoCrm] = useState<LaudoCrm | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (laudoCrmId) {
      getLaudosCrmByIdRequest(laudoCrmId)
        .then(response => {
          console.log('response getLaudosCrmByIdRequest', response);

          if (response?.status === 200 && response?.data?.length > 0) {
            const data = response?.data[0];
            setLaudoCrm(data);
          }
        })
        .catch(err => console.error('Page Error Get laudo', err))
        .finally(() => setLoading(false));
    }
  }, [laudoCrmId]);

  // Function to open image preview
  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleDownload = async () => {
    if (!laudoCrm) return;

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

  const onBack = () => {
    router.push('/dashboard/laudos-crm');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!laudoCrm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Laudo não encontrado
          </h2>
          <Button variant="outline" onClick={onBack} className="cursor-pointer">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

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

      <Card key={laudoCrm?.id} className="overflow-hidden pt-0">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/5 py-3">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-bold">
              ID: {laudoCrm?.id}
            </CardTitle>
            <CardDescription>
              Data: {dayjs(laudoCrm?.dataIdentificacao).format('DD/MM/YYYY')}
            </CardDescription>
          </div>
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
                <p>{laudoCrm?.notaFiscal}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Transportador
                </p>
                <p>{laudoCrm?.transportador}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Remessa</p>
                <p>{laudoCrm?.remessa}</p>
              </div>
            </div>
            <div className="flex w-[50%] flex-col gap-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Conferente</p>
                <p>{laudoCrm?.conferente}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">UP Origem</p>
                <p>
                  {
                    listaUPsOrigem?.find(up => up?.value === laudoCrm?.upOrigem)
                      ?.label
                  }
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">CD Origem</p>
                <p>
                  {
                    listaCDsOrigem?.find(up => up?.value === laudoCrm?.cdOrigem)
                      ?.label
                  }
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-muted-foreground mb-1">
              Observações
            </p>
            <p className="text-sm">{laudoCrm?.observacoes}</p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground mb-2">
              Evidências ({laudoCrm?.evidencias?.length || 0})
            </p>
            <div className="flex flex-wrap gap-2">
              {laudoCrm &&
                laudoCrm?.evidencias?.length > 0 &&
                laudoCrm?.evidencias?.map((img: string, index: number) => (
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
