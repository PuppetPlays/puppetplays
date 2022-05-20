<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\elements\Entry;

/**
 * m220520_085031_migrateWorksCharactersOfDraftsToNewFormat migration.
 */
class m220520_085031_migrateWorksCharactersOfDraftsToNewFormat extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $notLiveEntries = Entry::find()
            ->status(['disabled', 'pending', 'expired'])
            ->section('works')
            ->with(['characters'])
            ->all();
        $draftEntries = Entry::find()
            ->drafts()
            ->status(null)
            ->section('works')
            ->with(['characters'])
            ->all();
        
        $entries = array_merge($notLiveEntries, $draftEntries);
        
        foreach ($entries as $entry) {
            if (count($entry->characters) > 0) {
                $number = 0;
                $textCharactersData = array();

                foreach ($entry->characters as $originalCharacter) {
                    $number++;
                    if ($originalCharacter->character) {
                        $textCharactersData["new$number"] = array(
                            'type' => 'character',
                            'fields' => array(
                                'nameInText' => $originalCharacter->textName,
                                'roles' => $originalCharacter->character->ids()
                            )
                        );
                    } else {
                        $textCharactersData["new$number"] = array(
                            'type' => 'character',
                            'fields' => array(
                                'nameInText' => $originalCharacter->title
                            )
                        );
                    }
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
        $notLiveEntries = Entry::find()
            ->status(['disabled', 'pending', 'expired'])
            ->section('works')
            ->with(['characters'])
            ->all();
        $draftEntries = Entry::find()
            ->drafts()
            ->status(null)
            ->section('works')
            ->with(['characters'])
            ->all();

        $entries = array_merge($notLiveEntries, $draftEntries);

        foreach ($entries as $entry) {
            if (count($entry->textCharacters) > 0) {
                foreach ($entry->textCharacters as $textCharacter) {
                    $elementsService->deleteElementById($textCharacter->id, null, null, false);
                }
            }
        }
    }
}
