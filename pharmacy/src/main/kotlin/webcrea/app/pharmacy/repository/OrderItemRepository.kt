package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import webcrea.app.pharmacy.entity.OrderItem

interface OrderItemRepository: ReactiveCrudRepository<OrderItem,Long> {
}