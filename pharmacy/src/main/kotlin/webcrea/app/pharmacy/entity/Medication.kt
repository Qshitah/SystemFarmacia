package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.Date

@Table("medications")
data class Medication(
    @Id
    val id: Long? = null,
    var name: String?,
    var reference: String?,
    var description: String?,
    var price: BigDecimal?,
    var dosage: String?,
    var expiresAt: LocalDate?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime ?= LocalDateTime.now()
)
