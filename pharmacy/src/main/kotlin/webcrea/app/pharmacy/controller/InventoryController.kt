package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.entity.Inventory
import webcrea.app.pharmacy.service.InventoryService

@RestController
@RequestMapping("/api/inventories")
class InventoryController(private val inventoryService: InventoryService): MainController<Inventory,Long>(inventoryService) {

    @GetMapping("/inventory-status")
    fun getInventoryStatus(): Mono<String> {
        return inventoryService.checkInventoryStatus()
    }

}