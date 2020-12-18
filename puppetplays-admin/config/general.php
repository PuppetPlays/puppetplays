<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\helpers\App;

return [
    // Global settings
    '*' => [
        'headlessMode' => true,

        // Default Week Start Day (0 = Sunday, 1 = Monday...)
        'defaultWeekStartDay' => 1,

        // Whether generated URLs should omit "index.php"
        'omitScriptNameInUrls' => true,

        // Control panel trigger word
        'cpTrigger' => 'admin',

        // The secure key Craft will use for hashing and encrypting data
        'securityKey' => App::env('SECURITY_KEY'),
    ],

    // Dev environment settings
    'dev' => [
        // Dev Mode (see https://craftcms.com/guides/what-dev-mode-does)
        'devMode' => true,

        // Disable graphQL query caching
        'enableGraphQlCaching' => false,

        // Prevent crawlers from indexing pages and following links
        'disallowRobots' => true,

        'aliases' => [
            '@livePreviewUrl' => App::env('LIVE_PREVIEW_URL'),
        ]
    ],

    // Staging environment settings
    'staging' => [
        // Set this to `false` to prevent administrative changes from being made on Staging
        'allowAdminChanges' => false,

        // Don’t allow updates on Staging
        'allowUpdates' => false,

        // Prevent crawlers from indexing pages and following links
        'disallowRobots' => true,

        'aliases' => [
            '@web' => App::env('ROOT_SITE_URL'),
            '@livePreviewUrl' => '@web',
        ],
    ],

    // Production environment settings
    'production' => [
        // Set this to `false` to prevent administrative changes from being made on Production
        'allowAdminChanges' => false,

        // Don’t allow updates on Production
        'allowUpdates' => false,

        'aliases' => [
            '@web' => App::env('ROOT_SITE_URL'),
            '@livePreviewUrl' => '@web',
        ],
    ],
];
