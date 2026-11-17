package br.org.institutomaoamiga.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "pontos")
public class Ponto {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, length = 500)
    private String endereco;

    private String bairro;

    private String horario;

    private String tipo;

    @Column(nullable = false)
    private String diasHorarios;

    @Column(nullable = false, length = 1000)
    private String recebeDistribui;

    private Double latitude;

    private Double longitude;

    protected Ponto() {
    }

    public Ponto(
            UUID id,
            String nome,
            String endereco,
            String bairro,
            String horario,
            String tipo,
            String diasHorarios,
            String recebeDistribui,
            Double latitude,
            Double longitude
    ) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.horario = horario;
        this.tipo = tipo;
        this.diasHorarios = diasHorarios;
        this.recebeDistribui = recebeDistribui;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void atualizarDados(
            String nome,
            String endereco,
            String bairro,
            String horario,
            String tipo
    ) {
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.horario = horario;
        this.tipo = tipo;
        this.diasHorarios = horario;
        this.recebeDistribui = descricaoTipo(tipo);
    }

    public void completarCamposCrud() {
        if (bairro == null || bairro.isBlank()) {
            bairro = "Goiânia";
        }
        if (horario == null || horario.isBlank()) {
            horario = diasHorarios;
        }
        if (tipo == null || tipo.isBlank()) {
            tipo = "coleta";
        }
    }

    public static String descricaoTipo(String tipo) {
        return "coleta".equals(tipo)
                ? "Recebe doações para o Instituto Mão Amiga."
                : "Distribui doações para as famílias atendidas.";
    }
}
