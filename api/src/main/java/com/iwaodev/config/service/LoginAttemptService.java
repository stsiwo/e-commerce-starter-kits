package com.iwaodev.config.service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

  private LoadingCache<String, Integer> attemptsCache;

  @Value("${login.limit.maxAttempt}")
  private int maxAttempt;

  @Value("${login.limit.lockTime}")
  private int lockTime;


  public LoginAttemptService() {
    super();
    attemptsCache = CacheBuilder.newBuilder().expireAfterWrite(this.lockTime, TimeUnit.MINUTES)
        .build(new CacheLoader<String, Integer>() {
          public Integer load(String key) {
            return 0;
          }
        });
  }

  public void loginSucceeded(String key) {
    attemptsCache.invalidate(key);
  }

  public void loginFailed(String key) {
    int attempts = 0;
    try {
      attempts = attemptsCache.get(key);
    } catch (ExecutionException e) {
      attempts = 0;
    }
    attempts++;
    attemptsCache.put(key, attempts);
  }

  public boolean isBlocked(String key) {
    try {
      return attemptsCache.get(key) >= this.maxAttempt;
    } catch (ExecutionException e) {
      return false;
    }
  }
}
