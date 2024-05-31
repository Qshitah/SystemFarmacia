package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.entity.Medication

interface MedicationRepository : ReactiveCrudRepository<Medication,Long> {

    fun findByReference(reference: String):Mono<Medication>
}