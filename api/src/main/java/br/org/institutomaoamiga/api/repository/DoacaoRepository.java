package br.org.institutomaoamiga.api.repository;

import br.org.institutomaoamiga.api.entity.Doacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {
    Page<Doacao> findByTipoItemContainingIgnoreCase(String tipoItem, Pageable pageable);
}
