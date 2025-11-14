# Azure DevOps Pipeline Documentation

## Overview

This pipeline implements a complete CI/CD workflow for the Sports Court Reservation System, including:
- **Code Coverage** for both frontend and backend
- **Static Code Analysis** with SonarCloud
- **Automated Deployment** to Azure Web Apps (QA environment)
- **End-to-End Testing** with Cypress

## Pipeline Structure

### Stage 1: Build, Test & SonarCloud

#### Backend Job (Python/FastAPI)
1. **Setup Python 3.10** - Configures Python environment
2. **Install Dependencies** - Installs packages from `requirements.txt`
3. **Setup Environment** - Copies `.env.example` to `.env`
4. **SonarCloudPrepare** - Prepares SonarCloud analysis
   - Organization: `baltasarlopezv`
   - Project Key: `baltasarlopezv_2025_TP07_Code_coverage_integration_tests`
5. **Run pytest** - Executes unit tests with coverage
   - Generates `coverage.xml` for code coverage
   - Generates `test-results.xml` for test results
6. **SonarCloudAnalyze** - Runs static code analysis
7. **SonarCloudPublish** - Publishes results to SonarCloud
8. **Publish Test Results** - Uploads test results to Azure DevOps
9. **Publish Code Coverage** - Uploads coverage report to Azure DevOps
10. **Publish Artifact** - Publishes backend code for deployment

#### Frontend Job (React/Vite)
1. **Setup Node.js 18.x** - Configures Node environment
2. **Install Dependencies** - Runs `npm ci` to install packages
3. **Run vitest** - Executes unit tests with coverage
   - Generates `cobertura-coverage.xml` for Azure DevOps
   - Generates `test-results.xml` for test results
4. **Publish Test Results** - Uploads test results to Azure DevOps
5. **Publish Code Coverage** - Uploads coverage report to Azure DevOps
6. **Build Frontend** - Runs `npm run build` to create production build
7. **Publish Artifact** - Publishes `dist/` folder for deployment

### Stage 2: Deploy to QA & E2E Tests

#### Deploy Backend
- **Target:** Azure Web App `tp7-courts-api-qa`
- **Runtime:** Python 3.10
- **Startup Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`

#### Deploy Frontend
- **Target:** Azure Web App `tp7-courts-web-qa`
- **Runtime:** Node.js 18 LTS
- **Content:** Static files from `dist/` folder

#### Cypress E2E Tests
1. **Setup Node.js** - Configures Node environment for Cypress
2. **Install Cypress** - Installs Cypress and dependencies
3. **Run E2E Tests** - Executes Cypress tests against deployed QA environment
   - Base URL: `https://tp7-courts-web-qa.azurewebsites.net`
   - API URL: `https://tp7-courts-api-qa.azurewebsites.net`
4. **Publish Test Results** - Uploads Cypress test results
5. **Publish Screenshots** - Uploads screenshots on test failure

## Quality Gates

The pipeline will **fail** if:
- ✗ Backend unit tests fail (pytest)
- ✗ Frontend unit tests fail (vitest)
- ✗ Code coverage is below 70% (configured in `vite.config.js`)
- ✗ SonarCloud detects critical issues
- ✗ Cypress E2E tests fail

## Prerequisites

### Azure DevOps
1. **SonarCloud Extension** - Must be installed in your Azure DevOps organization
2. **Service Connections:**
   - `SonarCloud` - Connection to SonarCloud
   - `Azure-Service-Connection` - Connection to Azure subscription

### Azure Resources
1. **Backend Web App:**
   - Name: `tp7-courts-api-qa`
   - Runtime: Python 3.10 or higher
   - OS: Linux

2. **Frontend Web App:**
   - Name: `tp7-courts-web-qa`
   - Runtime: Node.js 18 LTS
   - OS: Linux

### Environment Setup
1. **Backend `.env` file** - Automatically created from `.env.example` during build
2. **Frontend Environment Variables** - Configured in Azure Web App settings:
   - `VITE_API_URL` - URL of the backend API

## Running Tests Locally

### Backend Tests
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
pytest
```

### Frontend Tests
```bash
cd frontend
npm ci
npm run test:coverage
```

### Cypress E2E Tests
```bash
cd frontend
npm ci
npx cypress install
npx cypress run
```

## Coverage Reports

### Backend
- **Format:** XML (Cobertura)
- **Location:** `backend/coverage.xml`
- **Configured in:** `backend/pytest.ini`
- **Minimum Coverage:** 70%

### Frontend
- **Format:** Cobertura XML
- **Location:** `frontend/coverage/cobertura-coverage.xml`
- **Configured in:** `frontend/vite.config.js`
- **Minimum Coverage:** 70%

## SonarCloud Configuration

### Backend Analysis
- **Scanner Mode:** CLI
- **Project Key:** `baltasarlopezv_2025_TP07_Code_coverage_integration_tests`
- **Coverage Report:** `backend/coverage.xml`
- **Source Directory:** `backend/app`
- **Test Directory:** `backend/tests`
- **Exclusions:**
  - `backend/venv/**`
  - `backend/tests/**`
  - `backend/app/routes/**`
  - `backend/app/init_db.py`

## Cypress Configuration

### Reporter
- **Format:** JUnit XML
- **Location:** `frontend/cypress/results/*.xml`
- **Configuration:** `frontend/cypress.config.js`

### Test Files
- **Location:** `frontend/cypress/e2e/**/*.cy.js`
- **Example Test:** `frontend/cypress/e2e/basic.cy.js`

## Troubleshooting

### Backend Tests Fail
1. Check that `email-validator` is installed
2. Verify `.env` file is created from `.env.example`
3. Check database connectivity (SQLite)

### Frontend Tests Fail
1. Verify all dependencies are installed with `npm ci`
2. Check that `jsdom` is available for tests
3. Review test configuration in `vite.config.js`

### Deployment Fails
1. Verify Azure service connection is configured
2. Check that Web Apps exist and are accessible
3. Verify runtime stack versions match (Python 3.10, Node 18)

### Cypress Tests Fail
1. Verify deployed URLs are accessible
2. Check that backend API is responding
3. Review Cypress screenshots in pipeline artifacts

## Pipeline Triggers

- **Automatic:** Triggered on push to `main` branch
- **Manual:** Can be triggered manually from Azure DevOps UI

## Artifacts

The pipeline produces the following artifacts:
1. **backend** - Backend Python code for deployment
2. **frontend** - Frontend static files (`dist/` folder)
3. **cypress-screenshots** - Screenshots from failed E2E tests (only on failure)

## Monitoring

### Azure DevOps Tabs
- **Tests** - View all test results (pytest, vitest, Cypress)
- **Code Coverage** - View coverage reports for backend and frontend
- **Extensions** - View SonarCloud analysis results

### SonarCloud Dashboard
- Access at: https://sonarcloud.io/organizations/baltasarlopezv
- Project: `2025_TP07_Code_coverage_integration_tests`
