import { BadRequestException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('ProductServices');

  onModuleInit() {
   this.$connect();
   this.logger.log(' DataBase connected')
   
  }

  // #################  ME CREA EL PRODUCTO  #######################

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }


  // ################# TRAIGO TODOS LOS PRODUCTOS ##################

  async findAll( paginationDto: PaginationDto) {

    const { page, limit} = paginationDto;
    const totalPages = await this.product.count({ where: { disponible: true } } );
    const lastPage = Math.ceil( totalPages / limit );

    return {
     data: await this.product.findMany({
       skip:( page - 1 ) * limit,
       take: limit,
       where:{ disponible: true},
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }


  // ################# TRAIGO EL PRODUCTO POR ID #################

  async findOne(id: number ) {
    const productId =  await this.product.findFirst({ 
      where:{ 
        id: id,
        disponible: true, 
      }
    })
    if( !productId )
      throw new RpcException({
    message:`el producto con id: #${id} no esta disponible`,
    status: HttpStatus.BAD_REQUEST,
    })

    return productId
  }


  // ################# ACTUALIZO UN PRODUCTO ##################

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id:__, ...data } = updateProductDto

  
    await this.findOne( id );
    
    const productoActualizado =  this.product.update({
      where:{ id: id},
      data: data,   
    });

    return productoActualizado;
    
  }

  
  // ################ ACTUALIZA LA DISPONIBILIDAD DEL PRODUCTO EN FALSE #################

  async remove(id: number) {

      await this.findOne( id );

      const productoDisponible = await this.product.update({
        where:{ id: id },
        data:{
          disponible: false,
        }
      })
      return productoDisponible
  }
}
  
  