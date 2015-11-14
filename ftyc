<?php

function consoleLog($text, $status = null) {

    switch($status) {
        case "SUCCESS": $out = "[0;32m"; break; // Green
        case "ERROR": $out = "[0;31m"; break; // Red
        case "WARNING": $out = "[1;33m"; break; // Yellow
        case "INFO": $out = "[0;34m"; break; // blue
        default: $out = "[0;37m"; // grey
    }

    return fwrite(STDOUT, chr(27) . "$out" . "$text" . chr(27) . "[0m");
}

class Frontyc {

    private $ftyc_dir = '.ftyc';
    private $ftyc_git = 'https://github.com/maoosi/frontyc.git';
    private $ftyc_gitBranch = '1.0';

    public $foundation = ["name"=>"foundation-sites", "version"=>"~6.0.0"];
    public $bourbon = ["name"=>"bourbon", "version"=>"~4.2.6"];

    private $requirements = [
        'Node'  => ['node -v', '>=', '0.10.29'],
        'Npm'   => ['npm --v', '>=', '1.4.14'],
        'Bower' => ['bower --v', '>=', '1.4.1'],
        'Git'   => ['git --version', '>=', '2.1.4']
    ];

    public function __construct() {

        consoleLog("\n".".--------------------------."."\n");
        consoleLog("|                          |"."\n");
        consoleLog("|    Welcome to Frontyc    |"."\n", "INFO");
        consoleLog("|                          |"."\n");
        consoleLog(".--------------------------."."\n\n");

        $this->runPrerequisite();

        if ( !file_exists($this->ftyc_dir) ) {
            $this->runInstall();
        } else {
            consoleLog("> Frontyc is already deployed !"."\n\n", "INFO");
            exit(0);
        }

        /*$name = fgets(STDIN);
        fwrite(STDOUT, "Hello $name");*/

        return exit(0);

    }

    private function runPrerequisite() {

        foreach ($this->requirements as $lib => $opt) {

            // Format version number for PHP
            $v = exec($opt[0]);
            $v = !strrpos($opt[0], " ") === false ? trim(substr($v, strrpos($v, " "))) : $v;
            $v = substr($v, 0, 1) === 'v' ? substr($v, 1) : $v;

            // Compare local version with requirement
            if ( version_compare($v, $opt[2], $opt[1]) ) consoleLog("\t"."$lib [ok]"."\n", "SUCCESS");
            else { consoleLog("\t"."$lib [x] $v"."\n", "SUCCESS"); exit(0); }

        }

        $this->br();

    }

    private function br() {

        return consoleLog("\n");

    }

    private function git() {

        // If git dir doens't exists -> git clone
        if ( !file_exists('./'. $this->ftyc_dir .'/'. $this->ftyc_gitBranch) ) {
            exec("git clone -b $this->ftyc_gitBranch $this->ftyc_git $this->ftyc_dir/$this->ftyc_gitBranch");
        }
        // If git dir exists -> git pull
        else {
            exec("(cd ./$this->ftyc_dir/$this->ftyc_gitBranch;git pull origin $this->ftyc_gitBranch)");
        }

        $this->br();

    }

    private function bower() {

        // Create .bowerrc file if not already exists
        if ( !file_exists('./.bowerrc') ) {
            $bowerrc = fopen(".bowerrc", "w") or consoleLog("> Unable to create .bowerrc file !"."\n\n", "ERROR");
            $bowerrcContent = "{\n\t\"directory\": \"vendor/bower/\",\n\t\"analytics\": false\n}";
            fwrite($bowerrc, $bowerrcContent);
            fclose($bowerrc);
        }

        // Create bower.json file if not already exists
        if ( !file_exists('./bower.json') ) {
            $bower = fopen("bower.json", "w") or consoleLog("> Unable to create bower.json file !"."\n\n", "ERROR");
            $bowerContent = "{\n\t\"name\": \"maoosi.frontyc\",\n\t\"dependencies\": {\n\t\t\"". $foundation['name'] ."\": \"". $foundation['version'] ."\",\n\t\t\"". $bourbon['name'] ."\": \"". $bourbon['version'] ."\"\n\t}\n}";
            fwrite($bower, $bowerContent);
            fclose($bower);
        }

        // Install bower dependencies
        exec("bower install");

    }

    private function config() {
        fopen("ftyc.yml", 'w');
    }

    private function ftycDir() {
        mkdir($this->ftyc_dir, 0700);
    }

    private function runInstall() {

        // Create .ftyc directory
        $this->ftycDir(); 

        // Create config file
        $this->config();

        // Clone compiler repo
        $this->git();

        // Npm installation
        exec("npm install");
        consoleLog("\n");

        // Bower installation
        $this->bower();

    }

};

$ftyc = new Frontyc();

?>
