import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CheckAndCreateWarehouseAndDetailDto, CreateWarehouseDetailDto, CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseDetailRepositoryInterface, WarehouseRepositoryInterface } from 'src/database/interface';
import { AxiosInsService } from '@modules/axiosIns/axiosIns.service';
import { messageResponseError } from '@common/constants';
import { OrderUnitConstant } from '@common/constants/order.constant';
import { PaginationDto } from '@common/decorators';

@Injectable()
export class WarehouseService implements OnModuleInit {
  constructor(
    @Inject('WarehouseRepositoryInterface')
    private readonly warehouseRepository: WarehouseRepositoryInterface,
    @Inject('WarehouseDetailRepositoryInterface')
    private readonly warehouseDetailRepositoryInterface: WarehouseDetailRepositoryInterface,
    private readonly axiosInsService: AxiosInsService,
  ) {}

  // onModuleInit() {}

  async onModuleInit() {
    const [dataViettel, dataGHN, dataGHTK, dataSS] = await Promise.all([
      (await (await this.axiosInsService.axiosInstanceViettel()).get('/v2/user/listInventory')).data,
      (await (await this.axiosInsService.axiosInstanceGHN()).get('/v2/shop/all')).data,
      (await (await this.axiosInsService.axiosInstanceGHTK()).get('/services/shipment/list_pick_add')).data,
      (await (await this.axiosInsService.axiosInstanceSuperShip()).get('/v1/partner/warehouses')).data,
    ]);
    console.log('🚀 ~ WarehouseService ~ onModuleInit ~ dataViettel:', dataViettel);

    const dataWareHouse: CheckAndCreateWarehouseAndDetailDto[] = [];
    dataViettel?.data?.forEach((i) => {
      console.log('🚀 ~ WarehouseService ~ dataViettel?.data?.forEach ~ i:', i);
      dataWareHouse.push({
        name: i.name,
        address: i.address,
        phone: i.phone,
        personCharge: i?.personCharge,
        province: i.province,
        district: i.district,
        ward: i.ward,
        details: [
          {
            type: OrderUnitConstant.VIETTEL,
            code: i.shop_id,
            cusId: i.cusId,
            provinceId: i.provinceId,
            districtId: i.districtId,
            wardId: i.wardsId,
          },
        ],
      });
    });

    dataGHN?.data?.shops?.forEach((i) => {
      const checkWareHouse = dataWareHouse.find((ware) => ware.name === i.name);
      if (checkWareHouse) {
        checkWareHouse.address = i.address || checkWareHouse.address;
        checkWareHouse.province = i.province_name || checkWareHouse.province;
        checkWareHouse.district = i.district_name || checkWareHouse.district;
        checkWareHouse.ward = i.ward_name || checkWareHouse.ward;
        checkWareHouse.details.push({
          type: OrderUnitConstant.GHN,
          code: i._id,
          cusId: i.client_id,
          provinceId: '',
          districtId: i.district_id,
          wardId: i.ward_code,
        });
      } else {
        dataWareHouse.push({
          name: i.name,
          address: i.address,
          phone: i.phone,
          personCharge: i?.personCharge,
          province: i?.province,
          district: i?.district,
          ward: i?.ward,
          details: [
            {
              type: OrderUnitConstant.GHN,
              code: i._id,
              cusId: i.client_id,
              provinceId: '',
              districtId: i.district_id,
              wardId: i.ward_code,
            },
          ],
        });
      }
    });

    dataGHTK?.data?.forEach((i) => {
      const checkWareHouse = dataWareHouse.find((ware) => ware.name === i.pick_name);
      const dataAddress: string[] = i.address.split(',');
      const province = dataAddress[dataAddress.length - 1]?.trim();
      const district = dataAddress.find((item) => item.includes('Huyện') || item.includes('Quận'))?.trim();
      const ward = dataAddress.find((item) => item.includes('Xã') || item.includes('Phường'))?.trim();
      if (checkWareHouse) {
        checkWareHouse.address = i.address || checkWareHouse.address;
        checkWareHouse.province = province || checkWareHouse.province;
        checkWareHouse.district = district || checkWareHouse.district;
        checkWareHouse.ward = ward || checkWareHouse.ward;
        checkWareHouse.details.push({
          type: OrderUnitConstant.GHTK,
          code: i.pick_address_id,
          cusId: '',
          provinceId: province,
          districtId: district,
          wardId: ward,
        });
      } else {
        dataWareHouse.push({
          name: i.pick_name,
          address: i.address,
          phone: i.pick_tel,
          personCharge: i?.personCharge,
          province: province,
          district: district,
          ward: ward,
          details: [
            {
              type: OrderUnitConstant.GHTK,
              code: i.pick_address_id,
              cusId: '',
              provinceId: '',
              districtId: '',
              wardId: '',
            },
          ],
        });
      }
    });

    dataSS?.results?.forEach((i) => {
      const checkWareHouse = dataWareHouse.find((ware) => ware.name === i.name);
      const dataAddress: string[] = i.formatted_address.split(',');
      const province = dataAddress[dataAddress.length - 1]?.trim();
      const district = dataAddress.find((item) => item.includes('Huyện') || item.includes('Quận'))?.trim();
      const ward = dataAddress.find((item) => item.includes('Xã') || item.includes('Phường'))?.trim();
      if (checkWareHouse) {
        checkWareHouse.details.push({
          type: OrderUnitConstant.SUPERSHIP,
          code: i.code,
          cusId: '',
          provinceId: province || checkWareHouse.province,
          districtId: district || checkWareHouse.district,
          wardId: ward || checkWareHouse.ward,
        });
      } else {
        dataWareHouse.push({
          name: i.name,
          address: i.formatted_address,
          phone: '',
          personCharge: '',
          province: province,
          district: district,
          ward: ward,
          details: [
            {
              type: OrderUnitConstant.SUPERSHIP,
              code: i.code,
              cusId: '',
              provinceId: '',
              districtId: '',
              wardId: '',
            },
          ],
        });
      }
    });
    return this.checkAndCreateWarehouseByName(dataWareHouse);
  }

