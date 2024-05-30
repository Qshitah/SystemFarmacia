package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.entity.Inventory

interface InventoryRepository : ReactiveCrudRepository<Inventory,Long> {

    fun findByMedicationId(id: Long):Mono<Inventory>
}