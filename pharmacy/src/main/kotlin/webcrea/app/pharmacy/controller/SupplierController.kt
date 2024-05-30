package webcrea.app.pharmacy.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webcrea.app.pharmacy.entity.Supplier
import webcrea.app.pharmacy.service.SupplierService

@RestController
@RequestMapping("/api/suppliers")
class SupplierController(private val supplierService: SupplierService): MainController<Supplier,Long>(supplierService) {
}