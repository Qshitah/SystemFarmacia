package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.time.LocalDateTime

@Table("orders")
data class Order(
    @Id
    val id: Long? = null,
    var userId: Long,
    var clientName: String?,
    var clientPhone: String?,
    var clientEmail: String?,
    var totalAmount: BigDecimal?,
    var status: String = "PENDING",
    val createdAt: LocalDateTime = LocalDateTime.now()
)
