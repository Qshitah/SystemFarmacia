package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.DTO.MonthlyTotal
import webcrea.app.pharmacy.entity.Order
import webcrea.app.pharmacy.service.OrderService

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService): MainController<Order,Long>(orderService) {

    @GetMapping("/total")
    fun getTotalAmount(@RequestParam month: Int, @RequestParam year: Int): Mono<Double> {
        return orderService.getTotalAmountForMonthAndYear(month, year)
    }

    @GetMapping("/total-month")
    fun getTotalAmountByMonthYear(): Flux<MonthlyTotal> {
        return orderService.getTotalAmountByMonthYear()
    }
}