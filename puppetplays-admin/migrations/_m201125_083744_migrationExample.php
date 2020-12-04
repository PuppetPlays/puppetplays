<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;

/**
 * m201125_083744_migrationExample migration.
 * This is an exemple, underscored to not be run !!!!! 
 */
class m201125_083744_migrationExample extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
   
        // ********** To run migrations *************
        // ddev ssh
        // php craft migrate/up

        // SELECT * FROM `content` WHERE field_birthDate > 1900
        $entries = (new Query())
            ->select(['id', 'field_firstName', 'field_lastName', 'field_birthDate', 'field_info'])
            ->from('content')
            ->where(['>', 'field_birthDate', 1900])
            ->limit(50);
            
        echo '<pre>'; print_r($entries->all()); echo '</pre>';
        foreach ($entries->all() as &$entry) {
            // echo '<pre>'; print_r($entry); echo '</pre>';
            $birthDate = $entry['field_birthDate'];
            $id = $entry['id'];
            
            // UPDATE `content` SET `field_info`='toto' WHERE id=47
            $info = 'né(e) en '.$birthDate;
    
            $this -> update('content', array(
                'field_info'=>$info,
            ), 'id='.$id);
        }

        echo '<pre>'; print_r($entries->all()); echo '</pre>';

        echo "createUserInformations succeeded !!!!!!!!!";
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m201125_083744_createUserInformations cannot be reverted.\n";
        return false;
    }
}
