export interface ControllerRecordFiltered {
  names: string;
  lastNames: string;
}

export interface SpaceRecordFiltered {
  spaceNumber: string;
}

export interface ParkingRecordFiltered {
  id: number;
  licensePlate: string;
  spaceId: number;
  entryControllerId: number;
  exitControllerId: number | null;
  entryDate: string;
  exitDate: string | null;
  parkedHours: string | null;
  appliedRate: string;
  totalToPay: string | null;
  observations: string;
  status: "active" | "finished";
  branchId: number;
  entryController: ControllerRecordFiltered;
  exitController: ControllerRecordFiltered | null;
  space: SpaceRecordFiltered;
}

export interface FiltersRecord {
  branchId: number;
  licensePlate: string;
  entryControllerId: string;
  exitControllerId: string;
  status: string;
  entryStartDate: string;
  entryEndDate: string;
  exitStartDate: string;
  exitEndDate: string;
}
