import { Prisma } from '../../../generated/prisma';

export interface Transaction {}

export interface IGetTransactionsOtherOptions {
  take?: number;
  cursor?: Prisma.TransactionWhereUniqueInput;
  skip?: number;
  orderBy?:
    | Prisma.TransactionOrderByWithRelationInput
    | Prisma.TransactionOrderByWithRelationInput[];
}
