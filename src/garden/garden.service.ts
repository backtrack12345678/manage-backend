import { Injectable } from '@nestjs/common';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { GardenRepository } from './repositories/garden.repository';
import { ErrorService } from '../common/error/error.service';
import { WoodService } from '../wood/wood.service';
import {
  IGardenReportResponse,
  IGardenResponse,
  IGardenResult,
} from './interfaces/garden.interface';
import { IAuth } from '../auth/interfaces/auth.interface';
import { Prisma, UserRole } from '../../generated/prisma';
import { GetReportQueryDto } from './dto/get-garden.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class GardenService {
  constructor(
    private gardenRepository: GardenRepository,
    private woodService: WoodService,
    private errorService: ErrorService,
    private prismaService: PrismaService,
  ) {}

  async create(payload: CreateGardenDto): Promise<IGardenResponse> {
    const garden = await this.gardenRepository.createGarden(
      {
        name: payload.name,
        woodPiecesQtyTarget: payload.woodPiecesQty,
        woodPiecesQtyActual: payload.woodPiecesQty,
        woodPiecesCostPrice: Prisma.Decimal(payload.woodPiecesCostPrice),
      },
      {
        ...this.gardenSelectOptions,
      },
    );

    return this.toGardenResponse(garden);
  }

  async findAll(auth: IAuth): Promise<IGardenResponse[]> {
    const whereOptions = auth.role !== UserRole.ADMIN ? { isActive: true } : {};
    const gardens = await this.gardenRepository.getGardens(
      {
        ...this.gardenSelectOptions,
      },
      whereOptions,
    );

    return gardens.map((garden) => this.toGardenResponse(garden));
  }

  async findOne(auth: IAuth, id: number): Promise<IGardenResponse> {
    const garden = await this.gardenRepository.getGardenById(id, {
      ...this.gardenSelectOptions,
    });

    if (!garden || (auth.role !== UserRole.ADMIN && !garden.isActive))
      this.errorService.notFound('Kendaraan Tidak Ditemukan');

    return this.toGardenResponse(garden);
  }

  async findOneWithoutAuth(id: number) {
    const garden = await this.gardenRepository.getGardenById(
      id,
      this.gardenSelectOptions,
    );

    if (!garden || !garden.isActive)
      this.errorService.notFound('Kebun Tidak Ditemukan');

    return garden;
  }

  async update(id: number, payload: UpdateGardenDto): Promise<IGardenResponse> {
    const countGarden = await this.gardenRepository.countGardenById(id);

    if (countGarden === 0) {
      await this.errorService.notFound('Kebun Tidak Ditemukan');
    }

    const garden = await this.gardenRepository.updateGardenById(id, payload, {
      ...this.gardenSelectOptions,
    });

    return this.toGardenResponse(garden);
  }

  async remove(id: number): Promise<void> {
    const countGarden = await this.gardenRepository.countGardenById(id);

    if (countGarden === 0) {
      await this.errorService.notFound('Kebun Tidak Ditemukan');
    }

    await this.gardenRepository.updateGardenById(
      id,
      {
        isActive: false,
      },
      {
        id: true,
      },
    );
  }

  async report(query?: GetReportQueryDto): Promise<IGardenReportResponse[]> {
    const { startDate, endDate } = this.getMonthDateRange(query.month);

    const gardens = await this.prismaService.transaction.groupBy({
      by: ['gardenName', 'woodName'],
      _sum: {
        woodPiecesQty: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: [{ gardenName: 'asc' }, { woodName: 'asc' }],
    });

    return this.toGardenReportResponse(gardens);
  }

  private gardenSelectOptions = {
    id: true,
    name: true,
    woodPiecesQtyTarget: true,
    woodPiecesQtyActual: true,
    woodPiecesCostPrice: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  private gardenWoodsSelectOptions = {
    woods: {
      select: {
        wood: {
          select: this.woodService.woodSelectOptions,
        },
        quantity: true,
      },
    },
  };

  toGardenResponse(garden: IGardenResult) {
    const { woodPiecesCostPrice, ...gardenResult } = garden;

    return {
      ...gardenResult,
      woodPiecesCostPrice: woodPiecesCostPrice.toString(),
    };
  }

  toGardenReportResponse(gardens) {
    return gardens.reduce((acc, curr) => {
      const garden = acc.find((g) => g.name === curr.gardenName);

      const woodData = {
        name: curr.woodName,
        total: curr._sum.woodPiecesQty ?? 0,
      };

      if (garden) {
        garden.woods.push(woodData);
      } else {
        acc.push({
          name: curr.gardenName,
          woods: [woodData],
        });
      }

      return acc;
    }, []);
  }

  private getMonthDateRange(month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    return { startDate, endDate };
  }
}
