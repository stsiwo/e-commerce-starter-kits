#! /bin/bash

### variables
user="ubuntu"
domain1="iwaodev.com"
domain2="api.iwaodev.com"
email="satoshi@iwaodev.com"

### create necessary directories
mkdir prod/
chown -R $user:$user prod/

### update package 
sudo apt-get update            
  
### install docker             
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

### add 'ubuntu' user to docker group so that run without 'sudo'
# sudo groupadd docker         
sudo usermod -aG docker $user
newgrp docker
    
### install docker-compose     
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

### install incron
## it's working:) 
sudo apt-get update
sudo apt-get install incron
echo 'root' | sudo tee -a /etc/incron.allow
(sudo incrontab -l ; echo "/home/$user/prod/trigger.txt IN_CLOSE_WRITE /home/$user/prod/update-docker-compose.sh") | sort - | uniq - | sudo incrontab -

## restart incron service
sudo systemctl restart incron.service

### install SSL with Let's Encrypt (optional)
#### need to set '-n' (e.g., non-interactive) with plugins (e.g., --dns-route53) to achieve to automate this process. 
#### ref: https://certbot.eff.org/docs/using.html#certbot-command-line-options
#### 1
docker run -it --rm --name certbot \
    -v "/etc/letsencrypt:/etc/letsencrypt" \
    -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
    certbot/dns-route53 certonly \
    -n \
    --dns-route53 \
    -d $domain1 \
    -m $email \
    --agree-tos

#### 2
docker run -it --rm --name certbot \
    -v "/etc/letsencrypt:/etc/letsencrypt" \
    -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
    certbot/dns-route53 certonly \
    -n \
    --dns-route53 \
    -d $domain2 \
    -m $email \
    --agree-tos
