export type ReportData =
  | GeneralReport
  | FinancialReport
  | OccupancyReport
  | PerformanceReport;

export type ReportType = "general" | "financial" | "occupancy" | "performance";

export interface GeneralReport {
  type: "general";
  branchId: number;
  period: { startDate: string | null; endDate: string | null };
  summary: {
    totalRecords: number;
    active: number;
    finished: number;
    cancelled: number;
    averageStayHours: number;
  };
  dailyActivity: Array<{
    date: string;
    entries: number;
    exits: number;
    active: number;
  }>;
  peakHours: Array<{ hour: number; count: number }>;
  vehicleTypeStats: Array<{
    vehicleType: string;
    totalVehicles: number;
    totalRevenue: number;
    percentage: number;
  }>;
  generatedAt: string;
}

export interface FinancialReport {
  type: "financial";
  branchId: number;
  period: { startDate: string | null; endDate: string | null };
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    totalHours: number;
    averageTicket: number;
    averageHoursParked: number;
    revenuePerHour: number;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    transactions: number;
    averageTicket: number;
  }>;
  vehicleTypeRevenue: Array<{
    vehicleType: string;
    revenue: number;
    transactions: number;
    totalHours: number;
    averageHoursPerVehicle: number;
    hourlyRate: number;
    percentageOfTotal: number;
  }>;
  zoneRevenue: Array<{
    zone: string;
    revenue: number;
    transactions: number;
    averageTicket: number;
  }>;
  generatedAt: string;
}

export interface OccupancyReport {
  type: "occupancy";
  branchId: number;
  period: { startDate: string | null; endDate: string | null };
  summary: {
    totalCapacity: number;
    currentOccupied: number;
    currentAvailable: number;
    overallOccupancyRate: number;
  };
  currentOccupancy: Array<{
    zone: string;
    vehicleType: string;
    totalSpaces: number;
    occupied: number;
    available: number;
    occupancyRate: number;
  }>;
  dailyOccupancy: Array<{
    date: string;
    entries: number;
    activeVehicles: number;
    peakOccupancy: number;
  }>;
  hourlyOccupancy: Array<{
    hour: number;
    entries: number;
    averageOccupancy: number;
  }>;
  topRotatingSpaces: Array<{
    zone: string;
    spaceNumber: string;
    totalUsages: number;
    rotationRate: number;
  }>;
  generatedAt: string;
}

export interface PerformanceReport {
  type: "performance";
  branchId: number;
  period: { startDate: string | null; endDate: string | null };
  operationalEfficiency: {
    totalControllers: number;
    activeControllers: number;
    averageOperationsPerController: number;
    cancellationRate: number;
    averageProcessingTimeHours: number;
  };
  controllerStats: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    totalEntries: number;
    totalExits: number;
    totalOperations: number;
    revenueGenerated: number;
    averageRevenuePerExit: number;
    lastLogin: string | null;
  }>;
  topPerformers: Array<{
    id: number;
    name: string;
    totalOperations: number;
    revenueGenerated: number;
  }>;
  generatedAt: string;
}
