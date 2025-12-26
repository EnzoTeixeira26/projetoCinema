package br.meuapp.dto;

public class CriarFavoritoDTO {
    private Long usuarioId;
    private Long conteudoId;
    private String titulo;
    private String tipo;
    private String imagemUrl;
    private String categoria;
    private String sinopse;
    
    public CriarFavoritoDTO() {}
    
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    
    public Long getConteudoId() { return conteudoId; }
    public void setConteudoId(Long conteudoId) { this.conteudoId = conteudoId; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public String getSinopse() { return sinopse; }
    public void setSinopse(String sinopse) { this.sinopse = sinopse; }
}