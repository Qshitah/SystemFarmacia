package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.DTO.AddMedicationDTO
import webcrea.app.pharmacy.DTO.MedicationsDTO
import webcrea.app.pharmacy.entity.Medication
import webcrea.app.pharmacy.service.MedicationService

@RestController
@RequestMapping("/api/medications")
class MedicationController(private val medicationService: MedicationService): MainController<Medication,Long>(medicationService) {


    @GetMapping("/details")
    fun getAllDataDTO(): Flux<MedicationsDTO> {
        return medicationService.getAllDataDTO()
    }

}