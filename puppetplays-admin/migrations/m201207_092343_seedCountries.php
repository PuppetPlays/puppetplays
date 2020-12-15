<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;

require_once('MigrationService.php');
require_once('Countries.php');

/**
 * m201207_092343_seedCountries migration.
 */
class m201207_092343_seedCountries extends Migration implements Countries {

    // Constants .............................................................................................
    
    // Instance fields .......................................................................................
    private $_migrationService;

    // Constructors ..........................................................................................
    function __construct() {
        parent::__construct();
        $this->_migrationService = new MigrationService();
    }

    // Methods ...............................................................................................
    private function seedCountries() {
        $section = $this ->_migrationService -> countriesSection();
        $entryType = $this ->_migrationService -> countriesEntryType();
        for($i = 0; $i < count(Countries::COUNTRIES_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntry($section,
                                $entryType,
                                Countries::COUNTRIES_FR[$i],
                                Countries::COUNTRIES_EN[$i],
                                Countries::COUNTRIES_IT[$i],
                                Countries::COUNTRIES_GE[$i]);
        }
    }

    // Abstract methods implementations ......................................................................
    /**
     * @inheritdoc
     */
    public function safeUp() {
        $this -> seedCountries();
        //throw new Exception('the migration will not be applied');
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo 'm201207_092343_seedCountries cannot be reverted.\n';
        return false;
    }
}
