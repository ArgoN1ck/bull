#!/bin/bash
set -e
export CURRENT_UID=$(id -u):$(id -g)

if [ -z "${PORT}" ]; then
    export PORT=3333
fi

if [ -z "${PSQL_HOST}" ]; then
    export PSQL_HOST=10.0.1.1
fi

if [ -z "${PSQL_PORT}" ]; then
    export PSQL_PORT=5432
fi

if [ -z "${CI_PROJECT_NAMESPACE}" ]; then
    export CI_PROJECT_NAMESPACE=bull
fi

if [ -z "${CI_PROJECT_NAME}" ]; then
    export CI_PROJECT_NAME=bull
fi

if [ -z "${CI_PROJECT_CODE}" ]; then
    export CI_PROJECT_CODE=bull
fi

if [ -z "${CI_REGISTRY}" ]; then
    export CI_REGISTRY=ghcr.io
fi

if [ -z "${CI_REGISTRY_USER}" ]; then
    export CI_REGISTRY_USER=ArgoN1ck
fi

if [ -z "${ROOT_DOMAIN}" ]; then
    export ROOT_DOMAIN=bull.io
fi

if [ -z "${TAG_VERSION}" ]; then
    if [ -z "${CI_COMMIT_SHORT_SHA}" ]; then
        export TAG_VERSION=$(date +'%Y%m%d%H%M%S')
    else
        export TAG_VERSION=${CI_COMMIT_SHORT_SHA}
    fi
fi

export DEPLOY_DATE=$(date +'%Y-%m-%d %H:%M:%S')
export DEPLOY_COMMIT=${CI_COMMIT_SHORT_SHA}
export DEPLOY_VERSION=$(node -pe "require('../package.json')['version']")

if [ -z "${CI_BRANCH_NAME}" ]; then
    export BRANCH_NAME=develop
else
    export BRANCH_NAME=$CI_BRANCH_NAME
fi

if [ -z "${CI_BRANCH_NAME}" ]; then
    if [ "$BRANCH_NAME" == "master" ]; then
        if [ -z "${PSQL_DATABASE}" ]; then
            export PSQL_DATABASE=${CI_PROJECT_CODE}_${BRANCH_NAME}
        fi
        if [ -z "${CI_ENVIRONMENT_URL}" ]; then
            export PROJECT_URL=https://${ROOT_DOMAIN}
        else
            export PROJECT_URL=${CI_ENVIRONMENT_URL}:${PORT}
        fi
    else
        if [ -z "${PSQL_DATABASE}" ]; then
            export PSQL_DATABASE=${CI_PROJECT_CODE}_${BRANCH_NAME}
        fi
        if [ -z "${CI_ENVIRONMENT_URL}" ]; then
            export PROJECT_URL=https://${BRANCH_NAME}.${ROOT_DOMAIN}
        else
            export PROJECT_URL=${CI_ENVIRONMENT_URL}:${PORT}
        fi
    fi
else
    if [ -z "${PSQL_DATABASE}" ]; then
        export PSQL_DATABASE=${CI_PROJECT_CODE}_${BRANCH_NAME}
    fi
    if [ "$BRANCH_NAME" == "master" ]; then
        if [ -z "${CI_ENVIRONMENT_URL}" ]; then
            export PROJECT_URL=https://${ROOT_DOMAIN}
        else
            export PROJECT_URL=${CI_ENVIRONMENT_URL}:${PORT}
        fi
    else
        if [ -z "${CI_ENVIRONMENT_URL}" ]; then
            export PROJECT_URL=https://${BRANCH_NAME}.${ROOT_DOMAIN}
        else
            export PROJECT_URL=${CI_ENVIRONMENT_URL}:${PORT}
        fi
    fi
fi
export PROJECT_DOMAIN="${PROJECT_URL/https:\/\//}"
export PROJECT_DOMAIN="${PROJECT_DOMAIN/http:\/\//}"

export PSQL_URL=postgres://${PSQL_USERNAME}:${PSQL_PASSWORD}@${PSQL_HOST}:${PSQL_PORT}/${PSQL_DATABASE}?schema=public

export NAMESPACE=${CI_PROJECT_CODE}-$BRANCH_NAME

export SERVER_BASE_IMAGE=${CI_PROJECT_NAME}/server-base-image:${TAG_VERSION}
export SERVER_IMAGE=${CI_PROJECT_NAME}/server-image:${TAG_VERSION}
