# **coding-challenge by amplimind and THI**
*Insert logos here*

## **1. Idea behind the project**
This project aims to provide a web-based solution for ampliminds application process.\
For that, a group of 12 computer science students from the THI work as main developer under the guidance of amplimind.\
\
This project is kept **open source**, despite being used in a business context.

## **2. SW-Architecture**
The software consists of three parts:
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

Both files need to be in the **coding-challenge/backend/codingchallenge/** directory

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
In order to keep the project platform-independent, docker container are used, while the frontend, backend and the database all run in their own you container.

### **5.1 Prerequisites**
You will need to have docker installed on your machine in order to run the container.\
When you are on **Windows** or **MacOS**, you only can install **Docker Desktop**. This will install the **Docker Engine**, a Linux VM, in which the container are executed, and a GUI.\
When you are on **Linux**, you can either install the **Docker Engine** directly or the whole **Docker Desktop**. Which one you want to use is up to you.

### **5.2 Options for local deployment**
You have the following options to deploy the software on your local machine:
1. **Start the project as a whole**\
   Use `docker compose up` in the root directory to start all container at once in the same network.\
   When you want to stop the container, use `docker compose down`.\
   While running, the container are accessible at the following addresses:
   - **Frontend:** 0.0.0.0:4200
   - **Backend:** 0.0.0.0:8000
   - **Database:** 0.0.0.0:5432

2. **Start the container separately**\
   This option is intended for when you are working on the projekt and don't want to install every technology needed.\
   **E.g.** You are working on the frontend and don't want to install python and django for the backend. Then you can start the backend container and don't need to install anything.\
   To simplify the handling of the container, start and stop scripts (**.sh** for Linux/MacOS and **.bat** for Windows) are available in the frontend and backend directory.\
   If you want more control on which images/container you want to keep, how you want to start the container, etc. you can always use the **Docker Desktop** GUI.

## **6. Additional information**
For more detailed information on the projekt, visit the corresponding [wiki] (https://github.com/ampcc/coding-challenge/wiki).
