package webcrea.app.pharmacy.controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import webcrea.app.pharmacy.service.MainService


abstract class MainController<T: Any,ID: Any>(private val service: MainService<T,ID>) {

    @GetMapping("")
    fun getAllData(): Flux<T>{
        return service.getAllData()
    }

    @GetMapping("/{id}")
    fun getData(@PathVariable id:ID): Mono<T>{
       return service.getData(id)

    }

    @PostMapping("")
    fun saveData(@RequestBody data: T): Mono<T>{
        return  service.saveData(data)

    }

    @PostMapping("/multiple")
    fun saveMultipleData(@RequestBody data: MutableList<T>):Flux<T>{
        return service.saveMultipleData(data)

    }

    @PutMapping("/{id}")
    fun updateData(@PathVariable id:ID, @RequestBody data: T): Mono<T>{
        return service.updateData(id,data)
    }

    @DeleteMapping("/{id}")
    fun deleteData(@PathVariable id:ID): Mono<Void>{
        return service.deleteData(id)
    }




}