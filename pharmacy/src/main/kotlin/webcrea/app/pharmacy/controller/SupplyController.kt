package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webcrea.app.pharmacy.entity.Supply
import webcrea.app.pharmacy.service.SupplyService

@RestController
@RequestMapping("/api/supplies")
class SupplyController(private val supplyService: SupplyService):MainController<Supply,Long>(supplyService) {
}