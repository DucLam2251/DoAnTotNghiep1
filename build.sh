docker-compose -f be.yaml down
docker-compose -f fe.yaml down
cd ui
docker build -t fe .
cd ~/DoAnTotNghiep/server/Web\ Api/CompanyEmployees
docker build -f CompanyEmployees/Dockerfile -t be .
docker-compose -f be.yaml up -d
docker-compose -f fe.yaml up -d