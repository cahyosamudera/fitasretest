# DevOps/SRE Engineer Take Home Test

You need to:
1. Clone this repo, then update based on the **Tasks** section below
2. Create a new repo for Infrastructure as Code. Terraform is prefered. But feel free to use any similar tools.
3. Deploy to any environtment. You may use localhost and exposed through ngrok.io. You may also use public cloud, like GCP with free trial account.
4. Once #1, #2, #3 are ready, please inform us the repo URLs (#1 and #2) and application URL (#3).

---
# Quick Start

This repo contains source code for simple express application that reads data from Postgres database.

## Prerequisites
- [NodeJS LTS/fermium](https://nodejs.org/en/about/releases/)
- [Postgres](https://www.postgresql.org/)
- Docker
- [Gitlab Runner](https://docs.gitlab.com/runner/install/)
- [Terraform](https://www.terraform.io/) - or something similar for IaC, e.g., Vagrant, Ansible

## How to run this application code
1. Create `.env` file in the root folder, populate from `.env.example`
1. Update `.env` file based on your DB configuration
1. Run `npm i`
1. Migrate schema: `npm run migrate`
1. Migrate data: `npm run seed`
1. Run app `npm start` 
1. Open it on `localhost:3000`

## API Specification
| API Route | Description |
|---|---|
| {base_url}/health | Return OK when the DB is connected and API is up and running |
| {base_url}/users | Return all data in `users` table, populated during the migration |


## DB Connection
The DB connection is maintained as environment variables.
```
username='username'
password='password'
database='database_name'
host='127.0.0.1'
port='5432'
```

---

# Tasks
As a DevOps engineer, you are requested by the team to:
1. Containerize the application
1. Create kubernetes deployment
1. Build CI/CD pipeline
1. Deploy the application to publicly accessed env
1. Condify all the infrastructures needed as a code (IaC)

## Design

```
┌───────────────┐
│               │
│  Express App  │
│               │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│  Postgres DB  │
│               │
└───────────────┘
```

### Express App
You need to deploy this application as a container in a Kubernetes cluster. For the cluster, you may use managed platform, like GKE, AKS, EKS. Or, you may deploy it in your local k8s cluster with Minikube / k3s.

### Postgres DB
You need to provision Postgres DB server. You may use a stateful container inside of K8s cluser. Or you may use managed Postgres server like GCP's SQL Cloud.

## Environments
You need to provide 2 environment in your configuration files: development and production. For the databases, you may decide how you do the separation, e.g., same DB but different schema, or completly different DB servers.

## Task 1 - Containerize the web app
You need to create a `Dockerfile` file to containerize this application. When spawning a new container, the app should run locally and migrate schema and data to the DB.

## Task 2 - Create kubernetes deployment
You also need to create [kubernetes deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) config file. You need to create 2 different deployment files: `dev-deploy.yml` for development env and `prod-deploy.yml` for production env. 

**Plus**

Use file templating, like helmChart, or jsonnet-based tools like tanka, qbec, or kubecfg

## Task 3 - Build CI/CD pipelines
You need to create `.gitlab-ci.yml` file with the following requirements: 

| Environment | Stages | Trigger | Action |
|---|---|---|---|
| Development | Build | Merge to dev | Build Docker image with latest tag |
|  | Deploy | Automatic | Create deployment with replica set. Namespace: `dev` |
| Production | Build | Create a new tag | Build Docker image with version tag |
|  | Deploy | Manual | Create deployment with replica set with 2 replicas. Namespace: `prod` |

**Hint**

You may use local [gitlab runner](https://docs.gitlab.com/runner/install/) to validate and run your `.gitlab-ci.yml` file locally.

**Plus**

Store configuration in a secret manager, e.g., [k8s secrets](https://kubernetes.io/docs/concepts/configuration/secret/), GCP secret manager, etc.

##  Task 4 - Deploy the application to publicly accessed env
Once done, you need to deploy the application and database into a publicly accessed environment. This is only for the production environment. If you are using localhost, make sure you activate [ngrok.io](ngrok.io). If you use public cloud, make sure it has public IP address / DNS associated.

## Task 5 - Codify all infrastrctures as code (IaC)
We would definitly consider as a big plus if you can provide infrastructure as a code to provision above building blocks. For this, you may use Terraform, Vagrant, or Ansible. Please provide a new repo to store IaC configuration files.
