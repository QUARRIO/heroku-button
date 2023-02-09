#! /bin/bash

HEROKU_APP=$1
#POSTGRES_DB_NAME=$2

HEROKU_POSTGRES_ADD_ON_NAME=$(heroku pg:info -a ${HEROKU_APP} | grep -i Add-on | awk '{print $2}')

RAW_POSTGRES_CREDENTIALS=$(heroku pg:credentials:url ${HEROKU_POSTGRES_ADD_ON_NAME} -a ${HEROKU_APP})
DB_HOST=$(echo ${RAW_POSTGRES_CREDENTIALS} | awk -F 'host=' '{ print $2 }' | awk -F ' ' '{ print $1 }')
DB_NAME=$(echo ${RAW_POSTGRES_CREDENTIALS} | awk -F 'dbname=' '{ print $2 }' | awk -F ' ' '{ print $1 }')
DB_USER=$(echo ${RAW_POSTGRES_CREDENTIALS} | awk -F 'user=' '{ print $2 }' | awk -F ' ' '{ print $1 }')
DB_PASSWORD=$(echo ${RAW_POSTGRES_CREDENTIALS} | awk -F 'password=' '{ print $2 }' | awk -F ' ' '{ print $1 }')

## uncomment the below to debug
#echo "|---------------------------------------------------------------------------------------------------------------------------------------------------------"
#echo "| RAW_POSTGRES_CREDENTIALS"
#echo "|---------------------------------------------------------------------------------------------------------------------------------------------------------"
#echo " ${RAW_POSTGRES_CREDENTIALS}"
#echo "---------------------------------------------------------------------------------------------------------------------------------------------------------"

echo ""
echo "|-------------------------------------------------------------------------------------"
echo "| PostgreSQL Credentials:"
echo "|-------------------------------------------------------------------------------------"
echo "| DB_HOST:      ${DB_HOST}"
echo "| DB_NAME:      ${DB_NAME}"
echo "| DB_USER:      ${DB_USER}"
echo "| DB_PASSWORD:  ${DB_PASSWORD}"
echo "|-------------------------------------------------------------------------------------"
echo ""