package br.org.institutomaoamiga.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.datasource.url=jdbc:h2:mem:pontos-test;DB_CLOSE_DELAY=-1",
                "spring.jpa.hibernate.ddl-auto=create-drop"
        }
)
@TestPropertySource(properties = "spring.data.web.pageable.serialization-mode=via_dto")
class PontosApiIntegrationTest {
    private static final ParameterizedTypeReference<Map<String, Object>> JSON_MAP =
            new ParameterizedTypeReference<>() {
            };

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void listaPontosEmPaginaComContentEPage() {
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                "/pontos?page=0&size=3&sort=nome,asc",
                HttpMethod.GET,
                null,
                JSON_MAP
        );

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsKeys("content", "page");
        List<?> content = (List<?>) response.getBody().get("content");
        assertThat(content).hasSize(3);
        Map<?, ?> ponto = (Map<?, ?>) content.get(0);
        assertThat(ponto.keySet().containsAll(List.of(
                "id",
                "nome",
                "endereco",
                "diasHorarios",
                "recebeDistribui",
                "latitude",
                "longitude"
        ))).isTrue();
        Map<?, ?> metadata = (Map<?, ?>) response.getBody().get("page");
        assertThat(metadata.get("size")).isEqualTo(3);
        assertThat(metadata.get("number")).isEqualTo(0);
        assertThat(metadata.get("totalElements")).isEqualTo(10);
    }

    @Test
    void usaTamanhoPadraoDeVinteEImpedeMaisDeCinquentaItens() {
        ResponseEntity<Map<String, Object>> padrao = restTemplate.exchange(
                "/pontos",
                HttpMethod.GET,
                null,
                JSON_MAP
        );
        ResponseEntity<Map<String, Object>> limite = restTemplate.exchange(
                "/pontos?size=100",
                HttpMethod.GET,
                null,
                JSON_MAP
        );

        assertThat(((Map<?, ?>) padrao.getBody().get("page")).get("size")).isEqualTo(20);
        assertThat(((Map<?, ?>) limite.getBody().get("page")).get("size")).isEqualTo(50);
    }

    @Test
    void pontoInexistenteResponde404() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "/pontos/00000000-0000-0000-0000-000000000000",
                String.class
        );

        assertThat(response.getStatusCode().value()).isEqualTo(404);
    }

    @Test
    void crudDePontoCriaConsultaAtualizaEExclui() {
        Map<String, String> novoPonto = Map.of(
                "nome", "Ponto de teste",
                "endereco", "Rua de teste, 100",
                "bairro", "Setor de teste",
                "horario", "Segunda a sexta, 8h às 17h",
                "tipo", "coleta"
        );

        ResponseEntity<Map<String, Object>> criado = restTemplate.exchange(
                "/api/v1/pontos",
                HttpMethod.POST,
                jsonRequest(novoPonto),
                JSON_MAP
        );

        assertThat(criado.getStatusCode().value()).isEqualTo(201);
        assertThat(criado.getBody()).containsKeys(
                "id", "nome", "endereco", "bairro", "horario", "tipo"
        );
        String id = criado.getBody().get("id").toString();

        ResponseEntity<Map<String, Object>> consultado = restTemplate.exchange(
                "/api/v1/pontos/" + id,
                HttpMethod.GET,
                null,
                JSON_MAP
        );
        assertThat(consultado.getStatusCode().value()).isEqualTo(200);
        assertThat(consultado.getBody().get("nome")).isEqualTo("Ponto de teste");

        Map<String, String> atualizado = Map.of(
                "nome", "Ponto atualizado",
                "endereco", "Rua atualizada, 200",
                "bairro", "Novo setor",
                "horario", "Sábado, 9h às 13h",
                "tipo", "distribuição"
        );
        ResponseEntity<Map<String, Object>> respostaAtualizacao = restTemplate.exchange(
                "/api/v1/pontos/" + id,
                HttpMethod.PUT,
                jsonRequest(atualizado),
                JSON_MAP
        );
        assertThat(respostaAtualizacao.getStatusCode().value()).isEqualTo(200);
        assertThat(respostaAtualizacao.getBody().get("nome")).isEqualTo("Ponto atualizado");
        assertThat(respostaAtualizacao.getBody().get("tipo")).isEqualTo("distribuição");

        ResponseEntity<Void> removido = restTemplate.exchange(
                "/api/v1/pontos/" + id,
                HttpMethod.DELETE,
                null,
                Void.class
        );
        assertThat(removido.getStatusCode().value()).isEqualTo(204);
        assertThat(restTemplate.getForEntity(
                "/api/v1/pontos/" + id,
                String.class
        ).getStatusCode().value()).isEqualTo(404);
    }

    @Test
    void camposVaziosRespondem400SemGravarOuAlterarDados() {
        Map<String, String> invalido = Map.of(
                "nome", " ",
                "endereco", "Rua de teste, 100",
                "bairro", "Setor de teste",
                "horario", "Segunda a sexta",
                "tipo", "coleta"
        );
        long totalAntes = totalPontos();

        ResponseEntity<String> criacao = restTemplate.postForEntity(
                "/api/v1/pontos",
                jsonRequest(invalido),
                String.class
        );

        assertThat(criacao.getStatusCode().value()).isEqualTo(400);
        assertThat(totalPontos()).isEqualTo(totalAntes);

        Map<String, String> valido = Map.of(
                "nome", "Ponto que deve permanecer",
                "endereco", "Rua de teste, 100",
                "bairro", "Setor de teste",
                "horario", "Segunda a sexta",
                "tipo", "coleta"
        );
        ResponseEntity<Map<String, Object>> criado = restTemplate.exchange(
                "/api/v1/pontos",
                HttpMethod.POST,
                jsonRequest(valido),
                JSON_MAP
        );
        String id = criado.getBody().get("id").toString();

        ResponseEntity<String> atualizacao = restTemplate.exchange(
                "/api/v1/pontos/" + id,
                HttpMethod.PUT,
                jsonRequest(invalido),
                String.class
        );

        assertThat(atualizacao.getStatusCode().value()).isEqualTo(400);
        ResponseEntity<Map<String, Object>> pontoSemAlteracao = restTemplate.exchange(
                "/api/v1/pontos/" + id,
                HttpMethod.GET,
                null,
                JSON_MAP
        );
        assertThat(pontoSemAlteracao.getBody().get("nome"))
                .isEqualTo("Ponto que deve permanecer");
        restTemplate.delete("/api/v1/pontos/" + id);
    }

    @Test
    void putDePontoInexistenteResponde404() {
        Map<String, String> valido = Map.of(
                "nome", "Ponto",
                "endereco", "Rua de teste, 100",
                "bairro", "Setor de teste",
                "horario", "Segunda a sexta",
                "tipo", "coleta"
        );

        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/pontos/00000000-0000-0000-0000-000000000000",
                HttpMethod.PUT,
                jsonRequest(valido),
                String.class
        );

        assertThat(response.getStatusCode().value()).isEqualTo(404);
    }

    private HttpEntity<Map<String, String>> jsonRequest(Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return new HttpEntity<>(body, headers);
    }

    private long totalPontos() {
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                "/pontos?size=50",
                HttpMethod.GET,
                null,
                JSON_MAP
        );
        return ((Number) ((Map<?, ?>) response.getBody().get("page"))
                .get("totalElements")).longValue();
    }
}
