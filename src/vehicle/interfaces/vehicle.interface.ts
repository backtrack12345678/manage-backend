export interface IVehicleResponse {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVehicleReportResponse {
  name: string;
  total: number;
}
