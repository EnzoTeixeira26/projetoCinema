package br.meuapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.meuapp.model.Favorito;
import br.meuapp.services.FavoritoService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {
    
    @Autowired
    private FavoritoService favoritoService;
    
    @PostMapping
    public ResponseEntity<Favorito> adicionarFavorito(@RequestBody Favorito favorito) {
        try {
            Favorito favoritoSalvo = favoritoService.adicionarFavorito(favorito);
            return ResponseEntity.ok(favoritoSalvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Favorito>> getFavoritosPorUsuario(@PathVariable Long usuarioId) {
        List<Favorito> favoritos = favoritoService.buscarFavoritosPorUsuario(usuarioId);
        return ResponseEntity.ok(favoritos);
    }
    
    @GetMapping("/usuario/{usuarioId}/tipo/{tipo}")
    public ResponseEntity<List<Favorito>> getFavoritosPorUsuarioETipo(
            @PathVariable Long usuarioId, 
            @PathVariable String tipo) {
        List<Favorito> favoritos = favoritoService.buscarFavoritosPorUsuarioETipo(usuarioId, tipo);
        return ResponseEntity.ok(favoritos);
    }
    
    @GetMapping("/verificar")
    public ResponseEntity<Boolean> verificarFavorito(
            @RequestParam Long usuarioId,
            @RequestParam Long conteudoId,
            @RequestParam String tipo) {
        boolean isFavorito = favoritoService.isFavorito(usuarioId, conteudoId, tipo);
        return ResponseEntity.ok(isFavorito);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerFavorito(@PathVariable Long id) {
        try {
            favoritoService.removerFavorito(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/usuario/{usuarioId}/conteudo/{conteudoId}/tipo/{tipo}")
    public ResponseEntity<Void> removerFavorito(
            @PathVariable Long usuarioId,
            @PathVariable Long conteudoId,
            @PathVariable String tipo) {
        try {
            favoritoService.removerFavorito(usuarioId, conteudoId, tipo);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/usuario/{usuarioId}/count")
    public ResponseEntity<Long> contarFavoritosUsuario(@PathVariable Long usuarioId) {
        Long count = favoritoService.contarFavoritosUsuario(usuarioId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping
    public ResponseEntity<List<Favorito>> getAllFavoritos() {
        List<Favorito> favoritos = favoritoService.buscarTodosFavoritos();
        return ResponseEntity.ok(favoritos);
    }
}
