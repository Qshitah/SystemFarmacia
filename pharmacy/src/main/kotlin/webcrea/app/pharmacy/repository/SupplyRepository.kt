package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import webcrea.app.pharmacy.entity.Supply

interface SupplyRepository : ReactiveCrudRepository<Supply,Long> {
}