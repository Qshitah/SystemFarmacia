package webcrea.app.pharmacy.DTO

import webcrea.app.pharmacy.entity.Inventory
import webcrea.app.pharmacy.entity.Medication

data class MedicationsDTO(
    val data: Medication,
    val inventory: Inventory
)
