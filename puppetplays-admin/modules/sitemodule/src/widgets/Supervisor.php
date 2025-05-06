<?php

/**
 * Site module for Craft CMS 3.x
 *
 * A custom module to enhance the website
 *
 * @link      https://intactile.com
 * @copyright Copyright (c) 2021 intactile DESIGN
 */

namespace modules\sitemodule\widgets;

use modules\sitemodule\SiteModule;
use modules\sitemodule\assetbundles\supervisorwidget\SupervisorWidgetAsset;

use Craft;
use craft\base\Widget;

use craft\db\Table;
use craft\helpers\Db;

/**
 * HypotextEntries Field
 *
 * Whenever someone creates a new field in Craft, they must specify what
 * type of field it is. The system comes with a handful of field types baked in,
 * and we’ve made it extremely easy for modules to add new ones.
 *
 * https://craftcms.com/docs/plugins/field-types
 *
 * @author    intactile DESIGN
 * @package   SiteModule
 * @since     1.0.0
 */
class Supervisor extends Widget
{
    // Public Properties
    // =========================================================================

    // Static Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('sitemodule', 'SupervisorWidget');
    }

    /**
     * @inheritdoc
     */
    public static function maxColspan(): ?int
    {
        return null;
    }

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function getBodyHtml(): ?string
    {
        $userData = array();
        $currentUserId = Craft::$app->getUser()->getId();
        $supervisedUsersIds = \craft\elements\User::find()
            ->supervisor($currentUserId)
            ->ids();


        $supervisedEntries = count($supervisedUsersIds) > 0 ?
            \craft\elements\Entry::find()
            ->anyStatus()
            ->authorId($supervisedUsersIds)
            ->all() : [];

        Craft::$app->getView()->registerAssetBundle(SupervisorWidgetAsset::class);

        return Craft::$app->getView()->renderTemplate(
            'sitemodule/_components/widgets/Supervisor_body',
            [
                'supervisedEntries' => $supervisedEntries
            ]
        );
    }
}
