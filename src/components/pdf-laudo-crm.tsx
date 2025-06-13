/* eslint-disable jsx-a11y/alt-text */
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

import { LaudoCrm } from '@/types/laudo-crm';

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
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: '48%',
    height: 200,
  },
});

const LaudoCrmDocument = ({ data }: { data: LaudoCrm }) => (
  <Document>
    <Page size="A4" style={styles.page}>
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
            <Text style={styles.subtitle}>
              LAUDO DE RECEBIMENTO - TRANSFERÊNCIA EXTERNA
            </Text>
          </View>
        </View>
      </View>

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
            <Text style={[styles.text]}>{data?.notaFiscal}</Text>
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
              Transportador:
            </Text>
            <Text style={[styles.row, styles.text]}>{data?.transportador}</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableRow}>
              <Text style={[styles.row, styles.tableHeader, styles.text]}>
                Placa:
              </Text>
              <Text style={[styles.row, styles.text]}>{data?.placa}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <View style={styles.tableRow}>
              <Text style={[styles.row, styles.tableHeader, styles.text]}>
                Conferente:
              </Text>
              <Text style={[styles.row, styles.text]}>{data?.conferente}</Text>
            </View>
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
            <View style={styles.tableRow}>
              <Text style={[styles.row, styles.tableHeader, styles.text]}>
                UP Origem:
              </Text>
              <Text style={[styles.row, styles.text]}>{data?.upOrigem}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.text]}>CD Origem:</Text>
              <Text style={[styles.text]}>{data?.cdOrigem}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableRow}>
            <Text style={[styles.row, styles.tableHeader, styles.text]}>
              Tipos de Não Conformidade:
            </Text>
            <Text style={[styles.row, styles.text]}>
              {data?.tiposNaoConformidade}
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

      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.tableHeader, { fontSize: 16 }]}>
          Evidências
        </Text>
      </View>
      <View style={styles.imageContainer}>
        {data?.evidencias &&
          data?.evidencias?.map((imgUrl: string, index: number) => (
            <Image key={index} src={imgUrl} style={styles.image} />
          ))}
      </View>
    </Page>
  </Document>
);

export default LaudoCrmDocument;
