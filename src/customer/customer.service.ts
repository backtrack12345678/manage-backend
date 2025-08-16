import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './repositories/customer.repository';
import { ErrorService } from '../common/error/error.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UserRole } from '../../generated/prisma';
import { ICustomerResponse } from './interfaces/customer.interface';

@Injectable()
export class CustomerService {
  constructor(
    private errorService: ErrorService,
    private customerRepository: CustomerRepository,
  ) {}

  async create(payload: CreateCustomerDto): Promise<ICustomerResponse> {
    const customer = await this.customerRepository.createCustomer(
      payload,
      this.customerSelectOptions,
    );

    return customer;
  }

  async findAll(auth: IAuth): Promise<ICustomerResponse[]> {
    const whereOptions = auth.role !== UserRole.ADMIN ? { isActive: true } : {};
    const customers = await this.customerRepository.getCustomers(
      this.customerSelectOptions,
      whereOptions,
    );

    return customers;
  }

  async findOne(auth: IAuth, id: number): Promise<ICustomerResponse> {
    const customer = await this.customerRepository.getCustomerById(
      id,
      this.customerSelectOptions,
    );

    if (!customer || (auth.role !== UserRole.ADMIN && !customer.isActive))
      this.errorService.notFound('Pemilik Tidak Ditemukan');

    return customer;
  }

  async findOneWithoutAuth(id: number): Promise<ICustomerResponse> {
    const customer = await this.customerRepository.getCustomerById(
      id,
      this.customerSelectOptions,
    );

    if (!customer || !customer.isActive)
      this.errorService.notFound('Pemilik Tidak Ditemukan');

    return customer;
  }

  async update(
    id: number,
    payload: UpdateCustomerDto,
  ): Promise<ICustomerResponse> {
    const countCustomer = await this.customerRepository.countCustomerById(id);

    if (countCustomer === 0)
      await this.errorService.notFound('Pemilik Tidak Ditemukan');

    const customer = await this.customerRepository.updateCustomerById(
      id,
      payload,
      this.customerSelectOptions,
    );

    return customer;
  }

  async remove(id: number): Promise<void> {
    const countCustomer = await this.customerRepository.countCustomerById(id);

    if (countCustomer === 0)
      await this.errorService.notFound('Pemilik Tidak Ditemukan');

    await this.customerRepository.updateCustomerById(
      id,
      {
        isActive: false,
      },
      {
        id: true,
      },
    );
  }

  private customerSelectOptions = {
    id: true,
    name: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };
}
