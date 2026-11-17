package br.org.institutomaoamiga.api.controller;

import br.org.institutomaoamiga.api.dto.PontoResponseDTO;
import br.org.institutomaoamiga.api.dto.PontoRequestDTO;
import br.org.institutomaoamiga.api.service.PontoService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
public class PontoCrudController {
    private final PontoService pontoService;

    public PontoCrudController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    @Operation(summary = "Lista todos os pontos de coleta")
    @ApiResponse(responseCode = "200", description = "Lista de pontos retornada")
    public List<PontoResponseDTO> listar() {
        return pontoService.listarTodos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um ponto pelo UUID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ponto encontrado"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
    })
    public PontoResponseDTO buscarPorId(@PathVariable UUID id) {
        return pontoService.buscarCrudPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastra um ponto")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ponto cadastrado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public PontoResponseDTO cadastrar(@Valid @RequestBody PontoRequestDTO request) {
        return pontoService.cadastrar(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um ponto")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ponto atualizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
    })
    public PontoResponseDTO atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody PontoRequestDTO request
    ) {
        return pontoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui um ponto")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Ponto excluído"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
    })
    public void excluir(@PathVariable UUID id) {
        pontoService.excluir(id);
    }
}
