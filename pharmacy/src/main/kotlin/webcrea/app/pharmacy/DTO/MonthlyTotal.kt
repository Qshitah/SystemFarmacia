package webcrea.app.pharmacy.DTO

import java.time.LocalDateTime

data class MonthlyTotal(
    val monthYear: LocalDateTime,
    val totalAmount: Double
)
