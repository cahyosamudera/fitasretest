# DevOps/SRE Engineer Take Home Test
You need to:
1. Clone this repo and update based on the Tasks section below
2. Create a new repo for TF configuration part (plus point)
3. Email us back with your repo URLs

---
# Quick Start

This repo contains source code for simple express application that reads data from Postgres database.
## Prerequisites
- [NodeJS LTS/fermium](https://nodejs.org/en/about/releases/)
- [Postgres](https://www.postgresql.org/)
- Docker
- [Gitlab Runner](https://docs.gitlab.com/runner/install/) - (Nice to have)
- [Terraform](https://www.terraform.io/) - (Nice to have) 

## How to run the code
1. Create `.env` file in the root folder, populate from `.env.example`
1. Update `.env` file based on your DB configuration
1. Run `npm i`
1. Migrate schema: `npm run migrate`
1. Migrate data: `npm run seed`
1. Run app `npm start` 

## API Specification
| API Route | Description |
|---|---|
| {base_url}/health | Return OK when the DB is connected and API is up and running |
| {base_url}/users | Return all data in `users` table, populated during the migration |



## Environment Variables
The DB connection is maintained as environment variables.
```
username='username'
password='password'
database='database_name'
host='127.0.0.1'
port='5432'
```
default API port: 3000


---

# Tasks
As a DevOps engineer, you are requested by the team to:
1. Containerize the application
1. Build continous integration pipeline
1. Build continous delivery pipeline
1. Provision infrastructure as code(not must-have, but will be a big plus)

## Design

```
┌───────────────────┐
│ K8s cluster       │
│   ┌────────────┐  │  ┌──────────┐
│   │  Web App   ├──┼─►│   DB     │
│   │(Express JS)│  │  │(Postgres)│
│   └────────────┘  │  └──────────┘
│                   │       ▲
└───────────────────┘       │
       ▲                    │
       │                    │
    ┌──┴────────────────────┴────┐
    │ Infrastructure Provisioner │
    │       (Terraform)          │
    └────────────────────────────┘
```

For the Kubernetes cluster, you may use managed platform, like GKE, AKS, EKS. Or, you may deploy it in your local k8s cluster with Minikube / k3s. The same rules for the DB. You may use managed Postgres or local Postgres server.

The infrastructure provisioner (Terraform) part is not a must-have. You may setup the infra manually. However, we will consider it as a big plus if you can provide Terraform configuration to provision the cluster and the DB. You may push the TF codes in a seperate repo.

## Containerize the web app
You need to create a `Dockerfile` file to containerize this application. When spawning a new container, the app should run locally and migrate schema and data to the DB.

## Create kubernetes deployment
You also need to create [kubernetes deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) config file. You need to create 2 different deployment files: `dev-deploy.yml` for development env and `prod-deploy.yml` for production env. 

**Plus**
- Use [helm chart](https://helm.sh/docs/chart_template_guide/getting_started/) for k8s deployment templating


## Build CI/CD pipelines
You need to create `.gitlab-ci.yml` file with the following requirements: 

| Environment | Stages | Trigger | Action |
|---|---|---|---|
| Development | Build | Merge to dev | Build Docker image with latest tag |
|  | Deploy | Automatic | Deploy as k8s pod. Namespace: `dev` |
| Production | Build | Create a new tag | Build Docker image with version tag |
|  | Deploy | Manual | Deploy as k8s pod with 2 replicas. Namespace: `prod` |

**Hint**

You may use local [gitlab runner](https://docs.gitlab.com/runner/install/) to validate and run your `.gitlab-ci.yml` file locally.

**Plus**
- Store configuration in a secret manager, e.g., [k8s secrets](https://kubernetes.io/docs/concepts/configuration/secret/), GCP secret manager, etc.

## Create Infrastructure as Code
> This part is not mandatory. However, we will consider it as a big plus. Please publish the Terraform configuration files in a seperate repo.

### Prerequisites
- Terraform v1
- Kubernetes v1.21

### Requirements
1. Create k8s namespaces, `dev` and `prod`
1. Create k8s deployment for the web app with liveness probe by hitting `/health` API
1. Create a new database in postgres 