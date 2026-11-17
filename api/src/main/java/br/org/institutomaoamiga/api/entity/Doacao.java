package br.org.institutomaoamiga.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "doacoes")
public class Doacao {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String tipoItem;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private String pontoDestino;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    protected Doacao() {
    }

    public Doacao(
            UUID id,
            String tipoItem,
            Integer quantidade,
            String pontoDestino,
            LocalDateTime criadoEm
    ) {
        this.id = id;
        this.tipoItem = tipoItem;
        this.quantidade = quantidade;
        this.pontoDestino = pontoDestino;
        this.criadoEm = criadoEm;
    }

    public void atualizarDados(String tipoItem, Integer quantidade, String pontoDestino) {
        this.tipoItem = tipoItem;
        this.quantidade = quantidade;
        this.pontoDestino = pontoDestino;
    }
}
