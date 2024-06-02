package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.time.LocalDateTime

@Table("order_items")
data class
OrderItem(
    @Id
    val id: Long? = null,
    val orderId: Long,
    val medicationId: Long,
    val quantity: Int = 1,
    val price: BigDecimal,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
