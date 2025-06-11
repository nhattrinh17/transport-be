import { Order } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { OrderRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/types/common.type';
@Injectable()
export class OrderRepository extends BaseRepositoryAbstract<Order> implements OrderRepositoryInterface {
  constructor(@InjectRepository(Order) private readonly OrderRepository: Repository<Order>) {
    super(OrderRepository);
  }

  findAll(
    condition: any,
    options?: {
      projection: (keyof Order)[];
      sort: string;
      typeSort: 'ASC' | 'DESC';
      page: number;
      offset: number;
      limit: number;
    },
  ): Promise<FindAllResponse<Order>> {
    const queryBuilder = this.OrderRepository.createQueryBuilder('order').leftJoinAndSelect('order.detail', 'detail'); // 👈 Join sang bảng OrderDetail

    // WHERE
    if (!condition?.isPinter) {
      queryBuilder.where(condition);
    } else {
      queryBuilder.where('detail.isPinter = :isPinter', { isPinter: condition.isPinter });
      delete condition.isPinter;
      queryBuilder.andWhere(condition);
    }

    // SELECT projection nếu có
    if (options?.projection?.length) {
      const fields = options.projection.map((field) => `order.${field}`);
      queryBuilder.select(fields);
    }

    // SORT
    queryBuilder.orderBy(`order.${options?.sort || 'createdAt'}`, options?.typeSort || 'DESC');

    // PAGINATION
    if (options?.limit) queryBuilder.take(options.limit);
    if (options?.offset) queryBuilder.skip(options.offset);

    return queryBuilder.getManyAndCount().then(([items, count]) => ({
      pagination: {
        total: count,
        limit: options?.limit,
        page: options?.page,
      },
      data: items,
    }));
  }

  findCountOrderByStatus(condition: any): Promise<any> {
    return this.OrderRepository.createQueryBuilder('order').where(condition).select('order.status', 'status').addSelect('COUNT(order.id)', 'count').groupBy('order.status').getRawMany();
  }

  findOneByIdAndJoin(id: string): Promise<Order | null> {
    return this.OrderRepository.createQueryBuilder('order').leftJoinAndSelect('order.detail', 'detail').leftJoinAndSelect('order.log', 'log').where('order.id = :id', { id }).getOne();
  }

  getDataDashboard(condition: any): Promise<any> {
    const queryBuilder = this.OrderRepository.createQueryBuilder('order').leftJoin('order.detail', 'detail').select([
      // Tổng đơn COD (collection > 0 và không phải trạng thái CANCEL/RETURN)
      "COUNT(CASE WHEN order.collection > 0 AND order.status NOT IN ('CANCEL', 'RETURN') THEN 1 END) AS totalCodOrders",

      // Số đơn đã thu COD (collection > 0 và trạng thái là 'COMPLETED')
      "COUNT(CASE WHEN order.collection > 0 AND order.status = 'COMPLETED' THEN 1 END) AS codCollectedOrders",

      // Số đơn chưa thu COD (collection > 0 và trạng thái khác COMPLETED, CANCEL, RETURN)
      "COUNT(CASE WHEN order.collection > 0 AND order.status NOT IN ('COMPLETED', 'CANCEL', 'RETURN') THEN 1 END) AS codUncollectedOrders",

      // Tổng tiền COD đã thu
      "SUM(CASE WHEN order.collection > 0 AND order.status = 'COMPLETED' THEN order.collection ELSE 0 END) AS totalCodCollected",

      // Tổng tiền COD chưa thu
      "SUM(CASE WHEN order.collection > 0 AND order.status NOT IN ('COMPLETED', 'CANCEL', 'RETURN') THEN order.collection ELSE 0 END) AS totalCodUncollected",

      // Tổng tiền phí vận chuyển (chỉ tính các đơn không CANCEL hoặc RETURN)
      "SUM(CASE WHEN order.status NOT IN ('CANCEL', 'RETURN') THEN order.totalFee ELSE 0 END) AS totalShippingFee",
    ]);

    // Apply conditions if provided (e.g. unit, date range, etc.)
    queryBuilder.where(condition);

    const statsPromise = queryBuilder.getRawOne();

    // Group theo trạng thái
    const statusGroupPromise = this.OrderRepository.createQueryBuilder('order').select('order.status', 'status').addSelect('COUNT(order.id)', 'count').groupBy('order.status').where(condition).getRawMany();

    // Group theo ngày
    const dayGroupPromise = this.OrderRepository.createQueryBuilder('order')
      .select("DATE_FORMAT(order.createdAt, '%Y-%m-%d')", 'day')
      .addSelect('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(condition)
      .groupBy('day')
      .addGroupBy('order.status')
      .orderBy('day', 'ASC')
      .addOrderBy('status', 'ASC')
      .getRawMany();

    // Group theo tuần
    const weekGroupPromise = this.OrderRepository.createQueryBuilder('order')
      .select('YEARWEEK(order.createdAt, 1)', 'week')
      .addSelect('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(condition)
      .groupBy('week')
      .addGroupBy('order.status')
      .orderBy('week', 'ASC')
      .addOrderBy('status', 'ASC')
      .getRawMany();

    // Group theo tháng
    const monthGroupPromise = this.OrderRepository.createQueryBuilder('order')
      .select("DATE_FORMAT(order.createdAt, '%Y-%m')", 'month')
      .addSelect('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(condition)
      .groupBy('month')
      .addGroupBy('order.status')
      .orderBy('month', 'ASC')
      .addOrderBy('status', 'ASC')
      .getRawMany();

    return Promise.all([statsPromise, statusGroupPromise, dayGroupPromise, weekGroupPromise, monthGroupPromise]).then(([stats, statusGroup, dayGroup, weekGroup, monthGroup]) => ({
      stats,
      statusGroup,
      dayGroup,
      weekGroup,
      monthGroup,
    }));
  }
}
