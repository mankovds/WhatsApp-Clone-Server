# WhatsApp Clone Server

<b>App clone for WhatsApp Messenger (Server files)</b>
<br><br>
Minimum requirements:
<br>
Server with ubuntu 16.04
<br>
SSH Login
<br><br>
Step 0:
Download file and upload in your server to /var/www/whatsapp_clone
Step 1:
sudo rm /etc/apt/sources.list.d/mongodb*.list

Step 2:
sudo wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

Step 3:
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

Step 4:
sudo apt-get update

Step 5:
sudo apt-get install -y mongodb-org

Step 6:
sudo systemctl start mongod

Step 7:
sudo systemctl enable mongod

Step 8:
sudo netstat -plntu

Step 9:
mongo

Step 10:
use admin

Step 11:
db.createUser({user:"admin", pwd:"admin123", roles:[{role:"root", db:"admin"}]})

Step 12:
exit

Step 13:
sudo nano /etc/mongod.conf

Step 14:
UNCOMMENT #security and add:
security:
  authorization: 'enabled'

Step 15:
Add your ip
net:
  port: 27017
  bindIp: 127.0.0.1 , 192.168.1.100

Step 16:
sudo service mongod restart

Step 17:
sudo nano /lib/systemd/system/mongod.service
and change this from:
ExecStart=/usr/bin/mongod --config /etc/mongod.conf
to:
ExecStart=/usr/bin/mongod --auth --config /etc/mongod.conf

Step 18:
sudo systemctl daemon-reload

Step 19:
sudo service mongod restart

Step 20:
mongo -u admin -p admin123 --authenticationDatabase admin

Step 21:
mongo -u admin -p admin123 --authenticationDatabase admin

Step 22:
use whatsappclone

Step 23:
db.admins.insert({username: "admin", email: "admin@gmail.com" ,salt: "BSIHYXkIS0q23PjTeIWBMg==" ,hashedPassword: "UeMfAwSrGhCo6jz3bxQ6A3s0qMpoNDEyHh1oziihC4PTJ8lrI4LYvSRBvKIgQY2DtS8IVJCW2kab1uDz52KZ/g==" })

Step 24:
db.createUser({user:"username", pwd:"username", roles:[{role:"readWrite", db:"whatsappclone"}]})

Step 25:
exit

Step 26:
sudo apt install nodejs

Step 27:
sudo chown root:root  /var/www/whatsapp_clone

Step 28:
cd /var/www/whatsapp_clone/

Step 29:
mongoimport -u whatsappclone -p "username" --jsonArray -d whatsappclone -c settings --drop --file  app-settings-db.json

Step 30:
npm install --production

Step 31:
sudo npm install pm2@latest -g

Step 32:
export NODE_ENV=production

Step 33:
export PORT=9001

Step 34:
pm2 start ./bin/www --name="app_name"

Step 35:
pm2 save

Step 36:
Go to and compile all input field:
http://your-server-ip:9001/install
 
Step 37:
restart app_name
 
<br/><br/>
Download Android Source Code from:
https://github.com/deveperl99/WhatsApp-Clone-Android-Source
