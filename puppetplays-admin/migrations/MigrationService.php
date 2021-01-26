<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\helpers\App;
use Faker\Factory;
use craft\elements\Entry;
use craft\elements\Tag;
use craft\models\EntryType;
use craft\events\ModelEvent;
use yii\base\Event;

class MigrationService {

    // Constants .............................................................................................
    const COUNTRIES = 'countries';
    const AUDIENCES = 'audiences';
    const CHARACTERS = 'characters';
    const PLACES = 'places';
    const LANGUAGES = 'languages';
    const PERSONS = "persons";
    const WORKS = "works";
    const LINKED_WORKS = "linkedWorks";
    const CONSERVATION_INSTITUTIONS = "conservationInstitutions";
    const REGISTERS = "registers";
    const HANDLING_TECHNIQUES = "handlingTechniques";
    const DRAMATURGIC_TECHNIQUES = "dramaturgicTechniques";
    const FORMATS = "formats";

    const KEYWORDS_GROUP = "worksTags";

    // Instance fields .......................................................................................
    private $_savedEntry;
    private $_savedTag;

    private $_frenchSite;
    private $_englishSite;
    private $_italianSite;
    private $_germanSite;

    private $_countriesSection;
    private $_audiencesSection;
    private $_charactersSection;
    private $_placesSection;
    private $_languagesSection;
    private $_personsSection;
    private $_worksSection;
    private $_linkedWorksSection;
    private $_conservationInstitutionsSection;
    private $_registersSection;
    private $_handlingTechniquesSection;
    private $_dramaturgicTechniquesSection;
    private $_formatsSection;

    private $_countriesEntryType;
    private $_audiencesEntryType;
    private $_charactersEntryType;
    private $_placesEntryType;
    private $_languagesEntryType;
    private $_personsEntryType;
    private $_worksEntryType;
    private $_linkedWorksEntryType;
    private $_conservationInstitutionsEntryType;
    private $_registersEntryType;
    private $_handlingTechniquesEntryType;
    private $_dramaturgicTechniquesEntryType;
    private $_formatsEntryType;

    private $_keywordsTagGroup;

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

        // Sections ..........................................................................................
    public function countriesSection() {
        return $this -> _countriesSection;
    }

    public function audiencesSection() {
        return $this -> _audiencesSection;
    }

    public function charactersSection() {
        return $this -> _charactersSection;
    }
    
    public function placesSection() {
        return $this -> _placesSection;
    }

    public function languagesSection() {
        return $this -> _languagesSection;
    }

    public function personsSection() {
        return $this -> _personsSection;
    }

    public function worksSection() {
        return $this -> _worksSection;
    }

    public function linkedWorksSection() {
        return $this -> _linkedWorksSection;
    }

    public function conservationInstitutionsSection() {
        return $this -> _conservationInstitutionsSection;
    }
    
    public function registersSection() {
        return $this -> _registersSection;
    }

    public function handlingTechniquesSection() {
        return $this -> _handlingTechniquesSection;
    }

    public function dramaturgicTechniquesSection() {
        return $this -> _dramaturgicTechniquesSection;
    }

    public function formatsSection() {
        return $this -> _formatsSection;
    }

        // Entry types ......................................................................................
    public function countriesEntryType() {
        return $this -> _countriesEntryType;
    }

    public function audiencesEntryType() {
        return $this -> _audiencesEntryType;
    }

    public function charactersEntryType() {
        return $this -> _charactersEntryType;
    }

    public function placesEntryType() {
        return $this -> _placesEntryType;
    }

    public function languagesEntryType() {
        return $this -> _languagesEntryType;
    }

    public function personsEntryType() {
        return $this -> _personsEntryType;
    }

    public function worksEntryType() {
        return $this -> _worksEntryType;
    }

    public function linkedWorksEntryType() {
        return $this -> _linkedWorksEntryType;
    }

    public function conservationInstitutionsEntryType() {
        return $this -> _conservationInstitutionsEntryType;
    }

    public function registersEntryType() {
        return $this -> _registersEntryType;
    }

    public function handlingTechniquesEntryType() {
        return $this -> _handlingTechniquesEntryType;
    }

    public function dramaturgicTechniquesEntryType() {
        return $this -> _dramaturgicTechniquesEntryType;
    }

    public function formatsEntryType() {
        return $this -> _formatsEntryType;
    }

        // Entry ids ..........................................................................................
    public function getCountyIds() {
        return $this -> getSectionEntryIds(self::COUNTRIES);
    }

    public function getPlaceIds() {
        return $this -> getSectionEntryIds(self::PLACES);
    }

    public function getPersonIds() {
        return $this -> getSectionEntryIds(self::PERSONS);
    }

    public function getLanguageIds() {
        return $this -> getSectionEntryIds(self::LANGUAGES);
    }

    public function getAudienceIds() {
        return $this -> getSectionEntryIds(self::AUDIENCES);
    }

    public function getCharacterIds() {
        return $this -> getSectionEntryIds(self::CHARACTERS);
    }

