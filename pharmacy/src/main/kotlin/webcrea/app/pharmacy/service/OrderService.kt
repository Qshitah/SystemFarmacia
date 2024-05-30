package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
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

}