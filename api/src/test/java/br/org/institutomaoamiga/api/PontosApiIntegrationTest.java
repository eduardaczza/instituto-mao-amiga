package br.org.institutomaoamiga.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
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
}
