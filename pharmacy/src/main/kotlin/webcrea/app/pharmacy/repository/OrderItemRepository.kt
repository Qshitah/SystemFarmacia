package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import webcrea.app.pharmacy.entity.Order
import webcrea.app.pharmacy.entity.OrderItem

interface OrderItemRepository: ReactiveCrudRepository<OrderItem,Long> {

    fun findByOrderId(orderId:Long): Flux<OrderItem>
}