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
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        ponto("Ponto Centro - Praça Cívica", "Praça Cívica, Setor Central, Goiânia - GO", "Setor Central", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos não perecíveis; distribui cestas básicas.",
                                -16.6809365, -49.2563394),
                        ponto("Ponto Mercado Central", "Rua 3, 322, Setor Central, Goiânia - GO", "Setor Central", "coleta",
                                "Segunda a sábado, 8h às 18h",
                                "Recebe alimentos e produtos de higiene; distribui doações às famílias.",
                                -16.6744057, -49.253997),
                        ponto("Ponto Parque Vaca Brava", "Setor Bueno, Goiânia - GO", "Setor Bueno", "distribuição",
                                "Segunda a sexta, 9h às 17h",
                                "Recebe roupas e alimentos; distribui kits de apoio.",
                                -16.7095766, -49.2707637),
                        ponto("Ponto Praça Universitária", "Setor Leste Universitário, Goiânia - GO", "Setor Leste Universitário", "coleta",
                                "Segunda a sexta, 9h às 18h",
                                "Recebe livros e material escolar; distribui kits estudantis.",
                                -16.6770065, -49.2441191),
                        ponto("Ponto Parque Areião", "Setor Pedro Ludovico, Goiânia - GO", "Setor Pedro Ludovico", "distribuição",
                                "Terça e quinta, 8h às 16h",
                                "Recebe alimentos; distribui cestas para moradores da região.",
                                -16.7063337, -49.2556666),
                        ponto("Ponto Parque Mutirama", "Avenida Marginal Botafogo, Setor Central, Goiânia - GO", "Setor Central", "distribuição",
                                "Quarta a domingo, 9h às 17h",
                                "Recebe brinquedos e alimentos; distribui kits infantis.",
                                -16.6649918, -49.2532172),
                        ponto("Ponto Praça Almirante Tamandaré", "Setor Oeste, Goiânia - GO", "Setor Oeste", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe roupas e cobertores; distribui agasalhos no inverno.",
                                -16.6857217, -49.2651674),
                        ponto("Ponto Jardim Zoológico", "Setor Oeste, Goiânia - GO", "Setor Oeste", "distribuição",
                                "Sábado e domingo, 9h às 16h",
                                "Recebe alimentos e produtos de higiene; distribui kits de apoio.",
                                -16.681849, -49.2727962),
                        ponto("Ponto Bosque dos Buritis", "Setor Oeste, Goiânia - GO", "Setor Oeste", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos não perecíveis; distribui cestas básicas.",
                                -16.6818406, -49.2619374),
                        ponto("Ponto Terminal Isidória", "Setor Pedro Ludovico, Goiânia - GO", "Setor Pedro Ludovico", "distribuição",
                                "Segunda a sexta, 7h às 19h",
                                "Recebe alimentos e itens de higiene; encaminha doações a famílias.",
                                -16.7139121, -49.2528401),
                        ponto("Ponto Vila Nova", "Rua 206, Setor Leste Vila Nova, Goiânia - GO", "Setor Leste Vila Nova", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos não perecíveis e produtos de higiene.",
                                -16.6662, -49.2451),
                        ponto("Ponto Jardim América", "Avenida C-104, Jardim América, Goiânia - GO", "Jardim América", "distribuição",
                                "Segunda a sexta, 9h às 17h",
                                "Distribui cestas básicas e roupas para famílias da região.",
                                -16.7181, -49.2842),
                        ponto("Ponto Campinas", "Avenida 24 de Outubro, Campinas, Goiânia - GO", "Campinas", "coleta",
                                "Segunda a sábado, 8h às 18h",
                                "Recebe alimentos, roupas e brinquedos.",
                                -16.6791, -49.2766),
                        ponto("Ponto Setor Bueno", "Rua T-4, Setor Bueno, Goiânia - GO", "Setor Bueno", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos e produtos de higiene para doação.",
                                -16.7035, -49.2721),
                        ponto("Ponto Jardim Goiás", "Avenida E, Jardim Goiás, Goiânia - GO", "Jardim Goiás", "distribuição",
                                "Terça e quinta, 9h às 16h",
                                "Distribui kits de alimentos e higiene.",
                                -16.6996, -49.2382),
                        ponto("Ponto Finsocial", "Rua VF-15, Residencial Finsocial, Goiânia - GO", "Residencial Finsocial", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe roupas, cobertores e alimentos.",
                                -16.6098, -49.3257),
                        ponto("Ponto Jardim Curitiba", "Avenida do Povo, Jardim Curitiba, Goiânia - GO", "Jardim Curitiba", "distribuição",
                                "Segunda a sexta, 9h às 17h",
                                "Distribui doações para famílias atendidas pelo Instituto.",
                                -16.6053, -49.3332),
                        ponto("Ponto Setor Sul", "Rua 90, Setor Sul, Goiânia - GO", "Setor Sul", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos não perecíveis e material escolar.",
                                -16.6873, -49.2494),
                        ponto("Ponto Setor Marista", "Rua 1128, Setor Marista, Goiânia - GO", "Setor Marista", "coleta",
                                "Segunda a sábado, 9h às 18h",
                                "Recebe alimentos, roupas e itens de higiene.",
                                -16.6988, -49.2672),
                        ponto("Ponto Parque das Laranjeiras", "Rua 12, Parque das Laranjeiras, Goiânia - GO", "Parque das Laranjeiras", "distribuição",
                                "Quarta e sexta, 9h às 16h",
                                "Distribui cestas e kits de apoio às famílias.",
                                -16.7351, -49.2267),
                        ponto("Ponto Setor Pedro Ludovico", "Avenida Circular, Setor Pedro Ludovico, Goiânia - GO", "Setor Pedro Ludovico", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos e produtos de higiene.",
                                -16.7148, -49.2573),
                        ponto("Ponto Setor Oeste", "Rua 9, Setor Oeste, Goiânia - GO", "Setor Oeste", "distribuição",
                                "Segunda a sexta, 9h às 17h",
                                "Distribui roupas e alimentos para a comunidade.",
                                -16.6821, -49.2692),
                        ponto("Ponto Leste Universitário", "Rua 235, Setor Leste Universitário, Goiânia - GO", "Setor Leste Universitário", "coleta",
                                "Segunda a sexta, 8h às 18h",
                                "Recebe livros, material escolar e alimentos.",
                                -16.6755, -49.2417),
                        ponto("Ponto Setor Central - Estação", "Avenida Goiás, Setor Central, Goiânia - GO", "Setor Central", "distribuição",
                                "Segunda a sexta, 8h às 17h",
                                "Distribui kits de alimentos e higiene.",
                                -16.6775, -49.2557),
                        ponto("Ponto Jardim Novo Mundo", "Rua 2, Jardim Novo Mundo, Goiânia - GO", "Jardim Novo Mundo", "coleta",
                                "Segunda a sexta, 8h às 17h",
                                "Recebe alimentos não perecíveis, roupas e produtos de higiene.",
                                -16.6502, -49.2218)
                ));
            }

            List<Ponto> pontosExistentes = repository.findAll();
            pontosExistentes.forEach(Ponto::completarCamposCrud);
            repository.saveAll(pontosExistentes);
        };
    }

    private Ponto ponto(
            String nome,
            String endereco,
            String bairro,
            String tipo,
            String diasHorarios,
            String recebeDistribui,
            double latitude,
            double longitude
    ) {
        return new Ponto(
                UUID.randomUUID(),
                nome,
                endereco,
                bairro,
                diasHorarios,
                tipo,
                diasHorarios,
                recebeDistribui,
                latitude,
                longitude
        );
    }
}
