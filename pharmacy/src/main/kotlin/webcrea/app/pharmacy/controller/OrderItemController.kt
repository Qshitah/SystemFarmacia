package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webcrea.app.pharmacy.entity.OrderItem
import webcrea.app.pharmacy.service.OrderItemService

@RestController
@RequestMapping("/api/orderItems")
class OrderItemController(private val orderItemService:OrderItemService): MainController<OrderItem,Long>(orderItemService) {
}