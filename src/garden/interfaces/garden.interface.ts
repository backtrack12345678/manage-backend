import { Prisma } from '../../../generated/prisma';

export interface IGardenResponse {
  id: number;
  name: string;
  woodPiecesQtyTarget: number;
  woodPiecesQtyActual: number;
  woodPiecesCostPrice: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGardenReportResponse {
  name: string;
  woods: {
    name: string;
    total: number;
  }[];
}

export interface IGardenResult {
  id: number;
  name: string;
  woodPiecesQtyTarget: number;
  woodPiecesQtyActual: number;
  woodPiecesCostPrice: Prisma.Decimal;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
