package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("supplies")
data class Supply(
    @Id
    val id: Long? = null,
    var supplierId: Long,
    var medicationId: Long,
    var quantity: Int?,
    var cost: Double?,
    val suppliedAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime ?= LocalDateTime.now()
)
