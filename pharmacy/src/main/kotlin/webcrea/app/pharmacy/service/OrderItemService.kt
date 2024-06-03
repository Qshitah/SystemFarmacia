package webcrea.app.pharmacy.service

import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.entity.OrderItem
import webcrea.app.pharmacy.repository.OrderItemRepository
import webcrea.app.pharmacy.repository.OrderRepository

@Service
class OrderItemService(private val orderItemRepository: OrderItemRepository,
                        private val orderRepository: OrderRepository): MainService<OrderItem,Long>(orderItemRepository) {

    override fun saveMultipleData(data: MutableList<OrderItem>): Flux<OrderItem> {
        return super.saveMultipleData(data)
            .collectList()
            .flatMapMany { orderItems ->
                val orderId = orderItems.firstOrNull()?.orderId
                if (orderId != null) {
                    val totalAmount = orderItems.sumOf { it.price.toDouble() * it.quantity }
                    updateOrderTotalAmount(orderId, totalAmount)
                        .thenMany(Flux.fromIterable(orderItems))
                } else {
                    Flux.fromIterable(orderItems)
                }
            }
    }

    private fun updateOrderTotalAmount(orderId: Long, totalAmount: Double): Mono<Void> {
        return orderRepository.findById(orderId)
            .flatMap { order ->
                order.totalAmount = totalAmount.toBigDecimal()
                orderRepository.save(order)
            }
            .then()
    }

    fun getDataByOrderId(orderId: Long): Flux<OrderItem> {
        return orderRepository.findById(orderId)
            .flatMapMany { order ->
                orderItemRepository.findByOrderId(order.id!!)
            }
            .switchIfEmpty(Mono.error(ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with ID $orderId not found")))
    }
}