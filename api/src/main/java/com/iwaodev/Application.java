package com.iwaodev;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.module.jaxb.JaxbAnnotationModule;
import com.iwaodev.infrastructure.shipping.ShippingApiRequestInterceptor;
import com.stripe.Stripe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.event.EventListener;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@SpringBootApplication
// @ConfigurationProperties(locations =
// "classpath:myapp-${environment.type}.properties")
public class Application {

  @Value("${stripe.apiKey}")
  private String stripeApiKey;

  @Autowired
  private ShippingApiRequestInterceptor shippingApiRequestInterceptor;

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  /**
   * jackson object mapper.
   *
   * - used to map response body to dto (esp testing).
   *
   * - the compiler complains about this with XmlMapper so define this
   * as @Primary; if you want to use this, you don't need any @Qualifier
   * at @Autowired.
   **/
  @Bean
  @Primary
  public ObjectMapper jsonObjectMapper() {
    ObjectMapper objectMapper = new ObjectMapper();
    /**
     * spring serializes LocalDateTime to ints array so change this behavior to
     * string format of the date.
     *
     * ref:
     * https://stackoverflow.com/questions/32952269/cant-serialize-java-time-localdate-as-a-string-with-jackson
     *
     **/
    objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    /**
     * to suppoert Java 8 LocalDateTime. - you also need to install Jackson
     * Datatype: JSR310
     * (https://mvnrepository.com/artifact/com.fasterxml.jackson.datatype/jackson-datatype-jsr310/2.12.1)
     **/

    objectMapper.findAndRegisterModules();

    return objectMapper;
  }

  /**
   * jackson xml mapper.
   *
   * - DON'T use this. Instead, use JAXB.marshal. this ignore 'xmlns' which causes
   * errors.
   *
   * - used to serialize/deserialize xml pojos (esp for shipping).
   *
   * - the compiler complains about this with ObjectMapper. if you want to use
   * this, you need any @Qualifier at @Autowired.
   * 
   **/
  @Bean
  @Deprecated
  public ObjectMapper xmlMapper() {
    return new XmlMapper().registerModule(new JaxbAnnotationModule());
  }

  /**
   * rest template builder.
   * 
   * to send api request to another api (e.g., Canada Post API).
   *
   * you need to config this to make 'restTemplate' work.
   *
   * ref:
   * https://stackoverflow.com/questions/28024942/how-to-autowire-resttemplate-using-annotations.
   **/
  @Bean("shippingRestTemplate")
  public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder.additionalInterceptors(this.shippingApiRequestInterceptor)
        // this does not work.
        // .defaultHeader("Accept", "application/vnd.cpc.ship.rate-v4+xml")
        // .defaultHeader("Content-Type", "application/vnd.cpc.ship.rate-v4+xml")
        // .defaultHeader("Accept-Language", "en-CA")
        .build();
  }

  /**
   * add global stuff in main class
   * 
   * - ref:
   * https://stackoverflow.com/questions/60405543/read-application-properties-value-from-spring-boot-main-class
   * 
   **/

  @EventListener
  public void onAppContextStarted(ApplicationStartedEvent e) {
    /**
     * configure global setting like stripe
     **/

    /**
     * you need to set this otherwise, you got this:
     * com.stripe.exception.AuthenticationException: No API key provided. Set your
     * API key using `Stripe.apiKey = "<API-KEY>"`.
     **/
    Stripe.apiKey = stripeApiKey;
  }

  /**
   * email template resolver (HTML)
   *
   * put @Primary since 'No qualifying bean of type 'org.thymeleaf.templateresolver.ITemplateResolver' available: expected single matching bean but found 2: thymeleafTemplateResolver,defaultTemplateResolver'.
   *
   **/
  @Bean
  @Primary
  public ITemplateResolver thymeleafTemplateResolver() {
    ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
    templateResolver.setPrefix("mail-templates/");
    templateResolver.setSuffix(".html");
    templateResolver.setTemplateMode("HTML");
    templateResolver.setCharacterEncoding("UTF-8");
    return templateResolver;
  }

  /**
   * localization of email template engine
   **/
  @Bean
  public ResourceBundleMessageSource emailMessageSource() {
    ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
    messageSource.setBasename("mailMessages");
    return messageSource;
  }

  /**
   * template engine factory
   *
   * - default engine is predefined so don't need to explicitly set this.
   **/
  @Bean
  public SpringTemplateEngine thymeleafTemplateEngine(ITemplateResolver templateResolver) {
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    templateEngine.setTemplateResolver(templateResolver);
    templateEngine.setTemplateEngineMessageSource(emailMessageSource());
    return templateEngine;
  }

  /**
   * pagination.
   *
   * make page starts from 1 (not 0).
   *
   * this DOES NOT work...
   *
   *
   **/
  // @Bean
  // public PageableHandlerMethodArgumentResolverCustomizer customize() {
  // return p -> p.setOneIndexedParameters(true);
  // }

  // @Bean
  // public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
  // return args -> {

  // System.out.println("Let's inspect the beans provided by Spring Boot");

  // String[] beanNames = ctx.getBeanDefinitionNames();
  // Arrays.sort(beanNames);
  // for (String beanName : beanNames) {
  // System.out.println(beanName);
  // }

  // };
  // }
}