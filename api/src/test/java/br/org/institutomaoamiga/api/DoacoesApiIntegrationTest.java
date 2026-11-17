package br.org.institutomaoamiga.api;

import br.org.institutomaoamiga.api.entity.Doacao;
import br.org.institutomaoamiga.api.repository.DoacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.datasource.url=jdbc:h2:mem:doacoes-test;DB_CLOSE_DELAY=-1",
                "spring.jpa.hibernate.ddl-auto=create-drop"
        }
)
@TestPropertySource(properties = "spring.data.web.pageable.serialization-mode=via_dto")
class DoacoesApiIntegrationTest {
    private static final ParameterizedTypeReference<Map<String, Object>> JSON_MAP =
            new ParameterizedTypeReference<>() {
            };

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private DoacaoRepository doacaoRepository;

    @BeforeEach
    void limparDoacoes() {
        doacaoRepository.deleteAll();
    }

    @Test
    void listaDoacoesPaginadasComFiltroCaseInsensitiveEOrdemDecrescente() {
        UUID doacaoAntiga = UUID.randomUUID();
        UUID doacaoRecente = UUID.randomUUID();
        LocalDateTime agora = LocalDateTime.now();
        doacaoRepository.saveAll(List.of(
                new Doacao(
                        doacaoAntiga,
                        "Roupas de inverno",
                        2,
                        "Ponto Centro",
                        agora.minusDays(1)
                ),
                new Doacao(
                        UUID.randomUUID(),
                        "Alimentos",
                        4,
                        "Ponto Sul",
                        agora
                ),
                new Doacao(
                        doacaoRecente,
                        "Roupas infantis",
                        3,
                        "Ponto Norte",
                        agora.minusHours(1)
                )
        ));

        ResponseEntity<Map<String, Object>> primeiraPagina = restTemplate.exchange(
                "/api/v1/doacoes?tipoItem=ROUPAS&page=0&size=1",
                HttpMethod.GET,
                null,
                JSON_MAP
        );
        ResponseEntity<Map<String, Object>> segundaPagina = restTemplate.exchange(
                "/api/v1/doacoes?tipoItem=roupas&page=1&size=1",
                HttpMethod.GET,
                null,
                JSON_MAP
        );

        assertThat(primeiraPagina.getStatusCode().value()).isEqualTo(200);
        assertThat(((List<?>) primeiraPagina.getBody().get("content"))).hasSize(1);
        assertThat(((Map<?, ?>) ((List<?>) primeiraPagina.getBody().get("content")).get(0))
                .get("id")).isEqualTo(doacaoRecente.toString());
        assertThat(((Map<?, ?>) primeiraPagina.getBody().get("page"))
                .get("totalElements")).isEqualTo(2);
        assertThat(((Map<?, ?>) ((List<?>) segundaPagina.getBody().get("content")).get(0))
                .get("id")).isEqualTo(doacaoAntiga.toString());
    }

    @Test
    void crudDeDoacaoPreservaDataDeCriacaoNaEdicao() {
        Map<String, Object> novaDoacao = Map.of(
                "tipoItem", "Roupas",
                "quantidade", 2,
                "pontoDestino", "Ponto Centro"
        );
        ResponseEntity<Map<String, Object>> criada = restTemplate.exchange(
                "/api/v1/doacoes",
                HttpMethod.POST,
                jsonRequest(novaDoacao),
                JSON_MAP
        );

        assertThat(criada.getStatusCode().value()).isEqualTo(201);
        assertThat(criada.getBody()).containsKeys(
                "id", "tipoItem", "quantidade", "pontoDestino", "criadoEm"
        );
        String id = criada.getBody().get("id").toString();
        String criadoEm = criada.getBody().get("criadoEm").toString();
        assertThat(LocalDateTime.parse(criadoEm)).isNotNull();

        Map<String, Object> atualizacao = Map.of(
                "tipoItem", "Alimentos",
                "quantidade", 5,
                "pontoDestino", "Ponto Sul"
        );
        ResponseEntity<Map<String, Object>> atualizada = restTemplate.exchange(
                "/api/v1/doacoes/" + id,
                HttpMethod.PUT,
                jsonRequest(atualizacao),
                JSON_MAP
        );

        assertThat(atualizada.getStatusCode().value()).isEqualTo(200);
        assertThat(atualizada.getBody().get("tipoItem")).isEqualTo("Alimentos");
        assertThat(atualizada.getBody().get("quantidade")).isEqualTo(5);
        assertThat(atualizada.getBody().get("criadoEm")).isEqualTo(criadoEm);

        ResponseEntity<Map<String, Object>> consultada = restTemplate.exchange(
                "/api/v1/doacoes/" + id,
                HttpMethod.GET,
                null,
                JSON_MAP
        );
        assertThat(consultada.getStatusCode().value()).isEqualTo(200);
        assertThat(consultada.getBody().get("pontoDestino")).isEqualTo("Ponto Sul");

        ResponseEntity<Void> removida = restTemplate.exchange(
                "/api/v1/doacoes/" + id,
                HttpMethod.DELETE,
                null,
                Void.class
        );
        assertThat(removida.getStatusCode().value()).isEqualTo(204);
        assertThat(restTemplate.getForEntity(
                "/api/v1/doacoes/" + id,
                String.class
        ).getStatusCode().value()).isEqualTo(404);
    }

    @Test
    void validacaoRejeitaCamposVaziosEQuantidadeNaoPositiva() {
        List<Map<String, Object>> invalidos = List.of(
                Map.of("tipoItem", " ", "quantidade", 1, "pontoDestino", "Ponto"),
                Map.of("tipoItem", "Alimentos", "quantidade", 1, "pontoDestino", " "),
                Map.of("tipoItem", "Alimentos", "quantidade", 0, "pontoDestino", "Ponto"),
                Map.of("tipoItem", "Alimentos", "quantidade", -1, "pontoDestino", "Ponto"),
                Map.of("tipoItem", "Alimentos", "pontoDestino", "Ponto")
        );

        for (Map<String, Object> invalido : invalidos) {
            ResponseEntity<String> response = restTemplate.exchange(
                    "/api/v1/doacoes",
                    HttpMethod.POST,
                    jsonRequest(invalido),
                    String.class
            );
            assertThat(response.getStatusCode().value()).isEqualTo(400);
        }
        assertThat(doacaoRepository.count()).isZero();
    }

    @Test
    void consultaEAtualizacaoDeDoacaoInexistenteRespondem404() {
        String idInexistente = UUID.randomUUID().toString();
        Map<String, Object> request = Map.of(
                "tipoItem", "Alimentos",
                "quantidade", 1,
                "pontoDestino", "Ponto"
        );

        ResponseEntity<String> consulta = restTemplate.getForEntity(
                "/api/v1/doacoes/" + idInexistente,
                String.class
        );
        ResponseEntity<String> atualizacao = restTemplate.exchange(
                "/api/v1/doacoes/" + idInexistente,
                HttpMethod.PUT,
                jsonRequest(request),
                String.class
        );

        assertThat(consulta.getStatusCode().value()).isEqualTo(404);
        assertThat(atualizacao.getStatusCode().value()).isEqualTo(404);
    }

    private HttpEntity<Map<String, Object>> jsonRequest(Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return new HttpEntity<>(body, headers);
    }
}
