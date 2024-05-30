package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("suppliers")
data class Supplier(
    @Id
    val id: Long? = null,
    var name: String?,
    var contactName: String?,
    var contactEmail: String?,
    var contactPhone: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime ?= LocalDateTime.now()
)
