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
require_once('dev/Languages.php');

/**
 * Seed database migration for dev mode:
 *    $ ddev ssh
 *    $ php craft migrate/up
 */
class m201208_083744_seedDatabase extends Migration implements Languages {
    
    // Constants .............................................................................................
    const CHARACTERS_COUNT = 100;
    const PLACES_COUNT = 100;
    const PERSONS_COUNT = 100;
    
    // Instance fields .......................................................................................
    private $_audiencesEntryIds = [];
    private $_env;

    private $_faker;
    private $_frenchFaker;

    private $_migrationService;
    private $_countryIds;

    // Constructors ..........................................................................................
    function __construct() {
        parent::__construct();
        $this -> _env = App::env('ENVIRONMENT');
        if ($this -> _env === 'dev') {
            $this -> _migrationService = new MigrationService();
            $this -> _countryIds = $this ->_migrationService -> getCountyIds();
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
            $this -> seedLanguages();
            $this -> seedPersons();
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
        $countryIds = $this ->_countryIds;
        $section = $this ->_migrationService -> placesSection();
        $entryType = $this ->_migrationService -> placesEntryType();
        for($i = 0 ; $i < self::PLACES_COUNT ; $i++) {
            $this ->_migrationService 
                  -> createFrenchEntry(
                      $faker -> address.", ". $faker -> city,
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

    private function seedPersons() {
        $faker = $this -> _frenchFaker;
        $section = $this ->_migrationService -> personsSection();
        $entryType = $this ->_migrationService -> personsEntryType();
        $placeIds = $this ->_migrationService -> getPlaceIds();
        $languageIds = $this ->_migrationService -> getLanguageIds();
        for($i = 0 ; $i < self::PERSONS_COUNT ; $i++) {
            $birthDate =  $faker -> dateTimeBetween('-500 years', '-20 years', null);
            $deathDate =  min(date_modify(clone $birthDate, '+'.$faker -> numberBetween(20, 100).' year'), new \DateTime('NOW'));
            $this ->_migrationService 
                  -> createFrenchEntry(
                      null,
                      $section,
                      $entryType,
                      [
                          'firstName' => $faker -> firstName,
                          'lastName' => $faker -> lastName,
                          'nickname' => $faker -> firstName." ". $faker -> firstName,
                          'gender' => array($faker -> randomElement(array('female', 'male', 'other'))),
                          'birthDate' => $birthDate,
                          'deathDate' => $deathDate,
                          'thesaurusDefinition' => $faker -> words(10, true),
                          'languages' => array($faker -> randomElement($languageIds)),
                          'birthPlace' => array($faker -> randomElement($placeIds)),
                          'place' => array($faker -> randomElement($placeIds))
                      ]
                    );
        }
    }

    private function seedLanguages() {
        $section = $this ->_migrationService -> languagesSection();
        $entryType = $this ->_migrationService -> languagesEntryType();
        for($i = 0; $i < count(Languages::LANGUAGES_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntryTitle($section,
                                    $entryType,
                                    Languages::LANGUAGES_FR[$i],
                                    Languages::LANGUAGES_EN[$i],
                                    Languages::LANGUAGES_IT[$i],
                                    Languages::LANGUAGES_GE[$i]);
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
