# **coding-challenge by amplimind and THI**
![thi&amplimind_logo](./readme_assets/cc_logos.png)

## **Table of contents**
- [**coding-challenge by amplimind and THI**](#coding-challenge-by-amplimind-and-thi)
  - [**Table of contents**](#table-of-contents)
  - [**1. Idea behind the project**](#1-idea-behind-the-project)
  - [**2. SW-Architecture**](#2-sw-architecture)
  - [**3. Used technologies**](#3-used-technologies)
  - [**4. About the projects secrets**](#4-about-the-projects-secrets)
    - [**4.1 The .env file**](#41-the-env-file)
    - [**4.2 The privateKey.pem file**](#42-the-privatekeypem-file)
  - [**5. Local deployment**](#5-local-deployment)
    - [**5.1 Prerequisites**](#51-prerequisites)
    - [**5.2 Options for local deployment**](#52-options-for-local-deployment)
  - [**6. Jobs for the database**](#6-jobs-for-the-database)
  - [**7. Additional information**](#7-additional-information)


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

### **4.2 The privateKey.pem file**
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
docker-compose is used to deploy the project.\
To start the container, use `docker compose up` in the root directory.\
To stop the container, use `docker compose down`.\
While running, the container are accessible at the following addresses:
- **Frontend:** 0.0.0.0:4200
- **Backend:** 0.0.0.0:8000
- **Database:** 0.0.0.0:5432

When you edit the source code while the container are running, all changes are directly transfered inside the container. Therefor, you won't need to restart the container or even install any resources.\
This is the prefered way for the development.\
\
If, for whatever reason, you want to start the container separately, you'll need to change the settings.py in the backend to connect to the outdated sqlite3 database. Whether the container will work is not guaranteed.\
The frontend container on the other hand can be started with almost no downsides.\
\
If you only want to work on the backend and also don't want to use docker-compose, you will need to change the settings.py file too. On top of that, you will need to [setup a virtual environment](https://github.com/ampcc/coding-challenge/wiki/Virual-Environment-Setup) in order maintain compability.

## **6. Jobs for the database**
This project uses jobs in order to maintain the data inside the databse.\
Jobs are preferred over traditional PostgreSQL trigger, because jobs can be called periodically on a specific time, while trigger don't have such a functionality.\
Additionally, the jobs are defined inside the backend using the django-extensions library. They are not defined inside the database, since this would make the database and the container setup more complex, while the database is already heavily dependent on the backend. Therefor the simpler solution, having the jobs being defined inside the backend, is chosen.\
The jobs are scheduled using cron. This process is run in parallel to the django server.

## **7. Additional information**
For more detailed information on the projekt, visit the corresponding [wiki](https://github.com/ampcc/coding-challenge/wiki).
