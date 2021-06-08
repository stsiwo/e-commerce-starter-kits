# Production & Deployment Note

## Command

  - connect to the ec2
    command) ssh -i "~/.aws-ssh/iwaodev/iwadodev.pem" ubuntu@ec2-35-83-171-84.us-west-2.compute.amazonaws.com

  - upload prod directory to ec2
    command) scp -v -i "~/.aws-ssh/iwaodev/iwadodev.pem" -r ./prod/ ubuntu@ec2-35-83-171-84.us-west-2.compute.amazonaws.com:~/.

## Database Backup/Restore

  - use this docker image.

  - ref: https://hub.docker.com/r/databack/mysql-backup

## icrontab

  - if the target file does not exist, icrontab does not work.

  - you need to restart incron if it is in the case above.

  - command) sudo systemctl restart incron.service

  - so you need to restart incron after uploading file at the first time.
