-- to make this works, you need to include this classpath to 'flyway.location' in application.yml
DELETE FROM flyway_schema_history WHERE success=false;
