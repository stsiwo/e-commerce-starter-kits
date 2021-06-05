package com.iwaodev.config;

import java.util.Arrays;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletResponse;

import com.iwaodev.config.filter.JwtCookieRequestFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
  private CorsConfig corsConfig;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(this.userDetailsService);
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
        .antMatchers(HttpMethod.GET, "/categories").permitAll() //
        .antMatchers(HttpMethod.GET, "/products/public").permitAll() //
        .antMatchers(HttpMethod.GET, "/products/public/{path}").permitAll() //
        .antMatchers(HttpMethod.POST, "/orders").permitAll() //
        .antMatchers(HttpMethod.POST, "/orders/{orderId}/events/session-timeout").permitAll() //

        // .antMatchers(HttpMethod.POST, "/create-payment-intent").permitAll() // Stripe
        // PaymentIntent client secret for testing
        .antMatchers(HttpMethod.POST, "/webhook/payment").permitAll() // Stripe Webhook endpoints

        // only guest user
        .antMatchers("/authenticate").anonymous() // login
        .antMatchers("/logout").anonymous() // login
        .antMatchers("/signup").anonymous() // signup

        // protected resources (need authentication)
        .anyRequest().authenticated()

        .and() // conjunction

        /**
         * spring automatically redirect after successfully logout and i want to disable this since using api.
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
        .logout()
        .permitAll()
        .deleteCookies("api-token")
        .logoutSuccessHandler((request, response, authentication) -> {
          response.setStatus(HttpServletResponse.SC_OK);
        })

        .and()

        // session management (no session since use JWT and rest api)
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        .and() // conjunction

        // cors
        .cors();

    // insert jwt cookie request filter
    security.addFilterBefore(this.jwtCookieRequestFilter, UsernamePasswordAuthenticationFilter.class);

  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    logger.info("cors config:");
    logger.info("origins: " + this.corsConfig.getOrigins());
    logger.info("methods: " + this.corsConfig.getMethods());
    logger.info("headers: " + this.corsConfig.getHeaders());

    configuration.setAllowedOrigins(Arrays.asList(this.corsConfig.getOrigins()));
    configuration.setAllowedMethods(Arrays.asList(this.corsConfig.getMethods()));
    configuration.setAllowedHeaders(Arrays.asList(this.corsConfig.getHeaders()));
    configuration.setAllowCredentials(true);
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
}
