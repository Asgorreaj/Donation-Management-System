import { useState, useCallback } from 'react';
import { reportService } from '@/helpers/reportService';

interface DonationReportResponse {
  with_donations: any[];
  without_donations: any[];
}

export const useReport = () => {
  const [reportData, setReportData] = useState<DonationReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getDonationReport(params);
      setReportData(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      await reportService.exportDonationReport(params);
    } catch (err: any) {
      setError(err.message || 'Failed to export report');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reportData,
    loading,
    error,
    fetchReport,
    exportReport
  };
};