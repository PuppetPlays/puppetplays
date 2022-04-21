<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\elements\Entry;

/**
 * m220420_131454_migrateWorksCharactersToNewFormat migration.
 */
class m220420_131454_migrateWorksCharactersToNewFormat extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $entries = Entry::find()
            ->section('works')
            ->with(['characters'])
            ->all();

        foreach ($entries as $entry) {
            if (count($entry->characters) > 0) {
                $number = 0;
                $textCharactersData = array();

                foreach ($entry->characters as $originalCharacter) {
                $number++;
                $textCharactersData["new$number"] = array(
                    'type' => 'character',
                    'fields' => array(
                        'nameInText' => $originalCharacter->textName,
                        'roles' => $originalCharacter->character->ids()
                    )
                );
                }

                $entry->setFieldValue('textCharacters', $textCharactersData);
            }
            
            $success = Craft::$app->elements->saveElement($entry);

            if (!$success) {
                Craft::error('Couldn’t migrate the characters field to the new format', __METHOD__);
            }
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $elementsService = Craft::$app->getElements();
        $entries = Entry::find()
            ->section('works')
            ->with(['textCharacters'])
            ->all();

        foreach ($entries as $entry) {
            if (count($entry->textCharacters) > 0) {
                foreach ($entry->textCharacters as $textCharacter) {
                    $elementsService->deleteElementById($textCharacter->id, null, null, false);
                }
            }
        }
    }
}
