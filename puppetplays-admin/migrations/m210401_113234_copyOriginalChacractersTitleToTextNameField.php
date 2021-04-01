<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\elements\Entry;

/**
 * m210401_113234_copyOriginalChacractersTitleToTextNameField migration.
 */
class m210401_113234_copyOriginalChacractersTitleToTextNameField extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $entries = Entry::find()
            ->section('originalsCharacters')
            ->all();
        foreach ($entries as $entry) {
            $entry->setFieldValue('textName', $entry->title);
            $success = Craft::$app->elements->saveElement($entry);
            if (!$success) {
                Craft::error('Couldn’t copy the title to the textName field', __METHOD__);
            }
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m210401_113234_copyOriginalChacractersTitleToTextNameField cannot be reverted.\n";
        return false;
    }
}
