package br.org.institutomaoamiga.api.service;

import br.org.institutomaoamiga.api.dto.PontoAppResponseDTO;
import br.org.institutomaoamiga.api.dto.PontoResponseDTO;
import br.org.institutomaoamiga.api.dto.PontoRequestDTO;
import br.org.institutomaoamiga.api.entity.Ponto;
import br.org.institutomaoamiga.api.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.List;

@Service
public class PontoService {
    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public Page<PontoAppResponseDTO> listar(Pageable pageable) {
        return pontoRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<PontoAppResponseDTO> buscarPorNome(String nome, Pageable pageable) {
        return pontoRepository.buscarPaginado(normalizarFiltro(nome), null, pageable)
                .map(this::toResponse);
    }

    public Page<PontoResponseDTO> listarPaginado(String nome, String bairro, Pageable pageable) {
        String nomeNormalizado = normalizarFiltro(nome);
        String bairroNormalizado = normalizarFiltro(bairro);
        return pontoRepository.buscarPaginado(nomeNormalizado, bairroNormalizado, pageable)
                .map(this::toCrudResponse);
    }

    public PontoAppResponseDTO buscarPorId(UUID id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<PontoResponseDTO> listarTodos() {
        return pontoRepository.findAll().stream()
                .map(this::toCrudResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PontoResponseDTO buscarCrudPorId(UUID id) {
        return toCrudResponse(buscarEntidade(id));
    }

    @Transactional
    public PontoResponseDTO cadastrar(PontoRequestDTO request) {
        Ponto ponto = new Ponto(
                UUID.randomUUID(),
                request.nome().trim(),
                request.endereco().trim(),
                request.bairro().trim(),
                request.horario().trim(),
                request.tipo(),
                request.horario().trim(),
                Ponto.descricaoTipo(request.tipo()),
                null,
                null
        );
        return toCrudResponse(pontoRepository.save(ponto));
    }

    @Transactional
    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO request) {
        Ponto ponto = buscarEntidade(id);
        ponto.atualizarDados(
                request.nome().trim(),
                request.endereco().trim(),
                request.bairro().trim(),
                request.horario().trim(),
                request.tipo()
        );
        return toCrudResponse(pontoRepository.save(ponto));
    }

    @Transactional
    public void excluir(UUID id) {
        Ponto ponto = buscarEntidade(id);
        pontoRepository.delete(ponto);
    }

    private Ponto buscarEntidade(UUID id) {
        return pontoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ponto não encontrado"
                ));
    }

    private String normalizarFiltro(String filtro) {
        return filtro == null || filtro.isBlank() ? null : filtro.trim();
    }

    private PontoAppResponseDTO toResponse(Ponto ponto) {
        return new PontoAppResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getDiasHorarios(),
                ponto.getRecebeDistribui(),
                ponto.getLatitude(),
                ponto.getLongitude()
        );
    }

    private PontoResponseDTO toCrudResponse(Ponto ponto) {
        return new PontoResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getBairro(),
                ponto.getHorario(),
                ponto.getTipo()
        );
    }
}
