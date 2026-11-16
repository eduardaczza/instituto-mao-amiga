package br.org.institutomaoamiga.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "pontos")
public class Ponto {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, length = 500)
    private String endereco;

    @Column(nullable = false)
    private String diasHorarios;

    @Column(nullable = false, length = 1000)
    private String recebeDistribui;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    protected Ponto() {
    }

    public Ponto(
            UUID id,
            String nome,
            String endereco,
            String diasHorarios,
            String recebeDistribui,
            Double latitude,
            Double longitude
    ) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.diasHorarios = diasHorarios;
        this.recebeDistribui = recebeDistribui;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public String getDiasHorarios() {
        return diasHorarios;
    }

    public String getRecebeDistribui() {
        return recebeDistribui;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }
}
