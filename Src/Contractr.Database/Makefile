USER:="sa"
PASSWORD:="MyC0m9l&xP@ssw0rd"
docker-context:
	kubectl config use-context docker-desktop
migrate-local:
	flyway migrate -user=${USER} -password=${PASSWORD} -url='jdbc:sqlserver://localhost:1433;databaseName=contractr' -locations=filesystem:Migrations/ -driver='com.microsoft.sqlserver.jdbc.SQLServerDriver'

clean:
	flyway migrate -user=${USER} -password=${PASSWORD} -url='jdbc:sqlserver://localhost:1433;databaseName=contractr' -locations=filesystem:Migrations/ -driver='com.microsoft.sqlserver.jdbc.SQLServerDriver'
