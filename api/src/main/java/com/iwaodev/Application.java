package com.iwaodev;

import java.util.Properties;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.module.jaxb.JaxbAnnotationModule;
import com.iwaodev.config.MailConfig;
import com.iwaodev.infrastructure.shipping.ShippingApiRequestInterceptor;
import com.iwaodev.util.TrimStringModule;
import com.stripe.Stripe;

import org.hibernate.validator.HibernateValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.event.EventListener;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;
import org.springframework.validation.beanvalidation.SpringConstraintValidatorFactory;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class Application {

  private static final Logger logger = LoggerFactory.getLogger(Application.class);

  @Value("${stripe.apiKey}")
  private String stripeApiKey;

  @Autowired
  private ShippingApiRequestInterceptor shippingApiRequestInterceptor;

  @Autowired
  private MailConfig mailConfig;

  @Autowired
  private TrimStringModule trimStringModule;

  private static ApplicationContext applicationContext;

  public static void main(String[] args) {
    applicationContext = SpringApplication.run(Application.class, args);
    displayAllBeans();
  }

  public static void displayAllBeans() {
    String[] allBeanNames = applicationContext.getBeanDefinitionNames();
    for (String beanName : allBeanNames) {
      System.out.println(beanName);
    }
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

    /**
     * trim leading/trailing space of any value.
     *
     * ref:
     * https://stackoverflow.com/questions/6852213/can-jackson-be-configured-to-trim-leading-trailing-whitespace-from-all-string-pr
     **/
    objectMapper.registerModule(this.trimStringModule);

    return objectMapper;
  }

  /**
   * cache feature.
   *
   * mainly for image cache. don't use too much. it takes a lot of memory.
   *
   * if you spring boot, you don't need to create this bean.
   *
   **/
  // @Bean
  // public CacheManager cacheManager() {
  // return new ConcurrentMapCacheManager("addresses");
  // }

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
   * put @Primary since 'No qualifying bean of type
   * 'org.thymeleaf.templateresolver.ITemplateResolver' available: expected single
   * matching bean but found 2:
   * thymeleafTemplateResolver,defaultTemplateResolver'.
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

  /**
   * mail
   **/
  @Bean
  public JavaMailSender getJavaMailSender() {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

    logger.info("mail service config");
    logger.info("smtp name: " + this.mailConfig.getHost());
    logger.info("is starttls enable: " + this.mailConfig.getIsStartTlsEnable());

    mailSender.setHost(this.mailConfig.getHost());
    mailSender.setPort(this.mailConfig.getPort());
    mailSender.setUsername(this.mailConfig.getUserName());
    mailSender.setPassword(this.mailConfig.getPassword());

    Properties props = mailSender.getJavaMailProperties();
    props.put("mail.transport.protocol", "smtp");
    props.put("mail.smtp.auth", this.mailConfig.getIsSmtpAuth());
    props.put("mail.smtp.starttls.enable", this.mailConfig.getIsStartTlsEnable());
    props.put("mail.debug", "true");

    return mailSender;
  }

  @Bean
  public MessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
    messageSource.setBasename("classpath:messages");
    messageSource.setDefaultEncoding("UTF-8");
    return messageSource;
  }

  @Bean
  public LocalValidatorFactoryBean getValidator() {
    LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
    bean.setValidationMessageSource(messageSource());
    return bean;
  }
}
