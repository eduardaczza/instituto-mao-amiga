package br.org.institutomaoamiga.api.service;

import br.org.institutomaoamiga.api.dto.DoacaoRequestDTO;
import br.org.institutomaoamiga.api.dto.DoacaoResponseDTO;
import br.org.institutomaoamiga.api.entity.Doacao;
import br.org.institutomaoamiga.api.repository.DoacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class DoacaoService {
    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    @Transactional(readOnly = true)
    public Page<DoacaoResponseDTO> listar(String tipoItem, Pageable pageable) {
        String filtro = normalizarFiltro(tipoItem);
        Page<Doacao> doacoes = filtro == null
                ? doacaoRepository.findAll(pageable)
                : doacaoRepository.findByTipoItemContainingIgnoreCase(filtro, pageable);
        return doacoes.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public DoacaoResponseDTO buscarPorId(UUID id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO request) {
        Doacao doacao = new Doacao(
                UUID.randomUUID(),
                request.tipoItem().trim(),
                request.quantidade(),
                request.pontoDestino().trim(),
                LocalDateTime.now().truncatedTo(ChronoUnit.MICROS)
        );
        return toResponse(doacaoRepository.save(doacao));
    }

    @Transactional
    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO request) {
        Doacao doacao = buscarEntidade(id);
        doacao.atualizarDados(
                request.tipoItem().trim(),
                request.quantidade(),
                request.pontoDestino().trim()
        );
        return toResponse(doacaoRepository.save(doacao));
    }

    @Transactional
    public void excluir(UUID id) {
        doacaoRepository.delete(buscarEntidade(id));
    }

    private Doacao buscarEntidade(UUID id) {
        return doacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Doação não encontrada"
                ));
    }

    private String normalizarFiltro(String filtro) {
        return filtro == null || filtro.isBlank() ? null : filtro.trim();
    }

    private DoacaoResponseDTO toResponse(Doacao doacao) {
        return new DoacaoResponseDTO(
                doacao.getId(),
                doacao.getTipoItem(),
                doacao.getQuantidade(),
                doacao.getPontoDestino(),
                doacao.getCriadoEm()
        );
    }
}
