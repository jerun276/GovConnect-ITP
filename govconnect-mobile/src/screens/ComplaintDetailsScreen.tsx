import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchComplaintDetails,
  fetchComplaintTimeline,
  fetchProvinces,
  fetchDistricts,
  fetchDsDivisions,
  fetchGnDivisions,
} from '../api/client';

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  SUBMITTED: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  UNDER_REVIEW: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  ASSIGNED: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
  ACTION_TAKEN: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  RESOLVED: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  CLOSED: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function ComplaintDetailsScreen({ route, navigation }: any) {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplaintDetails();
  }, [complaintId]);

  async function loadComplaintDetails() {
    try {
      const data = await fetchComplaintDetails(complaintId);
      let timelineItems: any[] = [];

      try {
        const timelineRes = await fetchComplaintTimeline(complaintId);
        timelineItems = Array.isArray(timelineRes?.timeline) ? timelineRes.timeline : [];
      } catch (timelineError) {
        console.error('Failed to load complaint timeline:', timelineError);
      }

      let incidentProvinceName: string | undefined;
      let incidentDistrictName: string | undefined;
      let incidentDsDivisionName: string | undefined;
      let incidentGnDivisionName: string | undefined;

      try {
        if (data?.incidentProvinceId) {
          const provinces = await fetchProvinces();
          incidentProvinceName = provinces.find((p: any) => p.id === data.incidentProvinceId)?.name;
        }

        if (data?.incidentProvinceId && data?.incidentDistrictId) {
          const districts = await fetchDistricts(data.incidentProvinceId);
          incidentDistrictName = districts.find((d: any) => d.id === data.incidentDistrictId)?.name;
        }

        if (data?.incidentDistrictId && data?.incidentDsDivisionId) {
          const dsDivisions = await fetchDsDivisions(data.incidentDistrictId);
          incidentDsDivisionName = dsDivisions.find((ds: any) => ds.id === data.incidentDsDivisionId)?.name;
        }

        if (data?.incidentDsDivisionId && data?.incidentGnDivisionId) {
          const gnDivisions = await fetchGnDivisions(data.incidentDsDivisionId);
          const gn = gnDivisions.find((g: any) => g.id === data.incidentGnDivisionId);
          incidentGnDivisionName = gn?.name;
        }
      } catch (geoError) {
        console.error('Failed to resolve incident location names:', geoError);
      }

      setComplaint({
        ...data,
        incidentProvinceName: data?.incidentProvinceName ?? incidentProvinceName,
        incidentDistrictName: data?.incidentDistrictName ?? incidentDistrictName,
        incidentDsDivisionName: data?.incidentDsDivisionName ?? incidentDsDivisionName,
        incidentGnDivisionName: data?.incidentGnDivisionName ?? incidentGnDivisionName,
      });
      setTimeline(timelineItems);
    } catch (error) {
      console.error('Failed to load complaint details:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function timelineItemTitle(item: any): string {
    if (item?.type === 'status_change') {
      const from = item?.fromStatus ? formatStatus(item.fromStatus) : '';
      const to = item?.toStatus ? formatStatus(item.toStatus) : '';
      return from && to ? `Status: ${from} → ${to}` : 'Status updated';
    }
    if (item?.type === 'assignment') return 'Assigned';
    if (item?.type === 'internal_note') return 'Internal note';
    if (item?.type === 'authority_response') return 'Authority response';
    if (item?.type === 'authority_details_request') return 'Details requested';
    if (item?.type === 'citizen_details') return 'Citizen details';
    return item?.type ? String(item.type) : 'Update';
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load complaint details</Text>
          <TouchableOpacity onPress={loadComplaintDetails}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const colors = statusColors[complaint.status] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Text style={[styles.statusLabel, { color: colors.text }]}>Status</Text>
          <Text style={[styles.statusValue, { color: colors.text }]}>
            {formatStatus(complaint.status)}
          </Text>
        </View>

        {/* Complaint Code */}
        <View style={styles.section}>
          <Text style={styles.label}>Complaint Reference</Text>
          <Text style={styles.complaintCode}>{complaint.complaintCode}</Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{complaint.categoryCode.replace(/_/g, ' ')}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{complaint.descriptionText}</Text>
        </View>

        {/* Target Information */}
        <View style={styles.section}>
          <Text style={styles.label}>Submitted To</Text>
          <Text style={styles.value}>{complaint.targetType.replace(/_/g, ' ')}</Text>
          {complaint.selectedDepartmentName && (
            <Text style={styles.subValue}>{complaint.selectedDepartmentName}</Text>
          )}
          {complaint.selectedStatutoryBoardName && (
            <Text style={styles.subValue}>{complaint.selectedStatutoryBoardName}</Text>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Incident Location</Text>
          <View style={styles.locationGrid}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Province</Text>
              <Text style={styles.locationValue}>{complaint.incidentProvinceName || 'N/A'}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>District</Text>
              <Text style={styles.locationValue}>{complaint.incidentDistrictName || 'N/A'}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>DS Division</Text>
              <Text style={styles.locationValue}>{complaint.incidentDsDivisionName || 'N/A'}</Text>
            </View>
            {complaint.incidentGnDivisionName && (
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>GN Division</Text>
                <Text style={styles.locationValue}>{complaint.incidentGnDivisionName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.label}>Timeline</Text>
          <View style={styles.timeline}>
            {timeline.length === 0 ? (
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>No timeline items</Text>
                  <Text style={styles.timelineDate}>{new Date(complaint.updatedAt).toLocaleString()}</Text>
                </View>
              </View>
            ) : (
              timeline.map((t, idx) => (
                <View key={`${t?.type ?? 'item'}-${t?.createdAt ?? idx}-${idx}`}>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>{timelineItemTitle(t)}</Text>
                      <Text style={styles.timelineDate}>
                        {t?.createdAt ? new Date(t.createdAt).toLocaleString() : ''}
                      </Text>
                      {t?.message ? <Text style={styles.timelineDate}>{t.message}</Text> : null}
                    </View>
                  </View>
                  {idx < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  retryText: {
    marginTop: 12,
    color: '#2563eb',
    fontSize: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  complaintCode: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    fontFamily: 'monospace',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  subValue: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  locationItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
    marginTop: 4,
    marginRight: 12,
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: '#e5e7eb',
    marginLeft: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timelineDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
});
