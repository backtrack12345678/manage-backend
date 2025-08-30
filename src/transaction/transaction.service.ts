import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ValidateTransactionDto } from './dto/update-transaction.dto';
import { ErrorService } from '../common/error/error.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { CustomerService } from '../customer/customer.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../common/prisma/prisma.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { FileService } from '../file/file.service';
import { GetAllQueryDto } from './dto/get-transaction.dto';
import { IGetTransactionsOtherOptions } from './interfaces/transaction.interface';
import { Request } from 'express';
import Decimal from 'decimal.js';
import {
  TransactionStatus,
  TransactionType,
  UserRole,
} from '../../generated/prisma';
import { GardenService } from '../garden/garden.service';
import { WoodService } from '../wood/wood.service';
import { GardenRepository } from '../garden/repositories/garden.repository';

@Injectable()
export class TransactionService {
  constructor(
    private errorService: ErrorService,
    private gardenService: GardenService,
    private transactionRepository: TransactionRepository,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private prismaService: PrismaService,
    private fileService: FileService,
    private woodService: WoodService,
    private gardenRepository: GardenRepository,
  ) {}

  async create(
    auth: IAuth,
    payload: CreateTransactionDto,
    media: Express.Multer.File,
    request: Request,
  ) {
    const garden = await this.gardenService.findOneWithoutAuth(
      payload.gardenId,
    );
    const wood = await this.woodService.findOneWithoutAuth(payload.woodId);
    const customer = await this.customerService.findOneWithoutAuth(
      payload.customerId,
    );
    const vehicle = await this.vehicleService.findOneWithoutAuth(
      payload.vehicleId,
    );

    const uploadedMedia = await this.fileService.writeFileStream(
      media,
      'transaction',
    );

    const id = `transaction-${uuid().toString()}`;
    const totalCost = new Decimal(payload.woodPiecesQty).times(
      garden.woodPiecesCostPrice,
    );
    const createdTransaction = await this.prismaService.$transaction(
      async (tx) => {
        const transaction = await this.transactionRepository.createTransaction(
          {
            id,
            userId: auth.id,
            ...payload,
            gardenName: garden.name,
            customerName: customer.name,
            vehicleName: vehicle.name,
            woodName: wood.name,
            woodPrice: wood.price,
            woodUnit: wood.unit,
            totalCost,
            namaFile: uploadedMedia.fileName,
            path: uploadedMedia.filePath,
            createdAt: payload.date || undefined,
          },
          this.transactionSelectOptions,
          tx,
        );

        const { woodPiecesQtyActual } =
          await this.gardenRepository.decrementQuantity(
            payload.gardenId,
            payload.woodPiecesQty,
            tx,
          );

        if (woodPiecesQtyActual < 0) {
          this.errorService.badRequest('Stok Kayu Tidak Mencukupi');
        }

        return transaction;
      },
    );

    return this.toTransactionResponse(createdTransaction, request);
  }

  async findAll(request: Request, query?: GetAllQueryDto) {
    const transactions = await this.transactionRepository.getTransactions(
      this.transactionSelectOptions,
      this.transactionWhereOptions(query),
      this.transactionOtherOptions(query),
    );

    const { totalPrice, totalDebt, totalCost } = transactions.reduce(
      (acc, tx) => {
        const price = new Decimal(tx.totalPrice || 0);
        const paid = new Decimal(tx.totalPaid || 0);
        const cost = new Decimal(tx.totalCost || 0);

        acc.totalPrice = acc.totalPrice.plus(price);
        acc.totalDebt = acc.totalDebt.plus(price.minus(paid));
        acc.totalCost = acc.totalCost.plus(cost);

        return acc;
      },
      {
        totalPrice: new Decimal(0),
        totalDebt: new Decimal(0),
        totalCost: new Decimal(0),
      },
    );

    return {
      customer: query.customerName || 'All',
      month: query.month,
      totalPrice,
      totalDebt,
      totalCost,
      transactions: transactions.map((tx) =>
        this.toTransactionResponse(tx, request),
      ),
    };
  }

