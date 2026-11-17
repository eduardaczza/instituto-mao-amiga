package br.org.institutomaoamiga.api.repository;

import br.org.institutomaoamiga.api.entity.Ponto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {
    @Query("""
            SELECT p FROM Ponto p
            WHERE (:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
              AND (:bairro IS NULL OR LOWER(p.bairro) LIKE LOWER(CONCAT('%', :bairro, '%')))
            """)
    Page<Ponto> buscarPaginado(
            @Param("nome") String nome,
            @Param("bairro") String bairro,
            Pageable pageable
    );
}
