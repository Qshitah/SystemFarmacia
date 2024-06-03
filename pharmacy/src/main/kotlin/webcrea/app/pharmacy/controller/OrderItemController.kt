package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import webcrea.app.pharmacy.entity.OrderItem
import webcrea.app.pharmacy.service.OrderItemService

@RestController
@RequestMapping("/api/orderItems")
class OrderItemController(private val orderItemService:OrderItemService): MainController<OrderItem,Long>(orderItemService) {

    @GetMapping("/order/{id}")
    fun getDataByOrderId(@PathVariable id:Long): Flux<OrderItem>{
        return orderItemService.getDataByOrderId(id)
    }
}