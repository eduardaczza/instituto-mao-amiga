package br.org.institutomaoamiga.api.dto;

import java.util.UUID;

public record PontoResponseDTO(
        UUID id,
        String nome,
        String endereco,
        String bairro,
        String horario,
        String tipo
) {
}
