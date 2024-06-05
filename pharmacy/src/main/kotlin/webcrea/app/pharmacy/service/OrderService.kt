package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.DTO.MonthlyTotal
import webcrea.app.pharmacy.entity.Order
import webcrea.app.pharmacy.repository.OrderRepository

@Service
class OrderService(private val orderRepository: OrderRepository): MainService<Order,Long>(orderRepository) {

    override fun mergeData(existingData: Order, newData: Order): Order {
        existingData.userId = newData.userId
        existingData.clientName = newData.clientName ?: existingData.clientName
        existingData.clientPhone = newData.clientPhone ?: existingData.clientPhone
        existingData.clientEmail = newData.clientEmail ?: existingData.clientEmail
        existingData.totalAmount = newData.totalAmount ?: existingData.totalAmount
        existingData.status = newData.status
        return existingData
    }

    override fun getAllData(): Flux<Order> {
        return super.getAllData()
            .sort(compareByDescending { it.createdAt })
    }

    fun getTotalAmountForMonthAndYear(month: Int, year: Int): Mono<Double> {
        return orderRepository.calculateTotalAmount(month, year)
            .switchIfEmpty(Mono.just(0.0))
    }


    fun getTotalAmountByMonthYear(): Flux<MonthlyTotal> {
        return orderRepository.findTotalAmountByMonthYear()
    }


}