  async checkAndCreateWarehouseByName(dto: CheckAndCreateWarehouseAndDetailDto[]) {
    return Promise.all(
      dto.map(async (i) => {
        let warehouse = await this.warehouseRepository.findOneByCondition({
          name: i.name,
        });
        if (!warehouse) {
          warehouse = await this.warehouseRepository.create(i);
        } else {
          await Promise.all(
            i.details.map(async (detail) => {
              const warehouseDetail = await this.warehouseDetailRepositoryInterface.findOneByCondition({
                code: detail.code,
                type: detail.type,
              });
              if (!warehouseDetail) {
                return this.warehouseDetailRepositoryInterface.create({
                  ...detail,
                  warehouseId: warehouse.id,
                });
              }
            }),
          );
        }
        return true;
      }),
    );
  }

  findAll(pagination: PaginationDto) {
    return this.warehouseRepository.findAll({}, pagination);
  }

  async create(dto: CreateWarehouseDto) {
    const checkDuplicate = await this.warehouseRepository.findOneByCondition({
      name: dto.name,
    });
    if (checkDuplicate) {
      throw new Error(messageResponseError.warehouse.warehouse_duplicate);
    }
    return this.warehouseRepository.create(dto);
  }

  async createWarehouseDetail(dto: CreateWarehouseDetailDto) {
    try {
      const checkDuplicate = await this.warehouseDetailRepositoryInterface.findOneByCondition({
        code: dto.code,
        type: dto.type,
      });
      if (checkDuplicate) {
        throw new Error(messageResponseError.warehouse.warehouse_detail_duplicate);
      }
      const warehouse = await this.warehouseRepository.findOneByCondition({
        id: dto.warehouseId,
      });
      let codeWarehouseDetail = '';
      let cusIdWarehouseDetail = '';
      switch (dto.type) {
        case 'Viettel':
          const resVT = (
            await (
              await this.axiosInsService.axiosInstanceViettel()
            ).post('/v2/user/registerInventory', {
              PHONE: warehouse.phone,
              NAME: warehouse.name,
              ADDRESS: warehouse.address,
              WARDS_ID: dto.wardId,
            })
          ).data;
          codeWarehouseDetail = resVT?.data[0]?.groupaddressId;
          cusIdWarehouseDetail = resVT?.data[0]?.cusId;
          break;

        case 'GHN':
          const resGHN = (
            await (
              await this.axiosInsService.axiosInstanceGHN()
            ).post('/v2/shop/register', {
              name: warehouse.name,
              address: warehouse.address,
              phone: warehouse.phone,
              district_id: dto.districtId,
              ward_code: dto.wardId,
            })
          ).data;
          codeWarehouseDetail = resGHN?.data?.shop_id;
          break;
        case 'GHTK':
          break;
        case 'SuperShip':
          const dataSS = (
            await (
              await this.axiosInsService.axiosInstanceSuperShip()
            ).post('/v1/partner/warehouses/create', {
              name: warehouse.name,
              phone: warehouse.phone,
              contact: warehouse.personCharge,
              address: warehouse.address?.split(',')[0]?.trim(),
              province: warehouse.province,
              district: warehouse.district,
              commune: warehouse.ward,
              primary: 1,
            })
          ).data;

          codeWarehouseDetail = dataSS?.results?.code;
        default:
          break;
      }
      return this.warehouseDetailRepositoryInterface.create({
        ...dto,
        code: codeWarehouseDetail,
        cusId: cusIdWarehouseDetail,
      });
    } catch (error) {
      console.log('🚀 ~ WarehouseService ~ createWarehouseDetail ~ error:', error);
      throw new Error(error?.message);
    }
  }

  async getWWarehouseById(id: string) {
    return this.warehouseRepository.findOneById(id);
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.warehouseRepository.findOneById(id);
    if (!warehouse) throw new Error(messageResponseError.warehouse.warehouse_not_found);
    return this.warehouseRepository.findByIdAndUpdate(id, {
      address: warehouse.address || updateWarehouseDto.address,
      province: warehouse.province || updateWarehouseDto.province,
      district: warehouse.district || updateWarehouseDto.district,
      ward: warehouse.ward || updateWarehouseDto.ward,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} warehouse`;
  }
}
