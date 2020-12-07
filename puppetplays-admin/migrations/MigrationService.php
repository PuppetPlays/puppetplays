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

class MigrationService {

     // Constants .............................................................................................
    const AUDIENCES = 'audiences';
    const CHARACTERS = 'characters';
    const COUNTRIES = 'countries';

    // Instance fields .......................................................................................
    private $_savedEntry;

    private $_frenchSite;
    private $_englishSite;
    private $_italianSite;
    private $_germanSite;

    private $_countriesSection;
    private $_audiencesSection;
    private $_charactersSection;

    private $_countriesEntryType;
    private $_audiencesEntryType;
    private $_charactersEntryType;

    // Getters / Setters .....................................................................................
    public function frenchSite() {
        return $this -> _frenchSite;
    }

    public function englishSite() {
        return $this -> _englishSite;
    }

    public function italianSite() {
        return $this -> _italianSite;
    }

    public function germanSite() {
        return $this -> _germanSite;
    }

    public function savedEntry() {
        return $this -> _savedEntry;
    }

    public function countriesSection() {
        return $this -> _countriesSection;
    }

    public function countriesEntryType() {
        return $this -> _countriesEntryType;
    }

    // Methods ...............................................................................................
    function __construct() {
        $this -> computeSites();
        $this -> computeEntryTypes();
        $this -> computeSections();
        $this -> createEventListener();
    }

    private function computeSites() {
        $sites = Craft::$app->sites->getAllSites();
        foreach ($sites as &$site) {
            switch ($site->handle) {
                case 'fr':
                    $this->_frenchSite = $site;
                    break;
                case 'en':
                    $this->_englishSite = $site;
                    break;
                case 'it':
                    $this->_italianSite = $site;
                    break;
                case 'de':
                    $this->_germanSite = $site;
                    break;
            }
        }
    }

    private function computeEntryTypes() {
        $entryTypes = Craft::$app->sections->allEntryTypes;
        //print_r($entryTypes);
        foreach ($entryTypes as &$entryType) {
            switch ($entryType->handle) {
                case self::COUNTRIES:
                    $this->_countriesEntryType = $entryType;
                    break;
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
        $this->_countriesSection = Craft::$app->sections->getSectionByHandle(self::COUNTRIES);
        $this->_audiencesSection = Craft::$app->sections->getSectionByHandle(self::AUDIENCES);
        $this->_charactersSection = Craft::$app->sections->getSectionByHandle(self::CHARACTERS);
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

    public function seedEntryTitle($section, $entryType, $frenchTitle, $englishTitle, $italianTitle, $germanTitle) {
        $this->createEntry($this->_frenchSite, $frenchTitle, $section, $entryType);
        $this->translateEntryTitle($this->_savedEntry, $this->_englishSite, $englishTitle, $section, $entryType);
        $this->translateEntryTitle($this->_savedEntry, $this->_italianSite, $italianTitle, $section, $entryType);
        $this->translateEntryTitle($this->_savedEntry, $this->_germanSite, $germanTitle, $section, $entryType);
    }
    
    public function createEntry($site, $title, $section, $entryType) {
        $entry = new Entry();
        $entry->sectionId = $section->id;
        $entry->typeId = $entryType->id;
        $entry->siteId = $site->id;
        $entry->title = $title;
        $entry->authorId = 1;
        $success = Craft::$app->elements->saveElement($entry);
        //echo "\n"."create entry: ".$entry->id.", ".$entry."\n";
        if (!$success) {
            Craft::error('Couldn’t save the entry "'.$entry->title.'"', __METHOD__);
        }
    }

    public function translateEntryTitle($e, $site, $title, $section, $entryType) {
        $entry = new Entry();
        $entry->id = $e->id;
        $entry->uid = $e->uid;
        $entry->sectionId = $section->id;
        $entry->typeId = $entryType->id;
        $entry->siteId = $site->id;
        $entry->title = $title;
        $entry->authorId = 1;
        $success = Craft::$app->elements->saveElement($entry);
        //echo "-> translate entry: ".$entry->id.", ".$entry."\n";
        if (!$success) {
            Craft::error('Couldn’t save the entry title "'.$entry->title.'"', __METHOD__);
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
}
