import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const BookedHistory = () => {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const mobile = authData.mobile;
  const [searchText, setSearchText] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `https://www.vgn360.com/MobileApp_API/GetProjectDetails?MobileNo=${mobile}`,
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
          // Transform API data to match our structure
          const formattedProjects = data.map((item, index) => ({
            id: index + 1,
            name: item.ProjectName,
            site: item.Projectsite,
            nos: item.UnitNo,
            ProjectId: item.ProjectId,
            ProjectPlotidTranid: item.ProjectPlotidTranid,
            fullData: item // Keep all original data for details page
          }));
          setProjects(formattedProjects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (mobile) {
      fetchProjects();
    }
  }, [mobile]);

  // Filter projects based on search text
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchText.toLowerCase()) ||
    project.nos.toLowerCase().includes(searchText.toLowerCase()) ||
    (project.site && project.site.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleProjectPress = (project) => {
    navigation.navigate('ProjectDetails', { 
      projectId: project.ProjectId,
      projectTranId: project.ProjectPlotidTranid,
      projectName: project.name,
      projectSite: project.site,
      unitNo: project.nos
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Booked Projects</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../assets/search-icon.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects or sites..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {/* Projects List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <TouchableOpacity 
              key={project.id} 
              style={styles.card}
              onPress={() => handleProjectPress(project)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.projectName}>{project.name || 'N/A'}</Text>
                <Text style={styles.projectSite}>Site: {project.site || 'N/A'}</Text>
                <Text style={styles.projectNos}>Unit No: {project.nos || 'N/A'}</Text>
              </View>
              <Image
                source={require('../assets/arrow-right.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noProjectsContainer}>
            <Text style={styles.noProjectsText}>No projects found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#b4151a',
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#333',
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  projectSite: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  projectNos: {
    fontSize: 14,
    color: '#666',
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  noProjectsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noProjectsText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#b4151a',
    textAlign: 'center',
    padding: 20,
  },
});

export default BookedHistory;