package webcrea.app.pharmacy.exception

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

class MedicationExceptionExist (reference: String) : ResponseStatusException(
    HttpStatus.NOT_IMPLEMENTED, "Medication with reference $reference already exists"
)