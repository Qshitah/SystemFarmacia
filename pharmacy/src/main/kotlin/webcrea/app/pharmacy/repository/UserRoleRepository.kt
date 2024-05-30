package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import webcrea.app.pharmacy.entity.UserRole

interface UserRoleRepository : ReactiveCrudRepository<UserRole,Long> {
}