import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const ReceiptDetails = () => {
  const route = useRoute();
  const { projectId, projectTranId, projectName } = route.params;
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReceipts, setExpandedReceipts] = useState([]);

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        const response = await fetch(
          `https://www.vgn360.com/MobileApp_API/GetReceiptData?ProjectId=${projectId}&ProjecttranId=${projectTranId}`,
           {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setReceipts(data);
        } else {
          setError('No receipt details found');
        }
      } catch (error) {
        console.error('Error fetching receipt details:', error);
        setError('Failed to load receipt details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [projectId, projectTranId]);

  const toggleReceipt = (sno) => {
    if (expandedReceipts.includes(sno)) {
      setExpandedReceipts(expandedReceipts.filter(id => id !== sno));
    } else {
      setExpandedReceipts([...expandedReceipts, sno]);
    }
  };

  const formatDate = (dateString) => {
    try {
      const timestamp = parseInt(dateString.match(/\d+/)[0], 10);
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#b4151a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (receipts.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No receipt records found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Receipt Details</Text>
      <Text style={styles.subtitle}>{projectName}</Text>

      {receipts.map((receipt) => (
        <View key={receipt.Sno} style={styles.receiptContainer}>
          <TouchableOpacity 
            style={styles.receiptHeader}
            onPress={() => toggleReceipt(receipt.Sno)}
            activeOpacity={0.9}
          >
            <View style={styles.headerContent}>
              <Text style={styles.receiptTitle}>📄 Receipt #{receipt.Sno}</Text>
              <Text style={styles.receiptAmount}>₹{parseInt(receipt.Amount || 0).toLocaleString()}</Text>
            </View>
            <Text style={styles.expandIcon}>
              {expandedReceipts.includes(receipt.Sno) ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expandedReceipts.includes(receipt.Sno) && (
            <View style={styles.receiptBody}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{receipt.RecDate || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Stage:</Text>
                <Text style={styles.value}>{receipt.Stage || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Payment Mode:</Text>
                <Text style={styles.value}>{receipt.ModeofCash || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Reference No:</Text>
                <Text style={styles.value}>{receipt.RefNo || 'N/A'}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b4151a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  receiptContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  receiptAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b4151a',
    marginLeft: 10,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  receiptBody: {
    padding: 15,
    backgroundColor: '#fff',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: '#b4151a',
    textAlign: 'center',
    padding: 20,
  },
});

export default ReceiptDetails;