import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import {
  fetchProvinces,
  fetchDistricts,
  fetchDsDivisions,
  fetchGnDivisions,
  fetchDepartments,
  fetchStatutoryBoards,
  createComplaint,
} from '../api/client';

const categories = [
  { code: 'INFRASTRUCTURE', name: 'Infrastructure' },
  { code: 'UTILITIES', name: 'Utilities' },
  { code: 'HEALTHCARE', name: 'Healthcare' },
  { code: 'EDUCATION', name: 'Education' },
  { code: 'TRANSPORT', name: 'Transport' },
  { code: 'ENVIRONMENT', name: 'Environment' },
  { code: 'PUBLIC_SAFETY', name: 'Public Safety' },
  { code: 'ADMINISTRATION', name: 'Administration' },
  { code: 'OTHER', name: 'Other' },
];

const targetTypes = [
  { code: 'department', name: 'Government Department' },
  { code: 'statutory_board', name: 'Statutory Board' },
  { code: 'district', name: 'District/Local Authority' },
  { code: 'official', name: 'Specific Official' },
];

const fallbackGeo = {
  provinces: [
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Northern Province' },
  ],
  districtsByProvince: {
    '550e8400-e29b-41d4-a716-446655440004': [
      { id: '550e8400-e29b-41d4-a716-446655444001', name: 'Jaffna' },
    ],
  } as Record<string, Array<{ id: string; name: string }>>,
  dsDivisionsByDistrict: {
    '550e8400-e29b-41d4-a716-446655444001': [
      { id: '550e8400-e29b-41d4-a716-446655450030', name: 'Nallur' },
    ],
  } as Record<string, Array<{ id: string; name: string }>>,
  gnDivisionsByDsDivision: {
    '550e8400-e29b-41d4-a716-446655450030': [
      {
        id: '550e8400-e29b-41d4-a716-446655460523',
        name: 'Thirunelveli West',
        gnCode: 'GN',
      },
    ],
  } as Record<string, Array<{ id: string; name: string; gnCode: string }>>,
};

