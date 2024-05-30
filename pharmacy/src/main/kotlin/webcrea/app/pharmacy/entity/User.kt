package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("users")
data class User(
    @Id
    val id: Long? = null,
    var username: String,
    var password: String,
    var email: String,
    val createdAt: LocalDateTime ?= LocalDateTime.now(),
    var updatedAt: LocalDateTime ?= LocalDateTime.now()
)
