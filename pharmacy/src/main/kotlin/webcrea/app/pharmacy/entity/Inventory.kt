package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("inventory")
data class Inventory(
    @Id
    val id: Long? = null,
    val medicationId: Long,
    val quantity: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime ?= LocalDateTime.now()
)
