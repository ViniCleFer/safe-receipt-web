import React from 'react';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
// import { LaudoCrm } from '@/types/laudo-crm';

// Estilos no padrão ABNT
const styles = StyleSheet.create({
  page: {
    paddingTop: 40, // Margem superior de 2 cm (~56px)
    paddingBottom: 20, // Margem inferior de 2 cm (~56px)
    paddingLeft: 85, // Margem esquerda de 3 cm (~85px)
    paddingRight: 56, // Margem direita de 2 cm (~56px)
  },
  header: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Times-Roman',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.5, // Espaçamento 1.5 entre linhas
    marginBottom: 10,
  },
});

// Componente PDF que recebe props
const LaudoCrmDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Laudo CRM</Text>
    </Page>
  </Document>
);

export default LaudoCrmDocument;
