/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import LogoYpe from '@/assets/logo-ype.svg';
import { getTipoEvidencia } from '@/utils/get-tipo-evidencia';

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 65,
    paddingRight: 46,
    // fontFamily: 'Times Roman',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    gap: 5,
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
    fontSize: 12,
    textAlign: 'left',
  },
  table: {
    border: '1 solid black',
    marginBottom: 20,
    borderBottomWidth: 0,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    padding: 5,
    textAlign: 'left',
  },
  imageSection: {
    marginBottom: 40,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
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

      <View style={[styles.section, { marginBottom: 5 }]}>
        <Text style={styles.title}>Carta Controle - Ypê Salto</Text>
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
          <Text style={[styles.tableCell, styles.tableHeader]}>Data</Text>
          <Text style={styles.tableCell}>
            {dayjs(data?.dataIdentificacao).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>

        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Remessa</Text>
          <Text style={styles.tableCell}>{data?.remessa}</Text>
        </View>
        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            DT / Nota Fiscal
          </Text>
          <Text style={styles.tableCell}>{data?.documentoTransporte}</Text>
        </View>
        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Turno</Text>
          <Text style={styles.tableCell}>{data?.turno}</Text>
        </View>
        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Doca</Text>
          <Text style={styles.tableCell}>{data?.doca}</Text>
        </View>
        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Conferente</Text>
          <Text style={styles.tableCell}>{data?.conferente}</Text>
        </View>
        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            Capacidade Veículo
          </Text>
          <Text style={styles.tableCell}>{data?.capacidadeVeiculo}</Text>
        </View>
        <View style={[styles.tableRow]}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Observação</Text>
          <Text style={styles.tableCell}>{data?.observacoes}</Text>
        </View>
      </View>

      {/* <View style={[styles.section, { marginBottom: 10, marginTop: 10 }]}>
        <Text style={styles.title}>Evidências</Text>
      </View> */}
      {/* Seção de Imagens */}
      {data?.evidencias &&
        data?.evidencias?.map((img: any, index: number) => (
          <View key={index} style={styles.imageSection} break>
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.tableHeader, { fontSize: 16 }]}
              >
                {getTipoEvidencia(img?.grupo)}
              </Text>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                {dayjs(data?.dataIdentificacao).format('YYYY-MM-DD HH:mm:ss')}
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
