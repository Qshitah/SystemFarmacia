package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import webcrea.app.pharmacy.entity.Supply
import webcrea.app.pharmacy.repository.SupplyRepository
import java.time.LocalDateTime

@Service
class SupplyService(private val supplyRepository: SupplyRepository): MainService<Supply,Long>(supplyRepository) {

    override fun mergeData(existingData: Supply, newData: Supply): Supply {
        existingData.supplierId = newData.supplierId
        existingData.medicationId = newData.medicationId
        existingData.quantity = newData.quantity ?: existingData.quantity
        existingData.cost = newData.cost ?: existingData.cost
        existingData.updatedAt = LocalDateTime.now()
        return existingData
    }
}