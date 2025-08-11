import { Prisma, WoodUnit } from '../../../generated/prisma';

export interface IWoodResult {
  id: number;
  name: string;
  price: Prisma.Decimal;
  unit: WoodUnit;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  priceLogs?: IWoodLogsResult[];
}

export interface IWoodResponse {
  id: number;
  name: string;
  price: string;
  unit: WoodUnit;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  logs?: IWoodLogsResponse[];
}

export interface IWoodLogsResult {
  id: number;
  oldName: string;
  oldUnit: WoodUnit;
  oldPrice: Prisma.Decimal;
  newPrice: Prisma.Decimal;
  updatedBy: {
    name: string;
    id: string;
  };
  updatedAt: Date;
}

export interface IWoodLogsResponse {
  id: number;
  oldName: string;
  oldUnit: WoodUnit;
  oldPrice: string;
  newPrice: string;
  updatedBy: {
    name: string;
    id: string;
  };
  updatedAt: Date;
}
