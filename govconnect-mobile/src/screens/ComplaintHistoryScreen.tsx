import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchMyComplaints } from '../api/client';

const statusColors: Record<string, { bg: string; text: string }> = {
  SUBMITTED: { bg: '#dbeafe', text: '#1e40af' },
  UNDER_REVIEW: { bg: '#fef3c7', text: '#92400e' },
  ASSIGNED: { bg: '#e0e7ff', text: '#3730a3' },
  ACTION_TAKEN: { bg: '#dcfce7', text: '#166534' },
  RESOLVED: { bg: '#d1fae5', text: '#065f46' },
  CLOSED: { bg: '#f3f4f6', text: '#374151' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b' },
};

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function ComplaintHistoryScreen({ navigation }: any) {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try {
      const data = await fetchMyComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadComplaints();
    setRefreshing(false);
  }

  const filteredComplaints = complaints.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'ACTION_TAKEN'].includes(c.status);
    if (filter === 'RESOLVED') return ['RESOLVED', 'CLOSED'].includes(c.status);
    return true;
  });

  function renderComplaintItem({ item }: { item: any }) {
    const colors = statusColors[item.status] || { bg: '#f3f4f6', text: '#374151' };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ComplaintDetails', { complaintId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.complaintCode}>{item.complaintCode}</Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.statusText, { color: colors.text }]}>
              {formatStatus(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.category}>{item.categoryCode.replace(/_/g, ' ')}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.descriptionText}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.targetType}>{item.targetType.replace(/_/g, ' ')}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Complaint List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No complaints found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'ALL'
                ? 'Submit your first complaint to get started'
                : `No ${filter.toLowerCase()} complaints`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterTabActive: {
    backgroundColor: '#dbeafe',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#2563eb',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  targetType: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
});
