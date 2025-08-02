import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ProjectDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { projectId, projectTranId, projectName, projectSite, unitNo } = route.params;
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasReceipts, setHasReceipts] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `https://www.vgn360.com/MobileApp_API/GetProjectBookedHistory?ProjectId=${projectId}&ProjecttranId=${projectTranId}`,
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
          setProjectDetails(data[0]);
          if (data[0].RecAmount && data[0].RecAmount > 0) {
            setHasReceipts(true);
          }
        } else {
          setError('No details found for this project');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to load project details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, projectTranId]);

  const handleViewReceipt = () => {
    navigation.navigate('ReceiptDetails', {
      projectId,
      projectTranId,
      projectName
    });
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

  if (!projectDetails) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No records found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{projectName || 'N/A'}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Site:</Text>
        <Text style={styles.value}>{projectSite || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Unit No:</Text>
        <Text style={styles.value}>{unitNo || 'N/A'}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{projectDetails.Status || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Booked Date:</Text>
        <Text style={styles.value}>{projectDetails.BookedDate || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Registration Date:</Text>
        <Text style={styles.value}>{projectDetails.RegDate || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{projectDetails.CustomerName || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Mobile No:</Text>
        <Text style={styles.value}>{projectDetails.MobileNo || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{projectDetails.Address || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Total Cost:</Text>
        <Text style={styles.value}>
          {projectDetails.Totalcost ? `₹${projectDetails.Totalcost.toLocaleString()}` : 'N/A'}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Received Amount:</Text>
        <Text style={styles.value}>
          {projectDetails.RecAmount ? `₹${projectDetails.RecAmount.toLocaleString()}` : 'N/A'}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Balance:</Text>
        <Text style={styles.value}>
          {projectDetails.Balance ? `₹${projectDetails.Balance.toLocaleString()}` : 'N/A'}
        </Text>
      </View>

      {hasReceipts && (
        <TouchableOpacity style={styles.receiptButton} onPress={handleViewReceipt}>
          <Text style={styles.receiptButtonText}>📄 View Receipt Details</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 150,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: '#b4151a',
    textAlign: 'center',
    padding: 20,
  },
  receiptButton: {
    backgroundColor: '#b4151a',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  receiptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectDetails;