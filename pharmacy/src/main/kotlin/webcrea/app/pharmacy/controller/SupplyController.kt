package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import webcrea.app.pharmacy.DTO.SuppliesDTO
import webcrea.app.pharmacy.entity.Supply
import webcrea.app.pharmacy.service.SupplyService

@RestController
@RequestMapping("/api/supplies")
class SupplyController(private val supplyService: SupplyService):MainController<Supply,Long>(supplyService) {

    @GetMapping("/details")
    fun getAllDetailsSupplies(): Flux<SuppliesDTO>{
        return supplyService.getAllSuppliesDTO()
    }
}