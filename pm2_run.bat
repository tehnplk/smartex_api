@echo off
pm2 kill && pm2 start ./bin/www -i 4 --name smartex_api && pause