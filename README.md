# e-commerce-starter-kits
e-commerce web app with React + Java + Spring + Docker

## Refs

  - rechaptch management console: https://www.google.com/u/2/recaptcha/admin/site/459661075 (need to login as satoshi@iwaodev.com)

## Frontend Tech Stack

  - TypeScript
  - Webpack
  - React
  - Redux
  - Redux-Saga
  - styled-components
  - Material-UI

## Backend Tech Stack

  - Java 
  - Spring (Web Framework)
  - Redis (Session Management)
  - Nginx (Web Server)

## Infrastructure

  - Docker
  - Docker Compose

## NOTE

  - How to prevent a user from accessing other user's data.

    - https://stackoverflow.com/questions/51712724/how-to-allow-a-user-only-access-their-own-data-in-spring-boot-spring-security

  - How to deal with DELETE http method with request body?

    - https://stackoverflow.com/questions/299628/is-an-entity-body-allowed-for-an-http-delete-request#:~:text=Yes%20it%20is%20allowed%20to,not%20including%20a%20request%20body.
    - honestly, it is unclear to me. some clients can't send DELETE request with the body or some web server ignores the body when passing to the backend app     
