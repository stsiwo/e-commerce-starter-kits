package com.iwaodev.config;

import java.util.Arrays;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.config.filter.JwtCookieRequestFilter;
import com.iwaodev.config.filter.LimitLoginAttemptFilter;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DefaultAuthenticationEventPublisher;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

  private static final Logger logger = LoggerFactory.getLogger(SpringSecurityConfig.class);

  @Autowired
  private SpringSecurityUserDetailsService userDetailsService;

  @Autowired
  private JwtCookieRequestFilter jwtCookieRequestFilter;

  @Autowired
  private LimitLoginAttemptFilter limitLoginAttemptFilter;

  @Autowired
  private CorsConfig corsConfig;

  @Autowired
  private ObjectMapper objectMapper;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
        /**
         * use a customer one. see below.
         **/
        .authenticationProvider(this.daoAuthenticationProvider())
        /**
         * need to register to make authentication event listener works.
         **/
        .authenticationEventPublisher(authenticationEventPublisher());
        /**
         * don't set this otherwise, authentication manager uses default provider.
         **/
        //.userDetailsService(this.userDetailsService);
  }

  @Override
  protected void configure(HttpSecurity security) throws Exception {

    security

        // disable cxrf
        // #TODO: search why need this. if you use cookie, I believe that this must be
        // enabled.
        .csrf().disable()

        // authorization
        .authorizeRequests()

        // public
        
        /// domain
        .antMatchers(HttpMethod.GET, "/categories").permitAll() //
        .antMatchers(HttpMethod.GET, "/products/public").permitAll() //
        .antMatchers(HttpMethod.GET, "/products/public/{path}").permitAll() //
        .antMatchers(HttpMethod.POST, "/orders").permitAll() //
        .antMatchers(HttpMethod.POST, "/orders/{orderId}/events/session-timeout").permitAll() //

        // spring boot admin: need to open actuator endpoints
        .antMatchers("/actuator/**").permitAll() //
        

        /// stripe web hook
        // .antMatchers(HttpMethod.POST, "/create-payment-intent").permitAll() // Stripe
        // PaymentIntent client secret for testing
        .antMatchers(HttpMethod.POST, "/webhook/payment").permitAll() // Stripe Webhook endpoints

        // only guest user
        .antMatchers("/authenticate").anonymous() // login
        .antMatchers("/logout").anonymous() // login
        .antMatchers("/signup").anonymous() // signup
        .antMatchers(HttpMethod.POST, "/forgot-password").anonymous() // signup
        .antMatchers(HttpMethod.POST, "/reset-password").anonymous() // signup

        // protected resources (need authentication)
        .anyRequest().authenticated()

        .and() // conjunction

        /**
         * spring automatically redirect after successfully logout and i want to disable
         * this since using api.
         *
         * solution: use below.
         *
         * ref: https://www.baeldung.com/spring-security-disable-logout-redirects
         *
         * Alos, delete api-token cookie set at /authenticate endpoint to login.
         *
         * You don't need to implement /logout controller.
         *
         *
         **/
        .logout().permitAll().deleteCookies("api-token").logoutSuccessHandler((request, response, authentication) -> {
          response.setStatus(HttpServletResponse.SC_OK);
        })

        .and()

        /**
         * login.
         * 
         **/
        //.formLogin().failureHandler(this.authenticationFailureHandler)

        //.and()

        // (403) access denied response
        .exceptionHandling().accessDeniedHandler((request, response, exception) -> {

          /**
           * Receiving a 403 response is the server telling you, “I’m sorry. I know who
           * you are–I believe who you say you are–but you just don’t have permission to
           * access this resource. Maybe if you ask the system administrator nicely,
           * you’ll get permission. But please don’t bother me again until your
           * predicament changes.”
           **/
          response.setStatus(HttpServletResponse.SC_FORBIDDEN);
          response.setContentType(MediaType.APPLICATION_JSON_VALUE);
          response.getWriter().write(this.objectMapper
              .writeValueAsString(new BaseResponse("you don't have any permission to access this resource.")));
        })

        /**
         * default authenticationEntryPoint return 403 if something is wrong during the authentication.
         * But you can change this to reutrn 401 if do like the below.
         **/
        //.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))

        .and()

        // session management (no session since use JWT and rest api)
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        .and() // conjunction

        // cors
        .cors();

    // insert jwt cookie request filter
    security.addFilterBefore(this.limitLoginAttemptFilter, UsernamePasswordAuthenticationFilter.class);
    security.addFilterBefore(this.jwtCookieRequestFilter, UsernamePasswordAuthenticationFilter.class);

  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    logger.info("cors config:");
    for (String origin: this.corsConfig.getOrigins()) {
      logger.info("origin: " + origin);
    }
    logger.info("credetials: " + this.corsConfig.getCredentials());

    /**
     * don't use wildcard in production:
     *
     * - origins - methods - headers
     **/

    configuration.setAllowedOrigins(Arrays.asList(this.corsConfig.getOrigins()));
    configuration.setAllowedMethods(Arrays.asList(new String[] { "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" }));
    configuration.setAllowedHeaders(Arrays.asList(
        new String[] { "Authorization", "Accept", "Origin", "DNT", "X-Chisel-Proxied-Url", "Keep-Alive", "User-Agent",
            "X-Requested-With", "If-Modified-Since", "Cache-Control", "Content-Type", "Content-Range", "Range" }));
    configuration.setAllowCredentials(this.corsConfig.getCredentials());
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  /**
   * this is necessary to expose 'AuthenticationManager' as beans so that other
   * class can use @Autowried to use this AuthenticationManager
   **/
  @Override
  @Bean
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    // default rounds (strength) is 10
    return new BCryptPasswordEncoder();
  }

  @Bean
  public DefaultAuthenticationEventPublisher authenticationEventPublisher() {
    return new DefaultAuthenticationEventPublisher();
  }

  /**
   * need this custom daoAuthenticationProvider since I need to display UsernameNotFoundException.
   *
   * by default, it is disabled.
   *
   **/
  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setHideUserNotFoundExceptions(false);
    provider.setUserDetailsService(this.userDetailsService);
    provider.setPasswordEncoder(this.passwordEncoder());
    return provider;
  }

}
