package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import webcrea.app.pharmacy.DTO.AddMedicationDTO
import webcrea.app.pharmacy.DTO.MedicationsDTO
import webcrea.app.pharmacy.entity.Inventory
import webcrea.app.pharmacy.entity.Medication
import webcrea.app.pharmacy.exception.MedicationExceptionExist
import webcrea.app.pharmacy.repository.InventoryRepository
import webcrea.app.pharmacy.repository.MedicationRepository
import webcrea.app.pharmacy.repository.SupplierRepository
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class MedicationService(private val medicationRepository: MedicationRepository,private val inventoryRepository: InventoryRepository): MainService<Medication,Long>(medicationRepository) {

    override fun getAllData(): Flux<Medication> {
        return super.getAllData()
            .sort(compareBy{it.expiresAt})
    }

    override fun saveData(data: Medication): Mono<Medication> {
        return medicationRepository.findByReference(data.reference!!)
            .flatMap<Medication> {
                Mono.error(MedicationExceptionExist(data.reference!!))
            }
            .switchIfEmpty(
                super.saveData(data)
            )
    }


    fun getAllDataDTO(): Flux<MedicationsDTO> {
        return medicationRepository.findAll()
            .flatMap { medication ->
                inventoryRepository.findByMedicationId(medication.id ?: 0)
                    .defaultIfEmpty(Inventory(null, medication.id!!, 0))
                    .map { inventory ->
                        MedicationsDTO(medication, inventory)
                    }
            }
    }

    fun getExpiredMedications(): Flux<Medication> {
        val currentDate = LocalDate.now()
        return medicationRepository.findExpiredMedications(currentDate)
    }



    override fun mergeData(existingData: Medication, newData: Medication): Medication {
        existingData.name = newData.name ?: existingData.name
        existingData.reference = newData.reference ?: existingData.reference
        existingData.description = newData.description ?: existingData.description
        existingData.price = newData.price ?: existingData.price
        existingData.dosage = newData.dosage ?: existingData.dosage
        existingData.expiresAt = newData.expiresAt ?: existingData.expiresAt
        existingData.updatedAt = LocalDateTime.now()
        return existingData
    }
}