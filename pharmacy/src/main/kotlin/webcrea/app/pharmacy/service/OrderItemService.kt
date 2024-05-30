package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import webcrea.app.pharmacy.entity.OrderItem
import webcrea.app.pharmacy.repository.OrderItemRepository

@Service
class OrderItemService(private val orderItemRepository: OrderItemRepository): MainService<OrderItem,Long>(orderItemRepository) {
}