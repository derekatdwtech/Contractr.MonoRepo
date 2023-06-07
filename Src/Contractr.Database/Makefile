USER:="sa"
PASSWORD:="MyC0m9l&xP@ssw0rd"

docker-context:
	kubectl config use-context docker-desktop

mssql-pod: docker-context
	kubectl create ns mssql || true
	kubectl create secret generic mssql --from-literal=SA_PASSWORD=${PASSWORD} -n mssql || true
	kubectl apply -f mssql-k8s.yaml -n mssql

create-database:
	sqlcmd -S 127.0.0.1,1433 -Q "CREATE DATABASE contractr;" -U ${USER} -P ${PASSWORD}

drop-database:
	sqlcmd -S 127.0.0.1,1433 -Q "DROP DATABASE contractr;" -U ${USER} -P ${PASSWORD}

seed-database:
	sqlcmd -S 127.0.0.1,1433 -d contractr -i Test/seed_data.sql -U ${USER} -P ${PASSWORD}

migrate-local:
	flyway migrate -user=${USER} -password=${PASSWORD} -url='jdbc:sqlserver://localhost:1433;databaseName=contractr' -locations=filesystem:Migrations/ -driver='com.microsoft.sqlserver.jdbc.SQLServerDriver'

clean:
	flyway migrate -user=${USER} -password=${PASSWORD} -url='jdbc:sqlserver://localhost:1433;databaseName=contractr' -locations=filesystem:Migrations/ -driver='com.microsoft.sqlserver.jdbc.SQLServerDriver'
