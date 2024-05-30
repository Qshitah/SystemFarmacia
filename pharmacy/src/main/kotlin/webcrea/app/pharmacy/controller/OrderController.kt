package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webcrea.app.pharmacy.entity.Order
import webcrea.app.pharmacy.service.OrderService

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService): MainController<Order,Long>(orderService) {
}