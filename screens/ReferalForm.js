import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const projects = [
  { id: 0, name: 'Select Project' },
  { id: 1, name: 'VGN Aspire Gardens' },
  { id: 2, name: 'VGN Heritage Springz' },
  { id: 3, name: 'VGN Highland' },
  { id: 4, name: 'VGN Pride De Villa' },
  { id: 5, name: 'VGN Grandeur' },
  { id: 6, name: 'VGN Paradise' },
  { id: 7, name: 'Others' }
];

const ReferralForm = () => {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const mobile = authData.mobile;
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [referrerData, setReferrerData] = useState(null);

  const [formData, setFormData] = useState({
    referralName: '',
    referralPhone: '',
    referralEmail: '',
    projectName: '',
    projectId: 0,
    location: ''
  });

  const [errors, setErrors] = useState({
    referralPhone: '',
    referralName: '',
    projectName: '',
    location: ''
  });

  useEffect(() => {
    const fetchReferrerData = async () => {
      try {
        const response = await fetch(
          `https://www.vgn360.com/MobileApp_API/GetCustomerName?MobileNo=${mobile}`,
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
          setReferrerData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching referrer data:', error);
      }
    };

    if (mobile) {
      fetchReferrerData();
    }
  }, [mobile]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validateForm = () => {
    const phoneError = validatePhone(formData.referralPhone);
    const nameError = !formData.referralName ? 'Referral name is required' : '';
    const projectError = formData.projectId === 0 ? 'Please select a project' : '';
    const locationError = !formData.location ? 'Please select a location' : '';
    
    setErrors({
      referralPhone: phoneError,
      referralName: nameError,
      projectName: projectError,
      location: locationError
    });

    return !phoneError && !projectError && !locationError && !nameError;
  };

  const handleProjectSelect = (project) => {
    setFormData({
      ...formData,
      projectName: project.name,
      projectId: project.id
    });
    setErrors({ ...errors, projectName: '' });
    setShowProjectDropdown(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const apiUrl = `https://vgn360.com/api/Values?CustomerName=${encodeURIComponent(formData.referralName)}&MobileNumber=${encodeURIComponent(formData.referralPhone)}&CountryCode=+91&Email=${encodeURIComponent(formData.referralEmail)}&Location=${encodeURIComponent(formData.location)}&ProjectName=${encodeURIComponent(formData.projectName)}&AgentName=VGN_360_MOBILE_APP&ReferralName=${referrerData.CustomerName}&ReferrallMobileNo=${referrerData.MobileNo}&Remarks=''`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status) {
        Alert.alert('Success', 'Thank you for the referral. Our team will reach out accordingly.', [{
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard')
        }]);
      } else {
        Alert.alert('Error', data.msg || 'Failed to submit referral');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
        >
          <Text style={styles.header}>Referral Form</Text>
          
          {referrerData && (
            <View style={styles.referrerContainer}>
              <Text style={styles.referrerLabel}>Your Details (Referrer):</Text>
              <Text style={styles.referrerName}>{referrerData.CustomerName}</Text>
              <Text style={styles.referrerPhone}>{referrerData.MobileNo}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Referral Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput
              style={[styles.input, errors.referralName && styles.errorInput]}
              placeholder="Enter referral's name"
              value={formData.referralName}
              onChangeText={(text) => {
                setFormData({...formData, referralName: text});
                setErrors({...errors, referralName: ''});
              }}
              returnKeyType="next"
            />
            {errors.referralName ? <Text style={styles.errorText}>{errors.referralName}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone <Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput
              style={[styles.input, errors.referralPhone && styles.errorInput]}
              placeholder="Enter referral's phone number"
              value={formData.referralPhone}
              onChangeText={(text) => {
                setFormData({...formData, referralPhone: text});
                setErrors({...errors, referralPhone: ''});
              }}
              keyboardType="phone-pad"
              maxLength={10}
              onBlur={() => {
                setErrors({...errors, referralPhone: validatePhone(formData.referralPhone)});
              }}
              returnKeyType="next"
            />
            {errors.referralPhone ? <Text style={styles.errorText}>{errors.referralPhone}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter referral's email"
              keyboardType="email-address"
              value={formData.referralEmail}
              onChangeText={(text) => setFormData({...formData, referralEmail: text})}
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Preferred Project <Text style={{ color: 'red' }}>*</Text>:</Text>
            <TouchableOpacity
              style={[styles.input, styles.projectInput, errors.projectName && styles.errorInput]}
              onPress={() => setShowProjectDropdown(true)}
            >
              <Text style={formData.projectId === 0 ? styles.placeholderText : {}}>
                {formData.projectName || 'Select Project'}
              </Text>
            </TouchableOpacity>
            {errors.projectName ? <Text style={styles.errorText}>{errors.projectName}</Text> : null}
            
            <Modal
              visible={showProjectDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowProjectDropdown(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowProjectDropdown(false)}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>
              
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.dropdownScroll}>
                  {projects.map((project) => (
                    <TouchableOpacity
                      key={project.id}
                      style={styles.dropdownItem}
                      onPress={() => handleProjectSelect(project)}
                    >
                      <Text style={project.id === 0 ? styles.placeholderText : {}}>
                        {project.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Preferred Location <Text style={{ color: 'red' }}>*</Text>:
            </Text>
            <TextInput
              style={[styles.input, errors.location && styles.errorInput]}
              placeholder="Enter referral's preferred location"
              value={formData.location}
              onChangeText={(text) => {
                setFormData({...formData, location: text});
                setErrors({...errors, location: ''});
              }}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.disabledButton]} 
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>SUBMIT REFERRAL</Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  dismissArea: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b4151a',
    marginBottom: 20,
    textAlign: 'center',
  },
  referrerContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  referrerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  referrerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  referrerPhone: {
    fontSize: 15,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  projectInput: {
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#b4151a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    maxHeight: 300,
    marginHorizontal: 20,
    marginTop: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default ReferralForm;