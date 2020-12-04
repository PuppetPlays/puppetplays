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

/**
 * Seed database migration for dev mode.
 */
class m201203_083744_seedDatabase extends Migration {

    const AUDIENCES = 'audiences';
    const CHARACTERS = 'characters';

    const CHARACTERS_COUNT = 10;

    private $_audiencesEntryIds = [];
    private $_savedEntry;

    private $_frenchSite;
    private $_englishSite;

    private $_audiencesSection;
    private $_audiencesEntryType;

    private $_charactersSection;
    private $_charactersEntryType;

    private $_faker;
    private $_frenchFaker;

    /**
     * @inheritdoc
     */
    public function safeUp() {
        // ********** To run migrations *************
        // ddev ssh
        // php craft migrate/up
        $env = App::env('ENVIRONMENT');
        if ($env === 'dev') {
            // Prepare dependencies
            $this -> computeSites();
            $this -> computeEntryTypes();
            $this -> computeSections();
            $this -> _faker = Factory::create();
            $this -> _frenchFaker = Factory::create('fr_FR');
            // echo '<pre>'; print_r($faker->name); echo '</pre>';

            echo "audiencesSection: ".$this->_audiencesSection->id."\n";
            echo "audiencesEntryType: ".$this->_audiencesEntryType->id."\n";
           


            $this->createEventListener();

 
            // Seed 
            $this->seedAudiences();
            $this->seedCharacters();


            echo "!!!!!!!!!!!!!!! seed database succeeded !!!!!!!!!!!!!!!!";
        }
        throw new Exception("blablabla");
    }

    private function computeSites() {
        $sites = Craft::$app->sites->getAllSites();
        foreach ($sites as &$site) {
            if ($site->handle === 'fr') {
                $this->_frenchSite = $site;
            }
            else if ($site->handle === 'en') {
                $this->_englishSite = $site;
            }
        }
    }

    private function computeEntryTypes() {
        $entryTypes = Craft::$app->sections->allEntryTypes;
        //print_r($entryTypes);
        foreach ($entryTypes as &$entryType) {
            switch ($entryType->handle) {
                case self::AUDIENCES:
                    $this->_audiencesEntryType = $entryType;
                    break;
                case self::CHARACTERS:
                    $this->_charactersEntryType = $entryType;
                    break;
            }
        }
    }

    private function computeSections() {
        $this->_audiencesSection = Craft::$app->sections->getSectionByHandle(self::AUDIENCES);
        $this->_charactersSection = Craft::$app->sections->getSectionByHandle(self::CHARACTERS);
    }

    private function seedAudiences() {
        $this->seedAudience('enfants', 'children');
        $this->seedAudience('plus de 6 ans', 'over 6 years');
        $this->seedAudience('adultes', 'adults');
        $this->seedAudience('tout public', 'for all');
    }

    private function seedAudience($frenchTitle, $englishTitle) {
        $this->createEntry($this->_frenchSite, $frenchTitle, $this->_audiencesSection, $this->_audiencesEntryType);
        $this->translateEntryTitle($this->_savedEntry, $this->_englishSite, $englishTitle, $this->_audiencesSection, $this->_audiencesEntryType);
    }

    private function seedCharacters() {
        for($i = 0; $i<self::CHARACTERS_COUNT; $i++) {
            $this->seedCharacter($this->_frenchFaker->lastName, $this->_faker->lastName);
        }
    }

    private function seedCharacter($frenchTitle, $englishTitle) {
        $this->createEntry($this->_frenchSite, $frenchTitle, $this->_charactersSection, $this->_charactersEntryType);
    }

    private function createEventListener() {
        Event::on(
            Entry::class,
            Entry::EVENT_AFTER_SAVE,
            function(ModelEvent $event) {
                    $entry = $event->sender;
                    $this -> _savedEntry = $entry;
                }
            );
    }

    private function createEntry($site, $title, $section, $entryType) {
        $entry = new Entry();
        $entry->sectionId = $section->id;
        $entry->typeId = $entryType->id;
        $entry->siteId = $site->id;
        $entry->title = $title;
        $entry->authorId = 1;
        $success = Craft::$app->elements->saveElement($entry);
        echo "create entry: ".$entry->id.", ".$entry."\n";
        if (!$success) {
            Craft::error('Couldn’t save the entry "'.$entry->title.'"', __METHOD__);
        }
    }

    private function translateEntryTitle($e, $site, $title, $section, $entryType) {
        $entry = new Entry();
        $entry->id = $e->id;
        $entry->uid = $e->uid;
        $entry->sectionId = $section->id;
        $entry->typeId = $entryType->id;
        $entry->siteId = $site->id;
        $entry->title = $title;
        $entry->authorId = 1;
        $success = Craft::$app->elements->saveElement($entry);
        echo "-> translate entry: ".$entry->id.", ".$entry."\n\n";
        if (!$success) {
            Craft::error('Couldn’t save the entry "'.$entry->title.'"', __METHOD__);
        }
    }

    /*private function isExistingEntry($entry) {
        foreach ($this->_audiencesEntryIds as &$e) {
            if ($entry->id === $e->id) {
                return true;
            }
        }
        return false;
    }*/

    /*private function getEntry($entryId, $siteId) {
        $entry = Craft::$app->entries->getEntryById($entryId, $siteId);
        echo "getEntry: ".$entryId.", ".$siteId.", result: ".$entry."\n";
        return $entry;
    }*/

    /*private function getContent($element) {
        return Craft::$app->content->getContentRow($element);
    }*/

    /*private function updateContent($element, $siteId) {
        $success = Craft::$app->content->saveContent($element, $siteId);
        if (!$success) {
            Craft::error('Couldn’t update the entry content"'.$element->title.'"', __METHOD__);
        }
    }*/
    
    /**
     * @inheritdoc
     */
    public function safeDown() {
        echo "m201125_083744_createUserInformations cannot be reverted.\n";
        return false;
    }
}
