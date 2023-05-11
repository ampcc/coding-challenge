# **coding-challenge by amplimind and THI**
*Insert logos here*

## **1. Idea behind the project**
This project aims to provide a web-based solution for ampliminds application process.\
For that, a group of 12 computer science students from the THI work as main developer under the guidance of amplimind.\
\
This project is kept **open source**, despite being used in a business context.

## **2. SW-Architecture**
This projects software consists of three parts:
- A **frontend server**, displaying the web-based application
- A **backend server**, implementing the applications logic
- A **PostgreSQL database**, holding the data 

The frontend communicates with the backend via **REST** and vice versa.

## **3. Used technologies**
- **Frontend:** Angular/Node.js
- **Backend:** Django library (python)
- **Database:** PostgreSQL

## **4. About the projects secrets**
In order not to expose secrets like e.g. the used secret key for encryption, additional files are used to provide these informations while being excluded from the repository.\
You will need the following files:
- A **.env** file 
- A **privateKey.pem** file

Both files need to be in the **coding-challenge/backend/codingchallenge** directory

### **4.1 The .env file**
The .env file must have the following structure:\
```
SECRET_KEY="secret"
ENCRYPTION_KEY='secret='
GH_APP_INSTALLATION_ID='secret'
GH_APP_ID='secret'
```

### **4.2 The privateKey.pem**
The privateKey.pem file must have the following structure:\
```
-----BEGIN RSA PRIVATE KEY-----
secret==
-----END RSA PRIVATE KEY-----
```

## **5. Local deployment**

