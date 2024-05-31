package webcrea.app.pharmacy.DTO

import webcrea.app.pharmacy.entity.Inventory
import webcrea.app.pharmacy.entity.Medication
import webcrea.app.pharmacy.entity.Supplier
import webcrea.app.pharmacy.entity.Supply

data class AddMedicationDTO(
    val medication: Medication,
    val supplier: Supplier,
    val supply: Supply
)
