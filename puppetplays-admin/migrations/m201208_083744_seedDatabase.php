<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\helpers\App;
use Faker\Factory;
use craft\elements\Entry;
use craft\models\EntryType;
use craft\events\ModelEvent;
use yii\base\Event;

require_once('MigrationService.php');

/**
 * Seed database migration for dev mode:
 *    $ ddev ssh
 *    $ php craft migrate/up
 */
class m201208_083744_seedDatabase extends Migration {
    
    // Constants .............................................................................................
    const AUDIENCES = 'audiences';
    const CHARACTERS = 'characters';

    const CHARACTERS_COUNT = 10;
    const PLACES_COUNT = 10;
    
    
    // Instance fields .......................................................................................
    private $_audiencesEntryIds = [];
    private $_env;

    private $_faker;
    private $_frenchFaker;

    private $_migrationService;

    // Constructors ..........................................................................................
    function __construct() {
        parent::__construct();
        $this -> _env = App::env('ENVIRONMENT');
        if ($this -> _env === 'dev') {
            $this->_migrationService = new MigrationService();
            $this -> _faker = Factory::create();
            $this -> _frenchFaker = Factory::create('fr_FR');
        }
    }

    // Methods ...............................................................................................


    // Abstract methods implementations ......................................................................
    /**
     * @inheritdoc
     */
    public function safeUp() {
        if ($this -> _env === 'dev') {
            $this -> seedAudiences();
            $this -> seedCharacters();
            $this -> seedPlaces();
        }
        //throw new Exception('the migration will not be applied');
    }

    private function seedAudiences() {
        $this -> seedAudience('enfants', 'children', 'bambini', 'kinder');
        $this -> seedAudience('plus de 6 ans', 'over 6 years', 'oltre 6 anni', 'über 6 Jahre');
        $this -> seedAudience('adultes', 'adults', 'adulti', 'erwachsene');
        $this -> seedAudience('tout public', 'for all', 'per tutti', 'für alle');
    }

    private function seedAudience($frenchTitle, $englishTitle, $italianTitle, $germanTitle) {
        $section = $this ->_migrationService -> audiencesSection();
        $entryType = $this ->_migrationService -> audiencesEntryType();
        $this ->_migrationService 
              -> seedEntryTitle($section,
                                $entryType,
                                $frenchTitle,
                                $englishTitle,
                                $italianTitle,
                                $germanTitle);
    }

    private function seedCharacters() {
        $section = $this ->_migrationService -> charactersSection();
        $entryType = $this ->_migrationService -> charactersEntryType();
        for($i = 0 ; $i < self::CHARACTERS_COUNT ; $i++) {
            $this ->_migrationService 
                  -> createFrenchEntry($this -> _frenchFaker -> lastName, $section, $entryType);
        }
    }

    private function seedPlaces() {
        $faker = $this -> _frenchFaker;
        $countryIds = $this ->_migrationService -> getCountyIds();
        $section = $this ->_migrationService -> placesSection();
        $entryType = $this ->_migrationService -> placesEntryType();
        for($i = 0 ; $i < self::PLACES_COUNT ; $i++) {
            $this ->_migrationService 
                  -> createFrenchEntry(
                      $faker -> city,
                      $section,
                      $entryType,
                      [
                          'longitude' => $faker -> longitude,
                          'latitude' => $faker -> latitude,
                          'country' => array($faker -> randomElement($countryIds))
                      ]
                    );
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown() {
        echo "m201125_083744_createUserInformations cannot be reverted.\n";
        return false;
    }
}
