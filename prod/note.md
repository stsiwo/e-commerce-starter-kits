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
