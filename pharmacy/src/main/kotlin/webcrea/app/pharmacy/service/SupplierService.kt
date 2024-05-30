package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import webcrea.app.pharmacy.entity.Supplier
import webcrea.app.pharmacy.repository.SupplierRepository
import java.time.LocalDateTime

@Service
class SupplierService(private val supplierRepository:SupplierRepository): MainService<Supplier,Long>(supplierRepository) {

    override fun mergeData(existingData: Supplier, newData: Supplier): Supplier {
        existingData.name = newData.name
        existingData.contactName = newData.contactName ?: existingData.contactName
        existingData.contactEmail = newData.contactEmail ?: existingData.contactEmail
        existingData.contactPhone = newData.contactPhone ?: existingData.contactPhone
        existingData.updatedAt = LocalDateTime.now()
        return existingData
    }
}