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
use craft\elements\Tag;

require_once('MigrationService.php');
require_once('dev/Languages.php');
require_once('dev/Keywords.php');
require_once('dev/Registers.php');
require_once('dev/HandlingTechniques.php');
require_once('dev/DramaturgicTechniques.php');
require_once('dev/Formats.php');

/**
 * Seed database migration for dev mode
 * 
 *  !!!!! be carrefull: delete all previous entries excepted countries !!!!!
 * 
 * Commands:
 *    $ ddev ssh
 *    $ php craft migrate/up
 */
class m201208_083744_seedDatabase extends Migration implements Languages, Keywords, Registers, HandlingTechniques, DramaturgicTechniques, Formats {
    
    // Constants .............................................................................................
    const CHARACTERS_COUNT = 100;
    const PLACES_COUNT = 100;
    const PERSONS_COUNT = 100;
    const WORKS_COUNT = 100;
    const LINKED_WORKS_COUNT = 100;
    const CONSERVATION_INSTITUTIONS_COUNT = 30;
    
    // Instance fields .......................................................................................
    private $_audiencesEntryIds = [];
    private $_env;

    private $_faker;
    private $_frenchFaker;
    private $_italianFaker;
    private $_germanFaker;

    private $_migrationService;
    private $_countryIds;
    private $_placeIds;
    private $_languageIds;
    private $_personIds;
    private $_audienceIds;
    private $_characterIds;
    private $_keywordIds;
    private $_linkedWorkIds;
    private $_conservationInstitutionIds;
    private $_registerIds;
    private $_handlingTechniqueIds;
    private $_dramaturgicTechniqueIds;
    private $_formatIds;

    // Constructors ..........................................................................................
    function __construct() {
        parent::__construct();
        $this -> _env = App::env('ENVIRONMENT');
        if ($this -> _env === 'dev') {
            $this -> _migrationService = new MigrationService();
            $this -> _countryIds = $this ->_migrationService -> getCountyIds();
            $this -> _faker = Factory::create();
            $this -> _frenchFaker = Factory::create('fr_FR');
            $this -> _italianFaker = Factory::create('it_IT');
            $this -> _germanFaker = Factory::create('de_DE');
        }
    }

    // Methods ...............................................................................................


    // Abstract methods implementations ......................................................................
    /**
     * @inheritdoc
     */
    public function safeUp() {
        if ($this -> _env === 'dev') {
            $this -> clearEntriesButCountries();
            $this -> clearTags();

            $this -> seedAudiences();
            $this -> _audienceIds = $this ->_migrationService -> getAudienceIds();

            $this -> seedCharacters();
            $this -> _characterIds = $this ->_migrationService -> getCharacterIds();

            $this -> seedPlaces();
            $this -> _placeIds = $this ->_migrationService -> getPlaceIds();

            $this -> seedLanguages();
            $this -> _languageIds = $this ->_migrationService -> getLanguageIds();

            $this -> seedPersons();
            $this -> _personIds = $this ->_migrationService -> getPersonIds();

            $this -> seedLinkedWorks();
            $this -> _linkedWorkIds = $this ->_migrationService -> getLinkedWorkIds();

            $this -> seedConservationInstitutions();
            $this -> _conservationInstitutionIds = $this ->_migrationService -> getConservationInstitutionIds();
            
            $this -> seedRegisters();
            $this -> _registerIds = $this ->_migrationService -> getRegisterIds();
            
            $this -> seedHandlingTechniques();
            $this -> _handlingTechniqueIds = $this ->_migrationService -> getHandlingTechniqueIds();
            
            $this -> seedDramaturgicTechniques();
            $this -> _dramaturgicTechniqueIds = $this ->_migrationService -> getDramaturgicTechniqueIds();
            
            $this -> seedFormats();
            $this -> _formatIds = $this ->_migrationService -> getFormatIds();

            $this -> seedKeywords();
            $this -> _keywordIds = $this ->_migrationService -> getKeywordIds();

            $this -> seedWorks();
            
        }
        //throw new Exception('the migration will not be applied');
    }

