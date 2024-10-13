// 'use client';

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Svg,
  Path
} from '@react-pdf/renderer';

// Create styles

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff'
  },
  container: {
    padding: 15
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 14
  },
  companyLogoText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    textTransform: 'uppercase',
    gap: 4,
    marginBottom: 5,
    fontSize: 12
  },
  logoBlue: {
    color: '#17457c'
  },
  logoRed: {
    color: '#D7150E'
  },
  companyDetails: {
    textAlign: 'right'
    // fontSize: 14,
    // color: '#374151'
  },
  companAddressText: {
    fontSize: 10,
    color: '#374151'
  },
  section: {
    marginBottom: 10
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2937'
  },
  billToAddress: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 2
  },
  table: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row'
  },
  tableRow: {
    flexDirection: 'row',
    color: '#4B5563'
  },
  tableCell: {
    padding: 8,
    fontSize: 12
  },
  flexBasis20: {
    flexBasis: '20%'
  },
  flexBasis40: {
    flexBasis: '40%'
  },
  totalTableRow: {
    // borderTop: '1px solid #E5E7EB',
    borderTopColor: '#e7eaee',

    borderTopStyle: 'solid',
    borderTopWidth: 1,
    fontWeight: 800,
    flexDirection: 'row'
  },
  totals: {
    flexDirection: 'column',
    width: '40%',
    marginLeft: 'auto'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#1F2937',
    marginBottom: 6
  },

  finalTotal: { fontSize: 14, marginTop: 2 },
  bold: {
    fontWeight: 'bold'
  },
  blackBold: {
    color: '#1F2937'
  },
  blue: {
    color: '#0669ff'
  }
});

// Create Invoice component for PDF
function InvoiceDocument() {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Invoice #0472</Text>
            <Svg
              width='45'
              height='45'
              viewBox='0 0 103 100'
              fill='none'
              style={styles.logo}
            >
              <Path
                d='M18.8945 1.76886C15.6985 4.62313 12.4623 8.36183 9.90955 12.1407C4.94472 19.5377 1.84925 27.6784 0.482412 36.8844C-0.160804 41.1658 -0.160804 49.206 0.482412 53.407C2.13065 64.3216 6.25126 74.0101 12.7035 82.0101C15.9799 86.0905 20.9849 90.6734 25.2462 93.5075L26.3518 94.2513L26.4121 77.4673L26.4523 60.7035H33.6884H40.9246L40.9648 80.0402L41.0251 99.397L42.4322 99.6784C43.4975 99.9196 45.4673 99.9799 50.5729 100C56.8241 100 57.4673 99.9598 59.7186 99.5377C61.9497 99.0955 65.6683 98.0905 67.5578 97.4271L68.3618 97.1457L68.4221 61.3266L68.4623 25.5277H54.6935H40.9246V31.4573V37.3869H33.6884H26.4523V18.6935V1.96043e-05H23.6784H20.9045L18.8945 1.76886Z'
                fill='#17457C'
              />
              <Path
                d='M31.9201 9.48742L31.9804 18.995L53.8497 19.0553L75.699 19.0955V56.5829C75.699 77.206 75.7593 94.0703 75.8196 94.0703C76.1613 94.0703 79.5784 91.598 81.8095 89.7286C93.709 79.799 101.106 64.7437 102.011 48.603C102.634 37.5678 100.322 26.8744 95.2567 17.2864C93.8497 14.613 90.8145 10.0502 88.9653 7.83918C87.2568 5.80903 83.9 2.35175 82.2718 0.984912L81.106 -1.20997e-05H56.4829H31.8799L31.9201 9.48742Z'
                fill='#D7150E'
              />
            </Svg>
          </View>

          {/* Company Details */}
          <View style={[styles.companyLogoText]}>
            <Text style={[styles.logoBlue, styles.bold]}>Hamsa</Text>
            <Text style={[styles.logoRed, styles.bold]}>Tech</Text>
          </View>
          {/* <View
            style={[styles.companyDetails, styles.companAddressText]}
          >
            <Text>291 N 4th St, San Jose, CA 95112, USA</Text>
            <Text>August 1, 2021</Text>
          </View> */}

          {/* Bill To Section */}
          <View style={styles.section}>
            <Text style={styles.billToTitle}>Bill to</Text>
            <Text style={styles.billToAddress}>
              Themesberg Inc., LOUISVILLE, Selby 3864 Johnson Street,
              United States of America
            </Text>
            <Text style={styles.billToAddress}>
              VAT Code: AA-1234567890
            </Text>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.flexBasis40]}>
                Item
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                Price
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                Quantity
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                Total
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.flexBasis40]}>
                Product A
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                $50.00
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                2
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                $100.00
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.flexBasis40]}>
                Product B
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                $30.00
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                1
              </Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                $30.00
              </Text>
            </View>

            <View style={[styles.totalTableRow, styles.blackBold]}>
              <Text style={[styles.tableCell, styles.flexBasis40]}>
                Total
              </Text>
              <Text
                style={[styles.tableCell, styles.flexBasis20]}
              ></Text>
              <Text
                style={[styles.tableCell, styles.flexBasis20]}
              ></Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                $130.00
              </Text>
            </View>
          </View>

          {/* Totals Section */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>$415.00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Discount</Text>
              <Text>$64.00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Shipping</Text>
              <Text>$35.00</Text>
            </View>
            <View
              style={[
                styles.totalRow,
                styles.bold,
                styles.blue,
                styles.finalTotal
              ]}
            >
              <Text>Total</Text>
              <Text>$351.00</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
