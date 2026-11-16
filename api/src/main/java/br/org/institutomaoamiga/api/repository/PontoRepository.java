package br.org.institutomaoamiga.api.repository;

import br.org.institutomaoamiga.api.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {
}