    private function clearEntriesButCountries() {
        $countriesSectionId = $this ->_migrationService -> countriesSection() -> id;
        $entries = array_filter(Entry::find()->all(), 
                                function($entry) use ($countriesSectionId) { 
                                    return $entry -> sectionId != $countriesSectionId;
                                });
        $entryIds = array_map(function($e) { return $e -> id; }, $entries);
        foreach ($entryIds as &$entryId) {
            $success = Craft::$app->elements->deleteElementById($entryId);
            if (!$success) {
                Craft::error('Couldn’t delete the entry "'.$tag->title.'"', __METHOD__);
            }
        }
    }

    private function clearTags() {
        $countriesSectionId = $this ->_migrationService -> countriesSection() -> id;
        $tags = Tag::find()->all();
        $tagIds = array_map(function($e) { return $e -> id; }, $tags);
        foreach ($tagIds as &$tagId) {
            $success = Craft::$app->elements->deleteElementById($tagId);
            if (!$success) {
                Craft::error('Couldn’t delete the tag "'.$tag->title.'"', __METHOD__);
            }
        }
    }

    private function allEntryIdsButCountries() {
        $countriesSectionId = $this ->_migrationService -> countriesSection() -> id;
        $entries = array_filter(Entry::find()->all(), 
                                function($entry) use ($countriesSectionId) { 
                                    return $entry -> sectionId != $countriesSectionId;
                                });
        return array_map(function($e) { return $e -> id; }, $entries);
    }

    private function seedAudiences() {
        $this -> printSeed('Audiences');
        $this -> seedAudience('enfants', 'children', 'bambini', 'kinder');
        $this -> seedAudience('plus de 6 ans', 'over 6 years', 'oltre 6 anni', 'über 6 Jahre');
        $this -> seedAudience('adultes', 'adults', 'adulti', 'erwachsene');
        $this -> seedAudience('tout public', 'for all', 'per tutti', 'für alle');
    }

    private function seedAudience($frenchTitle, $englishTitle, $italianTitle, $germanTitle) {
        $section = $this ->_migrationService -> audiencesSection();
        $entryType = $this ->_migrationService -> audiencesEntryType();
        $this ->_migrationService 
              -> seedEntry($section,
                                $entryType,
                                $frenchTitle,
                                $englishTitle,
                                $italianTitle,
                                $germanTitle);
    }

    private function seedCharacters() {
        $this -> printSeed('Characters');
        $section = $this ->_migrationService -> charactersSection();
        $entryType = $this ->_migrationService -> charactersEntryType();
        for($i = 0 ; $i < self::CHARACTERS_COUNT ; $i++) {
            $this ->_migrationService 
                  -> createFrenchEntry($this -> _frenchFaker -> lastName, $section, $entryType);
        }
    }

