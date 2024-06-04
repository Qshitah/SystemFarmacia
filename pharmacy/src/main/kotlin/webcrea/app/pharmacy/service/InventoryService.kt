package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.entity.Inventory
import webcrea.app.pharmacy.repository.InventoryRepository

@Service
class InventoryService(private val inventoryRepository: InventoryRepository): MainService<Inventory,Long>(inventoryRepository) {

    fun checkInventoryStatus(): Mono<String> {
        return inventoryRepository.findByQuantityLessThanEqual(20)
            .collectList()
            .flatMap { items ->
                if (items.isEmpty()) {
                    Mono.just("Good")
                } else {
                    Mono.just("Be Careful")
                }
            }
    }

}