// src/data/schema/api-response.schema.ts

export interface ApiSeriesData {
  id: string;
  seriesKey: string;
  displayName: string;
  value: number;
}

export interface ApiZoneData {
  id: string;
  label: string;
  timestamp?: string;
  iconIdentifier?: string;
  metrics: ApiSeriesData[];
  metadata?: Record<string, string | number>;
  isDisabled?: boolean;
}

export interface ApiGraphMetadata {
  totalRecords: number;
  generatedAt: string;
  timeRange?: {
    start: string;
    end: string;
  };
  availableSeries: {
    key: string;
    label: string;
  }[];
}

export interface ApiGraphResponse {
  status: 'success' | 'error' | 'partial';
  data: ApiZoneData[];
  metadata: ApiGraphMetadata;
  error?: {
    code: string;
    message: string;
  };
}