    private function seedPlaces() {
        $this -> printSeed('Places');
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
        $this -> printSeed('Persons');
        $faker = $this -> _frenchFaker;
        $section = $this ->_migrationService -> personsSection();
        $entryType = $this ->_migrationService -> personsEntryType();
        for($i = 0 ; $i < self::PERSONS_COUNT ; $i++) {
            $birthDate =  $faker -> year(1920);
            $deathDate =  $birthDate + mt_rand(35, 95);
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
                          'languages' => $this -> oneLanguage(),
                          'birthPlace' => $this -> onePlace(),
                          'places' => $this -> onePlace()
                      ]
                    );
        }
    }

    private function seedLinkedWorks() {
        $this -> printSeed('LinkedWorks');
        $faker = $this -> _faker;
        $section = $this ->_migrationService -> linkedWorksSection();
        $entryType = $this ->_migrationService -> linkedWorksEntryType();
        for($i = 0 ; $i < self::LINKED_WORKS_COUNT ; $i++) {
            $this ->_migrationService 
                  -> seedEntry(
                      $section,
                      $entryType,
                      $faker -> sentence(10, true),
                      $faker -> sentence(10, true),
                      $faker -> sentence(10, true),
                      $faker -> sentence(10, true),
                      [
                          'authors' => $this -> onePerson(),
                          'date' => $faker -> dateTimeBetween('-500 years', '-20 years', null)
                      ]
                    );
        }
    }

    private function seedConservationInstitutions() {
        $this -> printSeed('ConservationInstitutions');
        $faker = $this -> _frenchFaker;
        $section = $this ->_migrationService -> conservationInstitutionsSection();
        $entryType = $this ->_migrationService -> conservationInstitutionsEntryType();
        for($i = 0 ; $i < self::CONSERVATION_INSTITUTIONS_COUNT ; $i++) {
                $this ->_migrationService 
                  -> createFrenchEntry(
                      $faker -> sentence(10, true),
                      $section,
                      $entryType,
                      [
                          'places' => $this -> onePlace()
                      ]
                    );
        }
    }

    private function seedRegisters() {
        $this -> printSeed('Registers');
        $section = $this ->_migrationService -> registersSection();
        $entryType = $this ->_migrationService -> registersEntryType();
        for($i = 0; $i < count(Registers::REGISTERS_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntry($section,
                                    $entryType,
                                    Registers::REGISTERS_FR[$i],
                                    Registers::REGISTERS_EN[$i],
                                    Registers::REGISTERS_IT[$i],
                                    Registers::REGISTERS_GE[$i]);
        }
    }


    private function seedHandlingTechniques() {
        $this -> printSeed('HandlingTechniques');
        $faker = $this -> _faker;
        $section = $this ->_migrationService -> handlingTechniquesSection();
        $entryType = $this ->_migrationService -> handlingTechniquesEntryType();
        for($i = 0; $i < count(HandlingTechniques::HANDLING_TECHNIQUES_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntry($section,
                                    $entryType,
                                    HandlingTechniques::HANDLING_TECHNIQUES_FR[$i],
                                    HandlingTechniques::HANDLING_TECHNIQUES_EN[$i],
                                    HandlingTechniques::HANDLING_TECHNIQUES_IT[$i],
                                    HandlingTechniques::HANDLING_TECHNIQUES_GE[$i],
                                    [ 'description' => $faker -> sentence(10, true) ],
                                    [ 'description' => $faker -> sentence(10, true) ],
                                    [ 'description' => $faker -> sentence(10, true) ],
                                    [ 'description' => $faker -> sentence(10, true) ]
                                );
        }
    }

    private function seedDramaturgicTechniques() {
        $this -> printSeed('DramaturgicTechniques');
        $section = $this ->_migrationService -> dramaturgicTechniquesSection();
        $entryType = $this ->_migrationService -> dramaturgicTechniquesEntryType();
        for($i = 0; $i < count(DramaturgicTechniques::DRAMATURGIC_TECHNIQUES_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntry($section,
                                    $entryType,
                                    DramaturgicTechniques::DRAMATURGIC_TECHNIQUES_FR[$i],
                                    DramaturgicTechniques::DRAMATURGIC_TECHNIQUES_EN[$i],
                                    DramaturgicTechniques::DRAMATURGIC_TECHNIQUES_IT[$i],
                                    DramaturgicTechniques::DRAMATURGIC_TECHNIQUES_GE[$i]);
        }
    }


    private function seedFormats() {
        $this -> printSeed('Formats');
        $section = $this ->_migrationService -> formatsSection();
        $entryType = $this ->_migrationService -> formatsEntryType();
        for($i = 0; $i < count(Formats::FORMATS_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntry($section,
                                    $entryType,
                                    Formats::FORMATS_FR[$i],
                                    Formats::FORMATS_EN[$i],
                                    Formats::FORMATS_IT[$i],
                                    Formats::FORMATS_GE[$i]);
        }
    }

    private function seedKeywords() {
        $this -> printSeedTags('Keywords');
        for($i = 0; $i < count(Keywords::KEYWORDS_FR); $i++) {
            $this ->_migrationService 
                  -> seedKeyword(Keywords::KEYWORDS_FR[$i],
                                Keywords::KEYWORDS_EN[$i],
                                Keywords::KEYWORDS_IT[$i],
                                Keywords::KEYWORDS_GE[$i]);
        }
    }

    private function seedWorks() {
        $this -> printSeed('Works');
        $faker = $this -> _frenchFaker;
        $englishFaker = $this -> _faker;
        $italianFaker = $this -> _italianFaker;
        $germanFaker = $this -> _germanFaker;
        $section = $this ->_migrationService -> worksSection();
        $entryType = $this ->_migrationService -> worksEntryType();

        for($i = 0 ; $i < self::WORKS_COUNT ; $i++) {
            $writingMinDate =  $faker -> dateTimeBetween('-500 years', '-20 years', null);
            $writingMaxDate =  min(date_modify(clone $writingMinDate, '+'.$faker -> numberBetween(1, 15).' year'), new \DateTime('NOW'));
            $firstPerformanceMinDate = min(date_modify(clone $writingMaxDate, '+'.$faker -> numberBetween(1, 36).' month'), new \DateTime('NOW'));
            $firstPerformanceMaxDate = min(date_modify(clone $firstPerformanceMinDate, '+'.$faker -> numberBetween(1, 12).' month'), new \DateTime('NOW'));
            $publicationMinDate = min(date_modify(clone $firstPerformanceMaxDate, '+'.$faker -> numberBetween(1, 36).' month'), new \DateTime('NOW'));
            $publicationMaxDate = min(date_modify(clone $publicationMinDate, '+'.$faker -> numberBetween(1, 12).' month'), new \DateTime('NOW'));
            
            $this ->_migrationService 
                  -> seedEntryWithNotTranslatableTitle(
                      $section,
                      $entryType,
                      $faker -> sentence(10, true),
                      [
                          'subtitle' => $faker -> sentence(8, true),
                          'translatedTitle' => $faker -> sentence(10, true),
                          'writingMinDate' => $writingMinDate,
                          'writingMaxDate' => $writingMaxDate,
                          'writingDisplayDate' => date_format($writingMinDate, 'd-m-Y'),
                          'referenceDate' => date_format($writingMinDate, 'd-m-Y'),
                          'writingPlace' => $this -> onePlace(),
                          'authors' => $this -> onePerson(),
                          'transcriptors' => $this -> onePerson(),
                          'compilators' => $this -> onePerson(),
                          'abstract' => $this -> realText($faker, 300, 500),
                          'notice' => $this -> realText($faker, 100, 200),
                          'firstPerformancePlace' => $this -> onePlace(),
                          'firstPerformanceDate' => date_format($writingMinDate, 'd-m-Y'),
                          'firstPerformanceMinDate'=> $firstPerformanceMinDate,
                          'firstPerformanceMaxDate'=> $firstPerformanceMaxDate,
                          'firstPublication' => $faker -> sentence(10, true),
                          'publicationMinDate'=> $publicationMinDate,
                          'publicationMaxDate'=> $publicationMaxDate,
                          'modernEditions' => $faker -> sentence(20, true),
                          'mainLanguage' => $this -> oneLanguage(),
                          'audience' => $this -> oneAudience(),
                          'license' => $faker -> word,
                          'genre' => $faker -> word,
                          'characters' => $this -> characters(1, 10),
                          'actsCount' => $faker -> numberBetween(3, 10),
                          'pageCount' => $faker -> numberBetween(50, 500),
                          'keywords' => $this -> keywords(1, 8),
                          'hypotexts' => $this -> oneLinkedWork(),
                          'preservedIn' => $this -> oneConservationInstitution(),
                          'register' => $this -> oneRegister(),
                          'handlingTechniques' => $this -> oneHandlingTechnique(),
                          'dramaturgicTechniques' => $this -> oneDramaturgicTechnique(),
                          'formats' => $this -> oneFormat(),
                      ],
                      [
                          'translatedTitle' => $faker -> sentence(10, true),
                          'abstract' => $this -> realText($englishFaker, 300, 500),
                          'notice' => $this -> realText($englishFaker, 100, 200),
                          'firstPublication' => $faker -> sentence(10, true),
                          'modernEditions' => $faker -> sentence(20, true),
                          'license' => $faker -> sentence(10, true),
                      ],
                      [
                          'translatedTitle' => $faker -> sentence(10, true),
                          'abstract' => $this -> realText($italianFaker, 300, 500),
                          'notice' => $this -> realText($italianFaker, 100, 200),
                          'firstPublication' => $faker -> sentence(10, true),
                          'modernEditions' => $faker -> sentence(20, true),
                          'license' => $faker -> sentence(10, true),
                      ],
                      [
                          'translatedTitle' => $faker -> sentence(10, true),
                          'abstract' => $this -> realText($germanFaker, 300, 500),
                          'notice' => $this -> realText($germanFaker, 100, 200),
                          'firstPublication' => $faker -> sentence(10, true),
                          'modernEditions' => $faker -> sentence(20, true),
                          'license' => $faker -> sentence(10, true),
                      ]
                    );
        }
    }

    private function realText($faker, $minSize, $maxSize) {
        return $faker -> realText($faker -> numberBetween($minSize, $maxSize));
    }

    private function oneHandlingTechnique() {
        return $this -> oneEntry($this -> _handlingTechniqueIds);
    }

    private function oneDramaturgicTechnique() {
        return $this -> oneEntry($this -> _dramaturgicTechniqueIds);
    }

    private function oneFormat() {
        return $this -> oneEntry($this -> _formatIds);
    }

    private function oneRegister() {
        return $this -> oneEntry($this -> _registerIds);
    }

    private function oneConservationInstitution() {
        return $this -> oneEntry($this -> _conservationInstitutionIds);
    }

    private function oneLinkedWork() {
        return $this -> oneEntry($this -> _linkedWorkIds);
    }

    private function onePlace() {
        return $this -> oneEntry($this -> _placeIds);
    }

    private function onePerson() {
        return $this -> oneEntry($this -> _personIds);
    }

    private function oneLanguage() {
        return $this -> oneEntry($this -> _languageIds);
    }

    private function oneAudience() {
        return $this -> oneEntry($this -> _audienceIds);
    }

    private function oneCharacter() {
        return $this -> oneEntry($this -> _characterIds);
    }

    private function oneKeyword() {
        return $this -> oneEntry($this -> _keywordIds);
    }

    private function keywords($min, $max) {
        return $this -> elements($this -> _keywordIds, $min, $max);
    }

    private function characters($min, $max) {
        return $this -> elements($this -> _characterIds, $min, $max);
    }

    private function oneEntry($elementIds) {
        return array($this -> _faker -> randomElement($elementIds));
    }

    private function elements($elementIds, $min, $max) {
        $faker = $this -> _faker;
        $count = $faker -> numberBetween($min, $max);
        $elements = [];
        for($i = 0; $i < $count; $i++) {
            array_push($elements, $faker -> randomElement($elementIds));
        }
        return $elements;
    }

    private function seedLanguages() {
        $this -> printSeed('Languages');
        $section = $this ->_migrationService -> languagesSection();
        $entryType = $this ->_migrationService -> languagesEntryType();
        for($i = 0; $i < count(Languages::LANGUAGES_FR); $i++) {
            $this ->_migrationService 
                  -> seedEntry($section,
                                    $entryType,
                                    Languages::LANGUAGES_FR[$i],
                                    Languages::LANGUAGES_EN[$i],
                                    Languages::LANGUAGES_IT[$i],
                                    Languages::LANGUAGES_GE[$i]);
        }
    }

    private function printSeed($section) {
        echo ">>>> start seeding entries for section: ".$section."\n";
    }

    private function printSeedTags($tagGroup) {
        echo ">>>> start seeding tags for group: ".$tagGroup."\n";
    }

    /**
     * @inheritdoc
     */
    public function safeDown() {
        echo "m201125_083744_createUserInformations cannot be reverted.\n";
        return false;
    }
}
