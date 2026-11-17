package br.org.institutomaoamiga.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DoacaoResponseDTO(
        UUID id,
        String tipoItem,
        Integer quantidade,
        String pontoDestino,
        LocalDateTime criadoEm
) {
}
