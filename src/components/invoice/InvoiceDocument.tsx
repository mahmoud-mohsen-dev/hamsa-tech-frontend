// 'use client';

import { OrderInfoType } from '@/types/orderResponseTypes';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';
import { normalize } from '@/utils/helpers';
import { formatEnglishNumbers } from '@/utils/numbersFormating';
// import { reverseArabicWords } from '@/utils/stringHelpers';
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Svg,
  Path,
  Font
} from '@react-pdf/renderer';

// Register the Cairo font
Font.register({
  family: 'Cairo',
  fonts: [
    {
      src: '/fonts/cairo/Cairo-Regular.ttf',
      fontWeight: 400
    },
    {
      src: '/fonts/cairo/Cairo-Bold.ttf',
      fontWeight: 700
    }
  ]
});

// Create styles

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Cairo'
  },
  container: {
    padding: 15
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
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
    marginBottom: 2,
    fontSize: 12
  },
  logoBlue: {
    color: '#17457c'
  },
  logoRed: {
    color: '#D7150E'
  },
  date: {
    fontSize: 12,
    color: '#374151'
    // fontSize: 14,
    // color: '#374151'
  },
  companAddressText: {
    fontSize: 10,
    color: '#374151'
  },
  section: {
    marginBottom: 2
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
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
    fontSize: 10
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
    fontWeight: 'bold',
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
    marginBottom: 2
  },

  finalTotal: { fontSize: 12 },
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
export function InvoiceDocument({
  orderData,
  locale
}: {
  orderData: OrderInfoType;
  locale: string;
}) {
  // console.log('orderData at InvoiceDocument component', orderData);
  const billTo =
    orderData?.attributes?.shipping_address?.data?.attributes ?? null;
  console.log(billTo);
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                Invoice #{orderData?.id ?? ''}
              </Text>
              <Text
                style={[styles.blackBold, styles.bold, styles.date]}
              >
                Date:{' '}
                {convertIsoStringToDateFormat(
                  orderData?.attributes?.createdAt ??
                    new Date().toISOString()
                )}
              </Text>
            </View>
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

          {/* Bill To Section */}
          <View style={styles.section}>
            <Text style={styles.billToTitle}>Bill to</Text>
            <Text style={styles.billToAddress}>
              {`${billTo?.first_name ?? ''} ${billTo?.last_name ?? ''}`}
            </Text>
            <Text style={styles.billToAddress}>
              {`${
                billTo?.address_1 ? `${billTo?.address_1}` : ''
              } ${billTo?.address_2 ? ` - ${billTo?.address_2}` : ''}`}
            </Text>
            <Text style={styles.billToAddress}>
              {`Building: ${typeof billTo?.building === 'string' && billTo?.building !== 'undefined' ? `${billTo.building}` : 'N/A'} - Floor: ${typeof billTo?.floor === 'string' && billTo?.floor !== 'undefined' ? `${billTo?.floor}` : 'N/A'} - Apartment: ${
                (
                  typeof billTo?.apartment === 'number' &&
                  billTo?.apartment !== 0
                ) ?
                  `${billTo?.apartment}`
                : 'N/A'
              }`}
            </Text>
            <Text style={styles.billToAddress}>
              {`${billTo?.city ? `${billTo.city}` : ''} ${
                locale === 'ar' ?
                  billTo?.delivery_zone?.zone_name_in_arabic ?
                    ` - ${billTo.delivery_zone.zone_name_in_arabic}`
                  : ''
                : billTo?.delivery_zone?.zone_name_in_english ?
                  ` - ${billTo.delivery_zone.zone_name_in_english}`
                : ''
              } ${billTo?.zip_code ? ` - ${billTo?.zip_code}` : ''}`}
            </Text>
            <Text style={styles.billToAddress}>
              {billTo?.delivery_phone ?? ''}
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

            {orderData?.attributes.cart.map((item) => {
              return (
                <View
                  style={styles.tableRow}
                  key={item.product.data.id}
                >
                  <Text
                    style={[styles.tableCell, styles.flexBasis40]}
                  >
                    {normalize(
                      item?.product?.data?.attributes?.name ?? ''
                    )}
                  </Text>
                  <Text
                    style={[styles.tableCell, styles.flexBasis20]}
                  >
                    {formatEnglishNumbers(
                      item?.product?.data?.attributes
                        ?.final_product_price ?? 0
                    )}
                  </Text>
                  <Text
                    style={[styles.tableCell, styles.flexBasis20]}
                  >
                    {item?.quantity ?? 1}
                  </Text>
                  <Text
                    style={[styles.tableCell, styles.flexBasis20]}
                  >
                    {formatEnglishNumbers(item?.total_cost ?? 0)}
                  </Text>
                </View>
              );
            })}

            <View style={[styles.totalTableRow, styles.blackBold]}>
              <Text style={[styles.tableCell, styles.flexBasis40]}>
                Subtotal
              </Text>
              <Text
                style={[styles.tableCell, styles.flexBasis20]}
              ></Text>
              <Text
                style={[styles.tableCell, styles.flexBasis20]}
              ></Text>
              <Text style={[styles.tableCell, styles.flexBasis20]}>
                {formatEnglishNumbers(
                  orderData?.attributes?.subtotal_cart_cost ?? 0
                )}
              </Text>
            </View>
          </View>

          {/* Totals Section */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>
                {formatEnglishNumbers(
                  orderData?.attributes?.subtotal_cart_cost ?? 0
                )}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Discount</Text>
              <Text>
                {formatEnglishNumbers(
                  orderData?.attributes?.coupon_applied_value ?? 0
                )}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Shipping</Text>
              <Text>
                {formatEnglishNumbers(
                  orderData?.attributes?.delivery_cost ?? 0
                )}
              </Text>
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
              <Text>
                {formatEnglishNumbers(
                  orderData?.attributes?.total_order_cost ?? 0
                )}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// export default InvoiceDocument;
