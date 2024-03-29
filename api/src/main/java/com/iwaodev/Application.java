package com.iwaodev;

import java.util.Date;
import java.util.Properties;
import java.util.TimeZone;

import javax.annotation.PostConstruct;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.module.jaxb.JaxbAnnotationModule;
import com.iwaodev.config.MailConfig;
import com.iwaodev.infrastructure.shipping.CanadaPostApiRequestInterceptor;
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
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Primary;
import org.springframework.context.event.EventListener;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;
import org.springframework.validation.beanvalidation.SpringConstraintValidatorFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.web.filter.ShallowEtagHeaderFilter;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableAspectJAutoProxy
/**
 * @Async requires the class you use to wrape with an interface. to automatically create this, add 'proxyTargetClass = true'.
 *
 * Otherwise, you receive ''The method 'recordHeartBeat' declared on target class 'NodeStatusService', but not found in any interface(s) of the exposed proxy type. Either pull the method up to an interface or switch to CGLIB proxies by enforcing proxy-target-class mode in your configuration..
 *
 *
 * @2021/07/12
 *
 *  stop using this since this is not necessary. mostly i use @Async for domain event handlers.
 *
 *  issue:
 *
 *    how to test async with MOckito. currently Mockito does not support any async implementation. for example, it is impossbiel to test async function with Awaitability (org.awaitability) with Mockito.verify.
 *
 *    available workaround is to make async sync only when testing using profile. so if you really need async feature, you should implement this.
 *
 **/
//@EnableAsync(proxyTargetClass = true)
public class Application {

  private static final Logger logger = LoggerFactory.getLogger(Application.class);

  @Value("${stripe.apiKey}")
  private String stripeApiKey;

  @Autowired
  private CanadaPostApiRequestInterceptor canadaPostApiRequestInterceptor;

  @Autowired
  private MailConfig mailConfig;

  @Autowired
  private TrimStringModule trimStringModule;

  private static ApplicationContext applicationContext;

  public static void main(String[] args) {
    applicationContext = SpringApplication.run(Application.class, args);
    //displayAllBeans();
  }

  @PostConstruct
  public void init() {
    /**
     * set time zone to utc
     *
     * this automatically convert a local time zone from cleint into UTC (+00:00), so you don't need to convert it explicitly.
     */
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    System.out.println("Date in UTC: " + new Date().toString());
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
  public RestTemplate shippingRestTemplate(RestTemplateBuilder builder) {
    return builder.additionalInterceptors(this.canadaPostApiRequestInterceptor)
        // this does not work.
        // .defaultHeader("Accept", "application/vnd.cpc.ship.rate-v4+xml")
        // .defaultHeader("Content-Type", "application/vnd.cpc.ship.rate-v4+xml")
        // .defaultHeader("Accept-Language", "en-CA")
        .build();
  }

  /**
   * rest template builder.
   * 
   * to send api request to another api (e.g., Recaptcha API).
   *
   * you need to config this to make 'restTemplate' work.
   *
   * ref:
   * https://stackoverflow.com/questions/28024942/how-to-autowire-resttemplate-using-annotations.
   **/
  @Bean("recatchaRestTemplate")
  public RestTemplate recatchaRestTemplate(RestTemplateBuilder builder) {
    return builder.build();
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
    /**
     * how to set basename
     * 
     * ref: https://stackoverflow.com/questions/15065734/spring-framework-no-message-found-under-code-for-locale/39371075
     *
     **/
    messageSource.setBasename("classpath:/messages/messages");
    messageSource.setDefaultEncoding("UTF-8");
    return messageSource;
  }

  @Bean
  public LocalValidatorFactoryBean getValidator() {
    LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
    bean.setValidationMessageSource(messageSource());
    return bean;
  }

  /**
   * to enable eTag used for Optimistic Locking mechanism to handle concurrency issue.
   * @return
   */
  @Bean
  public ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
    return new ShallowEtagHeaderFilter();
  }
}