  async findOne(request: Request, id: string) {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
      this.transactionSelectOptions,
    );

    if (!transaction) this.errorService.notFound('Transaksi Tidak Ditemukan');

    return this.toTransactionResponse(transaction, request);
  }

  async update(request: Request, id: string, media: Express.Multer.File) {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
      {
        id: true,
        namaFile: true,
        path: true,
      },
    );

    if (!transaction) this.errorService.notFound('Transaksi Tidak Ditemukan');

    const oldMedia = transaction.path;
    const { fileName, filePath } = await this.fileService.writeFileStream(
      media,
      'transaction',
    );

    const updatedTransaction =
      await this.transactionRepository.updateTransactionById(
        id,
        {
          namaFile: fileName,
          path: filePath,
        },
        this.transactionSelectOptions,
      );

    if (transaction.namaFile !== 'default_transaction.jpg') {
      this.fileService.deleteFile(oldMedia);
    }

    return this.toTransactionResponse(updatedTransaction, request);
  }

  async validate(
    auth: IAuth,
    id: string,
    payload: ValidateTransactionDto,
    request: Request,
  ) {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
      this.transactionSelectOptions,
    );

    if (!transaction) this.errorService.notFound('Transaksi Tidak Ditemukan');

    if (
      transaction.status === TransactionStatus.DITERIMA &&
      auth.role !== UserRole.ADMIN
    ) {
      this.errorService.forbidden(
        'Transaksi Sudah Diterima, Hanya Admin Yang Dapat Mengubah',
      );
    }

    const totalPrice = new Decimal(payload.totalPrice);
    const totalPaid = new Decimal(payload.totalPaid);
    const actualTotalPrice = new Decimal(payload.woodUnitsqty).times(
      transaction.woodPrice,
    );

    if (totalPaid.gt(totalPrice)) {
      this.errorService.badRequest(
        'Total Paid yang di inputkan tidak boleh lebih dari total price',
      );
    }

    if (!actualTotalPrice.eq(totalPrice)) {
      this.errorService.badRequest(
        'Total Price yang di inputkan tidak sama dengan actual total price',
      );
    }

    const type = this.getTransactionType(totalPaid, actualTotalPrice);

    if (type !== payload.type) {
      this.errorService.badRequest(
        'Type transaksi yang di berikan tidak cocok dengan pembayaran yang di berikan',
      );
    }

    const validatedTrasaction =
      await this.transactionRepository.updateTransactionById(
        id,
        {
          status: TransactionStatus.DITERIMA,
          woodUnitsqty: payload.woodUnitsqty,
          type,
          totalPrice,
          totalPaid,
          ...(transaction.status !== TransactionStatus.DITERIMA && {
            validatedBy: {
              create: {
                userId: auth.id,
              },
            },
          }),
        },
        this.transactionSelectOptions,
      );

    return this.toTransactionResponse(validatedTrasaction, request);
  }

  async updateTypeValidatedTransaction(id: string, payload, request: Request) {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
      this.transactionSelectOptions,
    );

    if (!transaction) this.errorService.notFound('Transaksi Tidak Ditemukan');

    if (transaction.status !== TransactionStatus.DITERIMA) {
      this.errorService.badRequest('Transaksi Belum Divalidasi');
    }

    const totalPaid = new Decimal(payload.totalPaid);

    if (totalPaid.gt(transaction.totalPrice)) {
      this.errorService.badRequest(
        'Total Paid tidak boleh lebih dari Total Price',
      );
    }

    if (totalPaid.lte(transaction.totalPaid)) {
      this.errorService.badRequest(
        'Total Paid tidak boleh kurand dari Total Paid yang lama atau sama',
      );
    }

    const type = this.getTransactionType(totalPaid, transaction.totalPrice);

    if (type !== payload.type) {
      this.errorService.badRequest(
        'Type transaksi yang di berikan tidak cocok dengan pembayaran yang di berikan',
      );
    }

    const updatedValidatedTrasaction =
      await this.transactionRepository.updateTransactionById(
        id,
        {
          type,
          totalPaid,
        },
        this.transactionSelectOptions,
      );

    return this.toTransactionResponse(updatedValidatedTrasaction, request);
  }

  async remove(auth: IAuth, id: string) {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
      {
        status: true,
      },
    );

    if (!transaction) this.errorService.notFound('Transaksi Tidak Ditemukan');

    if (
      transaction.status === TransactionStatus.DITERIMA &&
      auth.role !== UserRole.ADMIN
    ) {
      this.errorService.forbidden(
        'Transaksi Sudah Diterima, Hanya Admin Yang Dapat Menghapus',
      );
    }

    const deletedTransaction =
      await this.transactionRepository.deleteTransactionById(id, {
        path: true,
      });

    this.fileService.deleteFile(deletedTransaction.path);
  }

  transactionSelectOptions = {
    id: true,
    createdBy: {
      select: {
        id: true,
        name: true,
      },
    },
    gardenId: true,
    gardenName: true,
    customerId: true,
    customerName: true,
    vehicleId: true,
    vehicleName: true,
    vehicleNumber: true,
    woodId: true,
    woodName: true,
    woodPrice: true,
    woodUnit: true,
    woodPiecesQty: true,
    woodUnitsqty: true,
    totalPrice: true,
    totalPaid: true,
    totalCost: true,
    status: true,
    type: true,
    namaFile: true,
    createdAt: true,
    updatedAt: true,
    validatedBy: {
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  transactionWhereOptions(query: GetAllQueryDto) {
    return {
      customerName: {
        contains: query.customerName,
      },
      gardenName: {
        contains: query.gardenName,
      },
      createdAt: {
        gte: new Date(`${query.month}-01`),
        lt: new Date(
          new Date(`${query.month}-01`).setMonth(
            new Date(`${query.month}-01`).getMonth() + 1,
          ),
        ),
      },
      status: query.status,
      type: query.type,
    };
  }

  transactionOtherOptions(query: GetAllQueryDto): IGetTransactionsOtherOptions {
    return {
      orderBy: {
        createdAt: 'desc',
      },
      take: query.size,
      ...(query.cursor && {
        skip: 1,
        cursor: {
          id: query.cursor,
        },
      }),
    };
  }

  toTransactionResponse(tx, request: Request) {
    return {
      id: tx.id,
      createdBy: {
        id: tx.createdBy.id,
        name: tx.createdBy.name,
      },
      garden: {
        id: tx.gardenId,
        name: tx.gardenName,
      },
      customer: {
        id: tx.customerId,
        name: tx.customerName,
      },
      vehicle: {
        id: tx.vehicleId,
        name: tx.vehicleName,
        number: tx.vehicleNumber,
      },
      wood: {
        id: tx.woodId,
        name: tx.woodName,
        price: tx.woodPrice?.toString() ?? null, // ✅ decimal → string
        unit: tx.woodUnit,
        piecesQty: tx.woodPiecesQty,
        unitsQty: tx.woodUnitsqty,
      },
      totalPrice: tx.totalPrice?.toString() ?? null, // ✅ decimal → string,
      totalPaid: tx.totalPaid?.toString() ?? null,
      totalCost: tx.totalCost?.toString() ?? null,
      status: tx.status,
      type: tx.type,
      urlFile: `${this.fileService.getHostFile(request)}/file/transaction/${tx.namaFile}`,
      validatedBy: {
        id: tx.validatedBy?.user?.id,
        name: tx.validatedBy?.user?.name,
      },
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    };
  }

  getTransactionType(
    totalPaid: Decimal | string | number,
    totalPrice: Decimal | string | number,
  ): TransactionType {
    const paid = new Decimal(totalPaid);
    const total = new Decimal(totalPrice);

    if (paid.eq(0)) {
      return TransactionType.BELUM_DIBAYAR;
    }

    if (paid.lt(total)) {
      return TransactionType.UTANG;
    }

    return TransactionType.LUNAS;
  }
}
