import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
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

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    setIsLoading(true);
    try {
      const data = await fetchMyComplaints();
      setComplaints(data.slice(0, 5)); // Show last 5
      setStats({
        total: data.length,
        inProgress: data.filter((c: any) =>
          ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'ACTION_TAKEN'].includes(c.status)
        ).length,
        resolved: data.filter((c: any) =>
          ['RESOLVED', 'CLOSED'].includes(c.status)
        ).length,
      });
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadComplaints} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.username?.split(' ')[0] || 'Citizen'}</Text>
          <Text style={styles.welcomeText}>Welcome to GovConnect</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('SubmitComplaint')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={[styles.actionIconText, { color: '#2563eb' }]}>+</Text>
            </View>
            <Text style={styles.actionText}>New Complaint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('History')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Text style={[styles.actionIconText, { color: '#16a34a' }]}>📋</Text>
            </View>
            <Text style={styles.actionText}>My Complaints</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Recent Complaints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {complaints.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No complaints yet</Text>
              <Text style={styles.emptySubtext}>Tap "New Complaint" to submit your first complaint</Text>
            </View>
          ) : (
            complaints.map((complaint) => {
              const colors = statusColors[complaint.status] || { bg: '#f3f4f6', text: '#374151' };
              return (
                <TouchableOpacity
                  key={complaint.id}
                  style={styles.complaintCard}
                  onPress={() => navigation.navigate('ComplaintDetails', { complaintId: complaint.id })}
                >
                  <View style={styles.complaintHeader}>
                    <Text style={styles.complaintCode}>{complaint.complaintCode}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.statusText, { color: colors.text }]}>
                        {formatStatus(complaint.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.complaintCategory}>{complaint.categoryCode}</Text>
                  <Text style={styles.complaintDesc} numberOfLines={2}>
                    {complaint.descriptionText}
                  </Text>
                  <Text style={styles.complaintDate}>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  seeAll: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  complaintCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  complaintHeader: {
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  complaintCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  complaintDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  complaintDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
