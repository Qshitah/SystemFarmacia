package webcrea.app.pharmacy.repository

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.DTO.MonthlyTotal
import webcrea.app.pharmacy.entity.Order

interface OrderRepository : ReactiveCrudRepository<Order,Long> {

    @Query("SELECT SUM(total_amount) FROM orders WHERE EXTRACT(MONTH FROM created_at) = :month AND EXTRACT(YEAR FROM created_at) = :year")
    fun calculateTotalAmount(@Param("month") month: Int, @Param("year") year: Int): Mono<Double>

    @Query("""
        SELECT 
            DATE_TRUNC('month', created_at) AS month_year,
            SUM(total_amount) AS total_amount
        FROM orders
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)
    """)
    fun findTotalAmountByMonthYear(): Flux<MonthlyTotal>
}