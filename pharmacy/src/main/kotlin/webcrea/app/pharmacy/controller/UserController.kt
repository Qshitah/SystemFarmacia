package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webcrea.app.pharmacy.entity.User
import webcrea.app.pharmacy.service.UserService

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService): MainController<User,Long>(userService) {
}