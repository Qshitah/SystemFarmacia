package webcrea.app.pharmacy.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("user_role")
data class UserRole(
    @Id
    val id: Long? = null,
    val roleName: String = "EMPLOYEE", // Default value is 'EMPLOYEE'
    val userId: Long // Foreign key referencing users table
)