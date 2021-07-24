# Production & Deployment Note

## Steps to deployment to staging server

  1. run 'docker-hub-push.sh' for spa, db, api

      command) ./docker-hub-push.sh -i ec-spa -v 1.0.0 -t production -d ./spa
      command) ./docker-hub-push.sh -i ec-db -v 1.0.0 -t init -d ./db
      command) ./docker-hub-push.sh -i ec-api -v 1.0.0 -t production -d ./api
     
    * note about api)
        => if you modify source code, don't forget to run this:
          command) mvn clean package

  2. deploy sentive file to virtual machine.

    command) ##Command.b
    
## Command

  a. connect to the ec2
    command) ssh -i "~/.aws-ssh/iwaodev/iwadodev.pem" ubuntu@ec2-35-83-171-84.us-west-2.compute.amazonaws.com

  b. upload prod directory to ec2
    command) scp -v -i "~/.aws-ssh/iwaodev/iwadodev.pem" -r ./prod/ ubuntu@ec2-35-83-171-84.us-west-2.compute.amazonaws.com:~/.

## Database Backup/Restore

  - use this docker image.

  - ref: https://hub.docker.com/r/databack/mysql-backup

## icrontab

  - if the target file does not exist, icrontab does not work.

  - you need to restart incron if it is in the case above.

  - command) sudo systemctl restart incron.service

  - so you need to restart incron after uploading file at the first time.

## Errors

  ### Deployment Cause 'port already used' errors

    - error: ERROR: for spa  Cannot start service spa: driver failed programming external connectivity on endpoint spa (e08daca9da995af824b4c235b6c1e11367a840e45d629ef6face6de2fc7d93de): Bind for 0.0.0.0:443 failed: port is already allocated

    - background: when i try to upload production directory, it causes recreate docker container inside the docker compose, but sometiems it cause this error.

    - workaround: restart docker (e.g., sudo systemctl restart docker)

    - ref: https://github.com/docker/compose/issues/3277 

    @2021/07/20

    - found useful ref: https://github.com/docker/compose/issues/4950

      - it said that if you change 'ports' field at docker-compsoe file, it will solve the problem.

        - i changed "80:80" => "80", but this does not open the port to the docker host so this does not help.

      - it also said that 'down' the docker compose first then 'up' again.

        - this works!!

        - not it not!! still cause the error.

    @2021/07/23
  
    - insert "systemctl restart docker" in update script, but this requires you to run the script with 'sudo' so you need to ssh the production server first then run 'sudo ./update-docker...' manually.

    

    


