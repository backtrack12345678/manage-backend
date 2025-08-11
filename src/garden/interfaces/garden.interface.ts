import {
  IWoodResponse,
  IWoodResult,
} from '../../wood/interfaces/wood.interface';

export interface IGardenResponse {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalWoodsQuantity?: number;
  woods?: IGardenWoodsResponse[];
}

export interface IGardenResult {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  woods?: {
    wood: IWoodResult;
    quantity: number;
  }[];
}

export interface IGardenWoodsResponse extends IWoodResponse {
  quantity: number;
}
