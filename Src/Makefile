local-database:
	$(MAKE) -C ./Contractr.Database mssql-pod 
	
new-database:
	$(MAKE) -C ./Contractr.Database create-database

drop-database:
	$(MAKE) -C ./Contractr.Database drop-database
	
seed-database:
	$(MAKE) -C ./Contractr.Database seed-database

migrate-database: 
	$(MAKE) -C ./Contractr.Database migrate-local

clean-database: drop-database new-database migrate-database seed-database