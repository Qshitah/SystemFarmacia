package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import webcrea.app.pharmacy.entity.Inventory
import webcrea.app.pharmacy.repository.InventoryRepository

@Service
class InventoryService(private val inventoryRepository: InventoryRepository): MainService<Inventory,Long>(inventoryRepository) {


}