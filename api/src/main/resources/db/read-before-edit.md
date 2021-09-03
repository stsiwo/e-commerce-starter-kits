# FLYWAY MIGRATION NOTE

## IMPORTANT NOTE

### never ever edit the script which is already migrated to db!! this causes checksum mismatch error. 

- if you did, read this: https://www.baeldung.com/spring-boot-flyway-repair

- using a flyway:repair command might not work if you don't have installed the flyway cli (e.g., currently, just use it as a maven plugins). if that is the case, you have to manually update the broken checksum of a row.