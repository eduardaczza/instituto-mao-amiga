package br.org.institutomaoamiga.api.service;

import br.org.institutomaoamiga.api.dto.PontoResponseDTO;
import br.org.institutomaoamiga.api.entity.Ponto;
import br.org.institutomaoamiga.api.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class PontoService {
    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public Page<PontoResponseDTO> listar(Pageable pageable) {
        return pontoRepository.findAll(pageable).map(this::toResponse);
    }

    public PontoResponseDTO buscarPorId(UUID id) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado"));
        return toResponse(ponto);
    }

    private PontoResponseDTO toResponse(Ponto ponto) {
        return new PontoResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getDiasHorarios(),
                ponto.getRecebeDistribui(),
                ponto.getLatitude(),
                ponto.getLongitude()
        );
    }
}
