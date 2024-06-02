package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import webcrea.app.pharmacy.DTO.SuppliesDTO
import webcrea.app.pharmacy.entity.Supply
import webcrea.app.pharmacy.repository.MedicationRepository
import webcrea.app.pharmacy.repository.SupplierRepository
import webcrea.app.pharmacy.repository.SupplyRepository
import java.time.LocalDateTime

@Service
class SupplyService(private val supplyRepository: SupplyRepository,
    private val medicationRepository: MedicationRepository,private val supplierRepository: SupplierRepository ): MainService<Supply,Long>(supplyRepository) {

    override fun mergeData(existingData: Supply, newData: Supply): Supply {
        existingData.supplierId = newData.supplierId
        existingData.medicationId = newData.medicationId
        existingData.quantity = newData.quantity ?: existingData.quantity
        existingData.cost = newData.cost ?: existingData.cost
        existingData.updatedAt = LocalDateTime.now()
        return existingData
    }

    fun getAllSuppliesDTO(): Flux<SuppliesDTO> {
        return supplyRepository.findAll()
            .flatMap { supply ->
                medicationRepository.findById(supply.medicationId)
                    .flatMap { medication ->
                        supplierRepository.findById(supply.supplierId)
                            .map { supplier ->
                                SuppliesDTO(
                                    medication = medication,
                                    supplier = supplier,
                                    supply = supply
                                )
                            }
                    }
            }
            .collectList() // Collect all items into a List
            .map { list ->
                list.sortedByDescending { it.supply.suppliedAt } // Sort the list by the desired field
            }
            .flatMapMany { sortedList ->
                Flux.fromIterable(sortedList) // Convert the sorted list back to a Flux
            }
    }
}