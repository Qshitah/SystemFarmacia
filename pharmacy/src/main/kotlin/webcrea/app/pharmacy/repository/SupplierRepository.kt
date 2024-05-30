package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import webcrea.app.pharmacy.entity.Supplier

interface SupplierRepository : ReactiveCrudRepository<Supplier,Long> {
}