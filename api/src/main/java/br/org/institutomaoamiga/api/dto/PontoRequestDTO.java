package br.org.institutomaoamiga.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PontoRequestDTO(
        @NotBlank(message = "O nome é obrigatório.")
        String nome,

        @NotBlank(message = "O endereço é obrigatório.")
        String endereco,

        @NotBlank(message = "O bairro é obrigatório.")
        String bairro,

        @NotBlank(message = "O horário é obrigatório.")
        String horario,

        @NotBlank(message = "O tipo é obrigatório.")
        @Pattern(regexp = "coleta|distribuição", message = "O tipo deve ser coleta ou distribuição.")
        String tipo
) {
}
