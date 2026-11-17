package br.org.institutomaoamiga.api.dto;

import java.util.UUID;

public record PontoAppResponseDTO(
        UUID id,
        String nome,
        String endereco,
        String diasHorarios,
        String recebeDistribui,
        Double latitude,
        Double longitude
) {
}
