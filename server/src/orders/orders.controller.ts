import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto'; // Импортируем наш DTO

@Controller('orders')
export class OrdersController {
  @Post()
  createOrder(@Body() orderData: CreateOrderDto) { // Теперь здесь тип CreateOrderDto
    console.log('Заказ получен:', orderData);
    
    return {
      status: 'success',
      message: `Заказ для ${orderData.customerName || 'клиента'} принят!`,
      orderId: Math.floor(Math.random() * 1000)
    };
  }
}