export default function SubmitComplaintScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form state
  const [categoryCode, setCategoryCode] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState('department');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');

  // Geographic state
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [dsDivisionId, setDsDivisionId] = useState('');
  const [gnDivisionId, setGnDivisionId] = useState('');

  // Data lists
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [dsDivisions, setDsDivisions] = useState<any[]>([]);
  const [gnDivisions, setGnDivisions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);

      try {
        const provincesData = await fetchProvinces();
        setProvinces(provincesData);
      } catch (geoError) {
        console.log('Failed to load provinces from API, using fallback geo data:', geoError);
        setProvinces(fallbackGeo.provinces);
      }
    } catch (error) {
      console.log('Failed to load initial data:', error);
      Alert.alert('Error', 'Failed to load initial data');
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (provinceId) {
      fetchDistricts(provinceId)
        .then(setDistricts)
        .catch((err) => {
          console.log('Failed to load districts, using fallback:', err);
          setDistricts(fallbackGeo.districtsByProvince[provinceId] ?? []);
        });
      setDistrictId('');
      setDsDivisionId('');
      setGnDivisionId('');
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      fetchDsDivisions(districtId)
        .then(setDsDivisions)
        .catch((err) => {
          console.log('Failed to load DS divisions, using fallback:', err);
          setDsDivisions(fallbackGeo.dsDivisionsByDistrict[districtId] ?? []);
        });
      setDsDivisionId('');
      setGnDivisionId('');
    }
  }, [districtId]);

  useEffect(() => {
    if (dsDivisionId) {
      fetchGnDivisions(dsDivisionId)
        .then(setGnDivisions)
        .catch((err) => {
          console.log('Failed to load GN divisions, using fallback:', err);
          setGnDivisions(fallbackGeo.gnDivisionsByDsDivision[dsDivisionId] ?? []);
        });
      setGnDivisionId('');
    }
  }, [dsDivisionId]);

  useEffect(() => {
    if (targetType === 'statutory_board' && selectedDepartmentId) {
      fetchStatutoryBoards(selectedDepartmentId).then(setBoards).catch(console.error);
    }
  }, [targetType, selectedDepartmentId]);

  async function handleSubmit() {
    if (!categoryCode || !description || !provinceId || !districtId || !dsDivisionId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (targetType === 'department' && !selectedDepartmentId) {
      Alert.alert('Error', 'Please select a department');
      return;
    }

    if (targetType === 'statutory_board' && !selectedBoardId) {
      Alert.alert('Error', 'Please select a statutory board');
      return;
    }

    setIsLoading(true);
    try {
      await createComplaint({
        categoryCode,
        descriptionText: description,
        targetType,
        selectedDepartmentId: targetType === 'department' ? selectedDepartmentId : undefined,
        selectedStatutoryBoardId: targetType === 'statutory_board' ? selectedBoardId : undefined,
        incidentProvinceId: provinceId,
        incidentDistrictId: districtId,
        incidentDsDivisionId: dsDivisionId,
        incidentGnDivisionId: gnDivisionId || undefined,
      });

      Alert.alert(
        'Success',
        'Your complaint has been submitted successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) }]
      );
    } catch (error: any) {
      Alert.alert('Error', error?.error || 'Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Submit Complaint</Text>
          <Text style={styles.subtitle}>Report an issue to the authorities</Text>

          {/* Category */}
          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryCode}
              onValueChange={(itemValue) => setCategoryCode(itemValue)}
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.code} label={cat.name} value={cat.code} />
              ))}
            </Picker>
          </View>

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your complaint in detail..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Target Type */}
          <Text style={styles.label}>Target Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={targetType}
              onValueChange={(itemValue) => {
                setTargetType(itemValue);
                setSelectedDepartmentId('');
                setSelectedBoardId('');
              }}
            >
              {targetTypes.map((type) => (
                <Picker.Item key={type.code} label={type.name} value={type.code} />
              ))}
            </Picker>
          </View>

          {/* Department Selection */}
          {(targetType === 'department' || targetType === 'statutory_board') && (
            <>
              <Text style={styles.label}>Department *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDepartmentId}
                  onValueChange={setSelectedDepartmentId}
                >
                  <Picker.Item label="Select a department" value="" />
                  {departments.map((dept) => (
                    <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Statutory Board Selection */}
          {targetType === 'statutory_board' && selectedDepartmentId && (
            <>
              <Text style={styles.label}>Statutory Board *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedBoardId}
                  onValueChange={setSelectedBoardId}
                >
                  <Picker.Item label="Select a board" value="" />
                  {boards.map((board) => (
                    <Picker.Item key={board.id} label={board.name} value={board.id} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Geographic Location */}
          <Text style={styles.sectionTitle}>Incident Location</Text>

          <Text style={styles.label}>Province *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={provinceId}
              onValueChange={setProvinceId}
            >
              <Picker.Item label="Select a province" value="" />
              {provinces.map((prov) => (
                <Picker.Item key={prov.id} label={prov.name} value={prov.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>District *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={districtId}
              onValueChange={setDistrictId}
            >
              <Picker.Item label={provinceId ? "Select a district" : "Select province first"} value="" />
              {districts.map((dist) => (
                <Picker.Item key={dist.id} label={dist.name} value={dist.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>DS Division *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={dsDivisionId}
              onValueChange={setDsDivisionId}
            >
              <Picker.Item label={districtId ? "Select a DS division" : "Select district first"} value="" />
              {dsDivisions.map((ds) => (
                <Picker.Item key={ds.id} label={ds.name} value={ds.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>GN Division</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gnDivisionId}
              onValueChange={setGnDivisionId}
            >
              <Picker.Item label={dsDivisionId ? "Select a GN division (optional)" : "Select DS division first"} value="" />
              {gnDivisions.map((gn) => (
                <Picker.Item key={gn.id} label={`${gn.name} (${gn.gnCode})`} value={gn.id} />
              ))}
            </Picker>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
