package br.meuapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos")
public class Favorito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(name = "conteudo_id", nullable = false)
    private Long conteudoId;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String tipo; 
    
    @Column(name = "imagem_url")
    private String imagemUrl;
    
    private String categoria;
    
    @Column(length = 1000)
    private String sinopse;
    
    @Column(name = "data_adicao")
    private LocalDateTime dataAdicao;
    
    public Favorito() {
        this.dataAdicao = LocalDateTime.now();
    }
    
    public Favorito(Long usuarioId, Long conteudoId, String titulo, String tipo, String imagemUrl, String categoria, String sinopse) {
        this();
        this.usuarioId = usuarioId;
        this.conteudoId = conteudoId;
        this.titulo = titulo;
        this.tipo = tipo;
        this.imagemUrl = imagemUrl;
        this.categoria = categoria;
        this.sinopse = sinopse;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public Long getConteudoId() {
        return conteudoId;
    }
    
    public void setConteudoId(Long conteudoId) {
        this.conteudoId = conteudoId;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public String getImagemUrl() {
        return imagemUrl;
    }
    
    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
    
    public String getCategoria() {
        return categoria;
    }
    
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    
    public String getSinopse() {
        return sinopse;
    }
    
    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }
    
    public LocalDateTime getDataAdicao() {
        return dataAdicao;
    }
    
    public void setDataAdicao(LocalDateTime dataAdicao) {
        this.dataAdicao = dataAdicao;
    }
}