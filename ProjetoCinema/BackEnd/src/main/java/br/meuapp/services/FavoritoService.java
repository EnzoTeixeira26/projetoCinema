package br.meuapp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.meuapp.model.Favorito;
import br.meuapp.repository.FavoritoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    public Favorito adicionarFavorito(Favorito favorito) {
        Optional<Favorito> favoritoExistente = favoritoRepository
                .findByUsuarioIdAndConteudoIdAndTipo(
                        favorito.getUsuarioId(),
                        favorito.getConteudoId(),
                        favorito.getTipo());

        if (favoritoExistente.isPresent()) {
            throw new RuntimeException("Conteúdo já está nos favoritos");
        }

        return favoritoRepository.save(favorito);
    }

    public List<Favorito> buscarFavoritosPorUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioIdOrderByDataAdicaoDesc(usuarioId);
    }

    public List<Favorito> buscarFavoritosPorUsuarioETipo(Long usuarioId, String tipo) {
        return favoritoRepository.findByUsuarioIdAndTipo(usuarioId, tipo);
    }

    public boolean isFavorito(Long usuarioId, Long conteudoId, String tipo) {
        return favoritoRepository.existsByUsuarioIdAndConteudoIdAndTipo(usuarioId, conteudoId, tipo);
    }

    public Optional<Favorito> buscarFavorito(Long usuarioId, Long conteudoId, String tipo) {
        return favoritoRepository.findByUsuarioIdAndConteudoIdAndTipo(usuarioId, conteudoId, tipo);
    }

    @SuppressWarnings("null")
    public void removerFavorito(Long id) {
        if (!favoritoRepository.existsById(id)) {
            throw new RuntimeException("Favorito não encontrado com ID: " + id);
        }
        favoritoRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    public void removerFavorito(Long usuarioId, Long conteudoId, String tipo) {
        Optional<Favorito> favorito = favoritoRepository
                .findByUsuarioIdAndConteudoIdAndTipo(usuarioId, conteudoId, tipo);

        if (favorito.isPresent()) {
            favoritoRepository.delete(favorito.get());
        } else {
            throw new RuntimeException("Favorito não encontrado");
        }
    }

    public Long contarFavoritosUsuario(Long usuarioId) {
        return favoritoRepository.countByUsuarioId(usuarioId);
    }

    public List<Favorito> buscarTodosFavoritos() {
        return favoritoRepository.findAll();
    }
}
