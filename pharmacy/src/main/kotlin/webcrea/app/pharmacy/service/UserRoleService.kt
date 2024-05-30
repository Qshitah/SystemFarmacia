package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import webcrea.app.pharmacy.entity.UserRole
import webcrea.app.pharmacy.repository.UserRoleRepository

@Service
class UserRoleService(private val userRoleRepository: UserRoleRepository): MainService<UserRole,Long>(userRoleRepository) {

}