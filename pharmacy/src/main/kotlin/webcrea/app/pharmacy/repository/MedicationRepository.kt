package webcrea.app.pharmacy.repository

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.entity.Medication
import java.time.LocalDate

interface MedicationRepository : ReactiveCrudRepository<Medication,Long> {

    fun findByReference(reference: String):Mono<Medication>

    @Query("SELECT * FROM medications WHERE expires_at < :currentDate")
    fun findExpiredMedications(currentDate: LocalDate): Flux<Medication>
}