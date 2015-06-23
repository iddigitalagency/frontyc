# Create directories
if [ ! -d ./--sources ]; then
echo -e "\e[96m--> [1/8] Creating main directories"
mkdir -p ./--preview ./--config ./--sources
else
echo -e "\e[90m--> [1/8] Skipped ! Main directories already exists..."
fi

# Copy config files
if [ ! -f ./--config/compiler.js ]; then
echo -e "\e[96m--> [2/8] Copying config files"
cp ./vendor/maoosi/frontyc/compiler/config/*.js ./--config/
sed -i "2s/.*/var root_dir = '../../../../';/" ./--config/paths.js
else
echo -e "\e[90m--> [2/8] Skipped ! Config files already exists..."
fi

# Copy Bower files
if [ ! -f ./bower.json ]; then
echo -e "\e[96m--> [3/8] Copying bower files"
cp ./vendor/maoosi/frontyc/bower.json ./bower.json
cp ./vendor/maoosi/frontyc/.bowerrc ./.bowerrc
else
echo -e "\e[90m--> [3/8] Skipped ! Bower files already exists..."
fi

# Create external.js
if [ ! -f ./vendor/maoosi/frontyc/compiler/config/external.js ]; then
echo -e "\e[96m--> [4/8] Creating external.js config"
cat <<EOF >./vendor/maoosi/frontyc/compiler/config/external.js
/*
    Config folder
*/

var cfg = {
    configPath : '../../../../--config/'
};

exports.cfg = cfg;
EOF
else
echo -e "\e[90m--> [4/8] Skipped ! external.js files already exists..."
fi

# Copy boilerplate files
if [ ! -d ./--sources/views ]; then
echo -e "\e[96m--> [5/8] Generating project starter"
cp -R ./vendor/maoosi/frontyc/--sources/ ./
else
echo -e "\e[90m--> [5/8] Skipped ! You don't need any project starter..."
fi

# Bower install
if [ ! -d ./vendor/bower ]; then
echo -e "\e[96m--> [6/8] Installing bower libraries"
bower install --silent
else
echo -e "\e[90m--> [6/8] Skipped ! Bower libraries already installed..."
fi

# Alias setup
echo -e "\e[96m--> [7/8] Quick ftyc alias setup"
alias ftyc='function _frontyc(){ (cd ./vendor/maoosi/frontyc/compiler/;gulp "$@") };_frontyc'

# Npm install
if [ ! -d ./vendor/maoosi/frontyc/compiler/node_modules ]; then
echo -e "\e[96m--> [8/8] Installing npm libraries (could take a while)"
(cd ./vendor/maoosi/frontyc/compiler/;sudo npm install --silent)
else
echo -e "\e[90m--> [8/8] Skipped ! Npm libraries already installed..."
fi

echo -e "\e[92m--> Frontyc setup is done ! Let's try it by typing any ftyc command."
echo -e "\e[39m"