package br.org.institutomaoamiga.api.controller;

import br.org.institutomaoamiga.api.dto.PontoAppResponseDTO;
import br.org.institutomaoamiga.api.service.PontoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/pontos")
@CrossOrigin(origins = "*")
public class PontoController {
    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public Page<PontoAppResponseDTO> listar(
            @PageableDefault(size = 20, sort = "nome") Pageable pageable
    ) {
        return pontoService.listar(pageable);
    }

    @GetMapping("/{id}")
    public PontoAppResponseDTO buscarPorId(@PathVariable UUID id) {
        return pontoService.buscarPorId(id);
    }
}
