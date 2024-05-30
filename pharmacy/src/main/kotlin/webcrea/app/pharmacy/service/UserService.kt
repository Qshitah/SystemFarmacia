package webcrea.app.pharmacy.service

import org.springframework.stereotype.Service
import webcrea.app.pharmacy.entity.User
import webcrea.app.pharmacy.repository.UserRepository
import java.time.LocalDateTime

@Service
class UserService(private val userRepository: UserRepository): MainService<User,Long>(userRepository){

    override fun mergeData(existingData: User, newData: User): User {
        existingData.username = newData.username
        existingData.password = newData.password
        existingData.email = newData.email
        existingData.updatedAt = LocalDateTime.now()
        return existingData
    }
}