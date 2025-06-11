/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { CartaControle } from '@/types/carta-controle';
import { getTipoEvidencia } from '@/utils/get-tipo-evidencia';

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 65,
    paddingRight: 46,
    // fontFamily: 'Times Roman',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: -10,
    left: 0,
    // backgroundColor: 'red',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    textAlign: 'left',
  },
  table: {
    flexDirection: 'column',
    border: '1 solid black',
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: '12px',
    paddingVertical: '8px',
    gap: '5px',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    gap: '5px',
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 5,
    textAlign: 'left',
  },
  imageSection: {
    // marginBottom: 40,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    // width: 200,
    // marginTop: 10,
    width: '48%',
    height: 200,
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },
});

// Componente do PDF
const CartaControleDocument = ({ data }: { data: CartaControle }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo */}
      {/* <Image src={`data:image/svg+xml;utf8,${LogoYpe}`} style={styles.logo} /> */}

      <View style={[styles.header, { marginBottom: 5 }]}>
        <Image
          src={
            'https://ocpggxfbtsykepvdatwz.supabase.co/storage/v1/object/public/assets//logo-ype.png'
          }
          style={styles.logo}
        />
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.row}>
            <Text style={styles.title}>QUÍMICA AMPARO - YPÊ</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>CARTA CONTROLE - DEVOLUÇÃO</Text>
          </View>
        </View>
      </View>
      {/* ID no título */}
      {/* <View style={[styles.row, { marginBottom: 20 }]}>
        <Text style={styles.title}>ID:</Text>
        <Text style={styles.text}>{data?.id}</Text>
      </View> */}
      {/* <View style={[styles.row, { marginBottom: 20 }]}>
        <Text style={styles.title}>Colaborador:</Text>
        <Text style={[styles.text, { marginLeft: 10 }]}>
          {data?.users?.name}
        </Text>
      </View> */}

      {/* Tabela de dados */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.text]}>Remessa:</Text>
            <Text style={[styles.text]}>{data?.remessa}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.text]}>Data:</Text>
            <Text style={[styles.text]}>
              {dayjs(data?.dataIdentificacao).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.text]}>
              DT / Nota Fiscal:
            </Text>
            <Text style={[styles.text]}>{data?.documentoTransporte}</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.text]}>Turno:</Text>
              <Text style={[styles.text]}>{data?.turno}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <Text style={[styles.row, styles.tableHeader, styles.text]}>
              Doca:
            </Text>
            <Text style={[styles.row, styles.text]}>{data?.doca}</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableRow}>
              <Text style={[styles.row, styles.tableHeader, styles.text]}>
                Conferente:
              </Text>
              <Text style={[styles.row, styles.text]}>{data?.conferente}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <Text style={[styles.row, styles.tableHeader, styles.text]}>
              Qtd Pallets:
            </Text>
            <Text style={[styles.row, styles.text]}>
              {data?.capacidadeVeiculo}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <Text style={[styles.row, styles.tableHeader, styles.text]}>
              Observações:
            </Text>
            <Text style={[styles.row, styles.text]}>{data?.observacoes}</Text>
          </View>
        </View>
      </View>

      {data?.evidencias &&
        data?.evidencias?.map((img: any, index: number) => (
          <View key={index} style={styles.imageSection} break={index > 0}>
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.tableHeader, { fontSize: 16 }]}
              >
                {`${index + 1} - ${getTipoEvidencia(img?.grupo)}`}
              </Text>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                {dayjs(data?.dataIdentificacao).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              {img?.data?.map((item: any, indexItem: number) => (
                <Image key={indexItem} src={item?.url} style={styles.image} />
              ))}
            </View>
          </View>
        ))}
    </Page>
  </Document>
);

export default CartaControleDocument;
