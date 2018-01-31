cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan config:clear
mkdir storage
mkdir storage/app
mkdir storage/app/public
mkdir storage/framework
mkdir storage/framework/cache
mkdir storage/framework/sessions
mkdir storage/framework/views
mkdir storage/logs
chmod -R 777 storage
cd ../site
npm install
npm run dev