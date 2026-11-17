package br.org.institutomaoamiga.api.controller;

import br.org.institutomaoamiga.api.dto.DoacaoRequestDTO;
import br.org.institutomaoamiga.api.dto.DoacaoResponseDTO;
import br.org.institutomaoamiga.api.service.DoacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
public class DoacaoController {
    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @GetMapping
    @Operation(summary = "Lista doações paginadas, filtrando opcionalmente por tipo de item")
    @ApiResponse(responseCode = "200", description = "Página de doações retornada")
    public Page<DoacaoResponseDTO> listar(
            @Parameter(description = "Filtro parcial case-insensitive do tipo do item")
            @RequestParam(required = false) String tipoItem,
            @PageableDefault(
                    size = 10,
                    sort = "criadoEm",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ) {
        return doacaoService.listar(tipoItem, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma doação pelo UUID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doação encontrada"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada")
    })
    public DoacaoResponseDTO buscarPorId(@PathVariable UUID id) {
        return doacaoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastra uma doação")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Doação cadastrada"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public DoacaoResponseDTO cadastrar(@Valid @RequestBody DoacaoRequestDTO request) {
        return doacaoService.cadastrar(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza uma doação sem alterar a data de criação")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doação atualizada"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada")
    })
    public DoacaoResponseDTO atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody DoacaoRequestDTO request
    ) {
        return doacaoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui uma doação")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Doação excluída"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada")
    })
    public void excluir(@PathVariable UUID id) {
        doacaoService.excluir(id);
    }
}
