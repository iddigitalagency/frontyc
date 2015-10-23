# Create directories
if [ ! -d ./--sources ]; then
echo -e "\e[96m--> [1/9] Creating main directories"
mkdir -p ./--preview ./--config ./--sources
else
echo -e "\e[90m--> [1/9] Skipped ! Main directories already exists..."
fi

# Copy config files
if [ ! -f ./--config/compiler.js ]; then
echo -e "\e[96m--> [2/9] Copying config files"
cp ./vendor/maoosi/frontyc/compiler/config/*.js ./--config/
sed -i "s/var root_dir = '..\/';/var root_dir = '..\/..\/..\/..\/';/g" ./--config/paths.js
else
echo -e "\e[90m--> [2/9] Skipped ! Config files already exists..."
fi

# Copy Bower files
if [ ! -f ./bower.json ]; then
echo -e "\e[96m--> [3/9] Copying bower files"
cp ./vendor/maoosi/frontyc/bower.json ./bower.json
cp ./vendor/maoosi/frontyc/.bowerrc ./.bowerrc
else
echo -e "\e[90m--> [3/9] Skipped ! Bower files already exists..."
fi

# Create external.js
if [ ! -f ./vendor/maoosi/frontyc/compiler/config/external.js ]; then
echo -e "\e[96m--> [4/9] Creating external.js config"
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
echo -e "\e[90m--> [4/9] Skipped ! external.js files already exists..."
fi

# Copy boilerplate files
if [ ! -d ./--sources/views ]; then
echo -e "\e[96m--> [5/9] Generating project starter"
cp -R ./vendor/maoosi/frontyc/--sources/ ./
else
echo -e "\e[90m--> [5/9] Skipped ! You don't need any project starter..."
fi

# Bower install
if [ ! -d ./vendor/bower ]; then
echo -e "\e[96m--> [6/9] Installing bower libraries"
bower install --silent
else
echo -e "\e[90m--> [6/9] Skipped ! Bower libraries already installed..."
fi

# Alias setup
echo -e "\e[96m--> [7/9] Quick ftyc alias setup"
alias ftyc='function _frontyc(){ (cd ./vendor/maoosi/frontyc/compiler/;gulp "$@") };_frontyc'

# Npm install
if [ ! -d ./vendor/maoosi/frontyc/compiler/node_modules ]; then
echo -e "\e[96m--> [8/9] Installing npm libraries (could take a while)"
(cd ./vendor/maoosi/frontyc/compiler/;sudo npm install --silent)
else
echo -e "\e[90m--> [8/9] Skipped ! Npm libraries already installed..."
fi

# Updating GitIgnore 
if [ -f .gitignore ];then
echo -e "\e[96m--> [9/9] reading and updating .gitignore"
  if ! grep -q "/vendor/" .gitignore; then
   echo "/vendor/ " >> .gitignore
  fi
  if ! grep -q "/node-modules/" .gitignore; then
   echo "/node-modules/ " >> .gitignore
  fi
echo " .Gitignore file Updated"
else
 echo -e "\e[90m--> [9/9] Skipped ! Cannot find .gitignore file."
fi

echo -e "\e[92m--> Frontyc setup is done ! Let's try it by typing any ftyc command."
echo -e "\e[39m"