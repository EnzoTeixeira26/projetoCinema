package br.meuapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${cors.originPatterns}")
  private String corsOriginPatterns = "";

  @SuppressWarnings("null")
  @Override
  public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
    String[] allowedPatterns =
        corsOriginPatterns.split(",");

    registry.addMapping("/**")
        .allowedOrigins(allowedPatterns).allowedMethods("*")
        .allowCredentials(true);

    registry.addMapping("/**").allowedOrigins("*")
        .allowedMethods("GET","PUT", "DELETE", "POST");
  }

}