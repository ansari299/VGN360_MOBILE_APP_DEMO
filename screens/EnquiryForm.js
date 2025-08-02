import React, { useState } from 'react';
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

const EnquiryForm = () => {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const mobile = authData.mobile;
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: mobile || '',
    email: '',
    projectName: '',
    projectId: 0,
    location: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    projectName: '',
    location: ''
  });

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validateForm = () => {
    const nameError = !formData.name.trim() ? 'Name is required' : '';
    const phoneError = validatePhone(formData.phone);
    const projectError = formData.projectId === 0 ? 'Please select a project' : '';
    const locationError = !formData.location ? 'Please select a location' : '';
    
    setErrors({
      name: nameError,
      phone: phoneError,
      projectName: projectError,
      location: locationError
    });

    return !nameError && !phoneError && !projectError && !locationError;
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
      
      const apiUrl = `https://vgn360.com/api/Values?CustomerName=${encodeURIComponent(formData.name)}&MobileNumber=${encodeURIComponent(formData.phone)}&CountryCode=+91&Email=${encodeURIComponent(formData.email)}&Location=${encodeURIComponent(formData.location)}&ProjectName=${encodeURIComponent(formData.projectName)}&AgentName=VGN_360_MOBILE_APP&Remarks=''`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status) {
        Alert.alert('Success', 'Thanks! Our team will contact you shortly.', [{
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard')
        }]);
      } else {
        Alert.alert('Error', data.msg || 'Failed to submit enquiry');
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
          <Text style={styles.header}>Enquiry Form</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput
              style={[styles.input, errors.name && styles.errorInput]}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({...formData, name: text});
                setErrors({...errors, name: ''});
              }}
              onBlur={() => {
                setErrors({...errors, name: !formData.name.trim() ? 'Name is required' : ''});
              }}
              returnKeyType="next"
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone <Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.errorInput]}
              placeholder="Phone number"
              value={formData.phone}
              onChangeText={(text) => {
                setFormData({...formData, phone: text});
                setErrors({...errors, phone: ''});
              }}
              keyboardType="phone-pad"
              maxLength={10}
              onBlur={() => {
                setErrors({...errors, phone: validatePhone(formData.phone)});
              }}
              returnKeyType="next"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Project Name <Text style={{ color: 'red' }}>*</Text>:</Text>
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
              Interested Location <Text style={{ color: 'red' }}>*</Text>:
            </Text>
            <TextInput
              style={[styles.input, errors.location && styles.errorInput]}
              placeholder="Enter Location"
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
              <Text style={styles.submitButtonText}>SUBMIT</Text>
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
    marginBottom: 30,
    textAlign: 'center',
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

export default EnquiryForm;