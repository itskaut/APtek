import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  private readonly products = [
  { id: 1, name: 'Нимесулид Экстра', category: 'Обезболивающие', description: 'Быстро снимает боль и воспаление.', price: 320 },
  { id: 2, name: 'Витамин D3', category: 'Витамины', description: 'Поддержка иммунитета и костей.', price: 690 },
  { id: 3, name: 'Магний Хелат', category: 'Минералы', description: 'Снижает стресс и улучшает сон.', price: 1250},
  { id: 4, name: 'Эриус 5мг', category: 'Аллергия', description: 'Современное средство от аллергии.', price: 540 },
  { id: 5, name: 'Омега-3 Концентрат', category: 'БАДы', description: 'Для сердца и сосудов.', price: 1800 },
  { id: 6, name: 'Мелатонин', category: 'Сон', description: 'Помогает быстрее уснуть.', price: 450 },
  { id: 7, name: 'Аскорбинка', category: 'Витамины', description: 'Классический вкус детства.', price: 50 },
  { id: 8, name: 'Пантенол спрей', category: 'Кожа', description: 'Восстановление при ожогах.', price: 420},
  { id: 9, name: 'ДезГриппин', category: 'ОРВИ', description: 'Помогает при простуде', price: 550},
  { id: 10, name: 'Лапоритмин', category: 'Сердечно-сосудистые', description: 'Наджелудочковая и желудочковая экстрасистолия', price: 1200}
];

  @Get()
  getAll() {
    return this.products;
  }
}