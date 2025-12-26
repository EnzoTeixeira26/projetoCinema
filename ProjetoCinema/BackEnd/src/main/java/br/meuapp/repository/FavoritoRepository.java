package br.meuapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.meuapp.model.Favorito;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    
    List<Favorito> findByUsuarioId(Long usuarioId);
    
    List<Favorito> findByUsuarioIdAndTipo(Long usuarioId, String tipo);
    
    @Query("SELECT f FROM Favorito f WHERE f.usuarioId = :usuarioId AND f.conteudoId = :conteudoId AND f.tipo = :tipo")
    Optional<Favorito> findByUsuarioIdAndConteudoIdAndTipo(
        @Param("usuarioId") Long usuarioId, 
        @Param("conteudoId") Long conteudoId, 
        @Param("tipo") String tipo
    );
    
    Long countByUsuarioId(Long usuarioId);
    
    List<Favorito> findByUsuarioIdOrderByDataAdicaoDesc(Long usuarioId);
    
    @Query("DELETE FROM Favorito f WHERE f.usuarioId = :usuarioId AND f.conteudoId = :conteudoId AND f.tipo = :tipo")
    void deleteByUsuarioIdAndConteudoIdAndTipo(
        @Param("usuarioId") Long usuarioId, 
        @Param("conteudoId") Long conteudoId, 
        @Param("tipo") String tipo
    );
    
    boolean existsByUsuarioIdAndConteudoIdAndTipo(Long usuarioId, Long conteudoId, String tipo);
}