package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webcrea.app.pharmacy.entity.UserRole
import webcrea.app.pharmacy.service.UserRoleService

@RestController
@RequestMapping("/api/userRoles")
class UserRoleController(private val userRoleService: UserRoleService): MainController<UserRole,Long>(userRoleService) {
}