    public function getLinkedWorkIds() {
        return $this -> getSectionEntryIds(self::LINKED_WORKS);
    }

    public function getConservationInstitutionIds() {
        return $this -> getSectionEntryIds(self::CONSERVATION_INSTITUTIONS);
    }

    public function getRegisterIds() {
        return $this -> getSectionEntryIds(self::REGISTERS);
    }

    public function getHandlingTechniqueIds() {
        return $this -> getSectionEntryIds(self::HANDLING_TECHNIQUES);
    }

    public function getDramaturgicTechniqueIds() {
        return $this -> getSectionEntryIds(self::DRAMATURGIC_TECHNIQUES);
    }

    public function getFormatIds() {
        return $this -> getSectionEntryIds(self::FORMATS);
    }


        // Tag ids ..........................................................................................
 
    public function getKeywordIds() {
        return $this -> getGroupTagIds(self::KEYWORDS_GROUP);
    }


    // Constructor ...........................................................................................
    function __construct() {
        $this -> computeSites();
        $this -> computeEntryTypes();
        $this -> computeSections();
        $this -> computeTagGroups();
        $this -> createEventListener();
    }
    // Methods ...............................................................................................
    private function getSectionEntryIds($sectionName) {
        $entries = Entry::find()->section($sectionName)->type([$sectionName])->all();
        return array_map(function($e) { return $e -> id; }, $entries);
    }

