<h1>Authentication system</h1>
<p>This app use REST API ,MongoDB , JWT for authorization and Bcrypt to hash password in database
<hr/>

<h2>Installation</h2>
First you should install node.js on your system
in debian linux you can type below command to install node.js
<pre>sudo apt install node</pre>
</br>
Now clone this package on your system:
<pre>git clone https://github.com/soroush-habibi/Authentication-Node.js.git</pre>
or download it directly
</br>
Now open your terminal in source folder and execute below command:
<pre>npm install</pre>
</hr>
<h2>How to use this package?</h2>
Type below command in terminal:
<pre>
node index
</pre>
Now Web Server is running on 3000 port by default.you can change port in ".env" file.now open below link in your browser:
<pre>localhost:3000</pre>
You can also use loopback address<br/>
Now you can see two option: sign up & login<br/>
Use sign up to make an account<br/>
Everytime you log in to your account a new json web token will be created and save in cookies and old token will expire.if you dont open site for 7 days you must sign in again