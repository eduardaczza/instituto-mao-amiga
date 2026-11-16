package br.org.institutomaoamiga.api.config;

import br.org.institutomaoamiga.api.entity.Ponto;
import br.org.institutomaoamiga.api.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.UUID;

@Configuration
public class CargaInicial {
    @Bean
    CommandLineRunner carregarPontos(PontoRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            repository.saveAll(List.of(
                    ponto("Ponto Centro - Praça Cívica", "Praça Cívica, Setor Central, Goiânia - GO",
                            "Segunda a sexta, 8h às 17h",
                            "Recebe alimentos não perecíveis; distribui cestas básicas.",
                            -16.6809365, -49.2563394),
                    ponto("Ponto Mercado Central", "Rua 3, 322, Setor Central, Goiânia - GO",
                            "Segunda a sábado, 8h às 18h",
                            "Recebe alimentos e produtos de higiene; distribui doações às famílias.",
                            -16.6744057, -49.253997),
                    ponto("Ponto Parque Vaca Brava", "Setor Bueno, Goiânia - GO",
                            "Segunda a sexta, 9h às 17h",
                            "Recebe roupas e alimentos; distribui kits de apoio.",
                            -16.7095766, -49.2707637),
                    ponto("Ponto Praça Universitária", "Setor Leste Universitário, Goiânia - GO",
                            "Segunda a sexta, 9h às 18h",
                            "Recebe livros e material escolar; distribui kits estudantis.",
                            -16.6770065, -49.2441191),
                    ponto("Ponto Parque Areião", "Setor Pedro Ludovico, Goiânia - GO",
                            "Terça e quinta, 8h às 16h",
                            "Recebe alimentos; distribui cestas para moradores da região.",
                            -16.7063337, -49.2556666),
                    ponto("Ponto Parque Mutirama", "Avenida Marginal Botafogo, Setor Central, Goiânia - GO",
                            "Quarta a domingo, 9h às 17h",
                            "Recebe brinquedos e alimentos; distribui kits infantis.",
                            -16.6649918, -49.2532172),
                    ponto("Ponto Praça Almirante Tamandaré", "Setor Oeste, Goiânia - GO",
                            "Segunda a sexta, 8h às 17h",
                            "Recebe roupas e cobertores; distribui agasalhos no inverno.",
                            -16.6857217, -49.2651674),
                    ponto("Ponto Jardim Zoológico", "Setor Oeste, Goiânia - GO",
                            "Sábado e domingo, 9h às 16h",
                            "Recebe alimentos e produtos de higiene; distribui kits de apoio.",
                            -16.681849, -49.2727962),
                    ponto("Ponto Bosque dos Buritis", "Setor Oeste, Goiânia - GO",
                            "Segunda a sexta, 8h às 17h",
                            "Recebe alimentos não perecíveis; distribui cestas básicas.",
                            -16.6818406, -49.2619374),
                    ponto("Ponto Terminal Isidória", "Setor Pedro Ludovico, Goiânia - GO",
                            "Segunda a sexta, 7h às 19h",
                            "Recebe alimentos e itens de higiene; encaminha doações a famílias.",
                            -16.7139121, -49.2528401)
            ));
        };
    }

    private Ponto ponto(
            String nome,
            String endereco,
            String diasHorarios,
            String recebeDistribui,
            double latitude,
            double longitude
    ) {
        return new Ponto(
                UUID.randomUUID(),
                nome,
                endereco,
                diasHorarios,
                recebeDistribui,
                latitude,
                longitude
        );
    }
}