    private function getGroupTagIds($groupName) {
        $tags = Tag::find()->group($groupName)->all();
        return array_map(function($e) { return $e -> id; }, $tags);
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
                case self::PLACES:
                    $this->_placesEntryType = $entryType;
                    break;
                case self::LANGUAGES:
                    $this->_languagesEntryType = $entryType;
                    break;
                case self::PERSONS:
                    $this->_personsEntryType = $entryType;
                    break;
                case self::WORKS:
                    $this->_worksEntryType = $entryType;
                    break;
                case self::LINKED_WORKS:
                    $this->_linkedWorksEntryType = $entryType;
                    break;
                case self::CONSERVATION_INSTITUTIONS:
                    $this->_conservationInstitutionsEntryType = $entryType;
                    break;
                case self::REGISTERS:
                    $this->_registersEntryType = $entryType;
                    break;
                case self::HANDLING_TECHNIQUES:
                    $this->_handlingTechniquesEntryType = $entryType;
                    break;
                case self::DRAMATURGIC_TECHNIQUES:
                    $this->_dramaturgicTechniquesEntryType = $entryType;
                    break;
                case self::FORMATS:
                    $this->_formatsEntryType = $entryType;
                    break;
            }
        }
    }

    private function computeTagGroups() {
        $tagGroups = Craft::$app->tags->allTagGroups;
        foreach ($tagGroups as &$tagGroup) {
            switch ($tagGroup->handle) {
                case self::KEYWORDS_GROUP:
                    $this->_keywordsTagGroup = $tagGroup;
                    break;
            }
        }
    }

    private function computeSections() {
        $this -> _countriesSection = $this -> getSection(self::COUNTRIES);
        $this -> _audiencesSection = $this -> getSection(self::AUDIENCES);
        $this -> _charactersSection = $this -> getSection(self::CHARACTERS);
        $this -> _placesSection = $this -> getSection(self::PLACES);
        $this -> _languagesSection = $this -> getSection(self::LANGUAGES);
        $this -> _personsSection = $this -> getSection(self::PERSONS);
        $this -> _worksSection = $this -> getSection(self::WORKS);
        $this -> _linkedWorksSection = $this -> getSection(self::LINKED_WORKS);
        $this -> _conservationInstitutionsSection = $this -> getSection(self::CONSERVATION_INSTITUTIONS);
        $this -> _registersSection = $this -> getSection(self::REGISTERS);
        $this -> _handlingTechniquesSection = $this -> getSection(self::HANDLING_TECHNIQUES);
        $this -> _dramaturgicTechniquesSection = $this -> getSection(self::DRAMATURGIC_TECHNIQUES);
        $this -> _formatsSection = $this -> getSection(self::FORMATS);
    }

    private function getSection($sectionName) {
        return Craft::$app -> sections -> getSectionByHandle($sectionName);
    }
    
    private function createEventListener() {
        Event::on(
            Entry::class,
            Entry::EVENT_AFTER_SAVE,
            function(ModelEvent $event) {
                $entry = $event->sender;
                $this -> _savedEntry = $entry;
                //echo "getEntry: ".$entry -> id.", result: ".$entry."\n";
            }
        );
        Event::on(
            Tag::class,
            Tag::EVENT_AFTER_SAVE,
            function(ModelEvent $event) {
                $tag = $event->sender;
                $this -> _savedTag = $tag;
                //echo "created tag: ".$tag -> id.", result: ".$tag."\n";
            }
        );
    }

    public function seedEntryWithNotTranslatableTitle($section, $entryType, $frenchTitle, $frenchFields = null, $englishFields = null, $italianFields = null, $germanFields = null) {
        $this->seedEntry($section, $entryType, $frenchTitle, $frenchTitle, $frenchTitle, $frenchTitle, $frenchFields, $englishFields, $italianFields, $germanFields);
    }

    public function seedEntry($section, $entryType, $frenchTitle, $englishTitle, $italianTitle, $germanTitle, $frenchFields = null, $englishFields = null, $italianFields = null, $germanFields = null) {
        $this->createFrenchEntry($frenchTitle, $section, $entryType, $frenchFields);
        if ($frenchFields !== null) {
            $englishFields = $this -> overrideFields($frenchFields, $englishFields);
            $italianFields = $this -> overrideFields($frenchFields, $italianFields);
            $germanFields = $this -> overrideFields($frenchFields, $germanFields);
        }
        // $this->translateEntry($this->_savedEntry, $this->_englishSite, $englishTitle, $section, $entryType, $englishFields);
        // $this->translateEntry($this->_savedEntry, $this->_italianSite, $italianTitle, $section, $entryType, $italianFields);
        // $this->translateEntry($this->_savedEntry, $this->_germanSite, $germanTitle, $section, $entryType, $germanFields);
    }

    private function overrideFields($fields, $withFields) {
        $overriden = $fields; // copy
        if ($withFields !== null) {
            foreach ($withFields as $fieldName => $fieldValue) {
                $overriden[$fieldName] = $fieldValue;
            }
        }
        return $overriden;
    }

    public function createFrenchEntry($title, $section, $entryType, $fields = null) {
        $this -> createEntry($this ->_frenchSite, $title, $section, $entryType, $fields);
    }
    
    private function createEntry($site, $title, $section, $entryType, $fields = null) {
        $entry = new Entry();
        $entry->sectionId = $section->id;
        $entry->typeId = $entryType->id;
        $entry->siteId = $site->id;
        $entry->title = $title;
        $entry->authorId = 1;
        if ($fields !== null) {
            $entry -> setFieldValues($fields);
        }
        $success = Craft::$app->elements->saveElement($entry);
        //echo "\n"."create entry: ".$entry->id." | ".$entry."\n";
        //echo 'fields: '; print_r($fields); echo "\n";
        if (!$success) {
            Craft::error('Couldn’t save the entry "'.$entry->title.'"', __METHOD__);
        }
    }

    public function translateEntry($e, $site, $title, $section, $entryType, $fields = null) {
        $entry = new Entry();
        $entry->id = $e->id;
        $entry->uid = $e->uid;
        $entry->sectionId = $section->id;
        $entry->typeId = $entryType->id;
        $entry->siteId = $site->id;
        $entry->title = $title;
        $entry->authorId = 1;
        if ($fields !== null) {
            $entry -> setFieldValues($fields);
        }
        $success = Craft::$app->elements->saveElement($entry);
        //echo "-> translate entry: ".$entry->id." | ".$entry."\n";
        //echo '-> fields: '; print_r($fields); echo "\n";
        if (!$success) {
            Craft::error('Couldn’t translate the entry title "'.$entry->title.'"', __METHOD__);
        }
    }

    public function seedKeyword($frenchTitle, $englishTitle, $italianTitle, $germanTitle) {
        $this->createFrenchKeyword($frenchTitle);
        $this->translateKeyWord($this->_savedTag, $this->_englishSite, $englishTitle);
        $this->translateKeyWord($this->_savedTag, $this->_italianSite, $italianTitle);
        $this->translateKeyWord($this->_savedTag, $this->_germanSite, $germanTitle);
    }

    private function createFrenchKeyword($title) {
        $tag = new Tag();
        $tag -> siteId  = $this->_frenchSite->id;
        $tag -> groupId = $this->_keywordsTagGroup -> id;
        $tag -> title = $title;
        $success = Craft::$app->elements->saveElement($tag);
        //echo "\n".">>>> create tag: ".$tag->id." | ".$tag." success? ".$success."\n";
        if (!$success) {
            Craft::error('Couldn’t save the tag "'.$tag->title.'"', __METHOD__);
        }
    }

    private function translateKeyWord($t, $site, $title) {
        $tag = new Tag();
        $tag->id = $t->id;
        $tag->uid = $t->uid;
        $tag -> groupId = $t->groupId;
        $tag->siteId = $site->id;
        $tag -> title = $title;
        $success = Craft::$app->elements->saveElement($tag);
        //echo "-> translate tag: ".$tag->id." | ".$tag."\n";
        if (!$success) {
            Craft::error('Couldn’t translate the tag "'.$tag->title.'"', __METHOD__);
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

    public function getEntry($entryId) {
        $entry = Craft::$app->entries->getEntryById($entryId);
        echo "getEntry: ".$entryId.", ".$this ->_frenchSite.", result: ".$entry."\n";
        //print_r($entry -> attributes); echo "\n";
        return $entry;
    }

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
