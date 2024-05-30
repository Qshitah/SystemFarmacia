package webcrea.app.pharmacy.repository

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import webcrea.app.pharmacy.entity.User

interface UserRepository : ReactiveCrudRepository<User,Long>  {
}