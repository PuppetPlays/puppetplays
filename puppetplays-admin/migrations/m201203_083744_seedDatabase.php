<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\helpers\App;
use Faker\Factory;

/**
 * Seed database migration for dev mode.
 */
class m201203_083744_seedDatabase extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp() {
        // ********** To run migrations *************
        // ddev ssh
        // php craft migrate/up
        $env = App::env('ENVIRONMENT');
        if ($env === 'dev') {
            $faker = Factory::create();
            // seed persons
            echo '<pre>'; print_r($faker->name); echo '</pre>';




            //
            echo "!!!!!!!!!!!!!!! seed database succeeded !!!!!!!!!!!!!!!!";
        }
        throw new Exception("second variable can not be 0");
    }

    /**
     * @inheritdoc
     */
    public function safeDown() {
        echo "m201125_083744_createUserInformations cannot be reverted.\n";
        return false;
    }
}
