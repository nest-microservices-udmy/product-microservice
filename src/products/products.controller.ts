import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

 
  @MessagePattern( { cmd: 'crear_producto' } )
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create( createProductDto);
  }

 
  @MessagePattern( { cmd: ' traer_todos_los_productos' } )
  findAll( @Payload() paginationDto: PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  }


  @MessagePattern( { cmd: 'traer_producto_por_id' } )
  findOne(@Payload('id') id: string) {
    return this.productsService.findOne(+id);
  }


  @MessagePattern( { cmd: 'actualizar_producto' } )
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  
  @MessagePattern( { cmd: 'actualizar_producto_disponiple' } )
  remove(@Payload('id') id: string) {
    return this.productsService.remove(+id);
  }
}
     