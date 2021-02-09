<?php
/**
 * Site module for Craft CMS 3.x
 *
 * A custom module to enhance the website
 *
 * @link      https://intactile.com
 * @copyright Copyright (c) 2021 intactile DESIGN
 */

namespace modules\sitemodule\fields;

use modules\sitemodule\SiteModule;
use modules\sitemodule\assetbundles\simpledatefield\SimpleDateFieldAsset;

use Craft;
use craft\base\ElementInterface;
use craft\fields\Date;
use craft\helpers\Html;

/**
 * SimpleDate Field
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
class SimpleDate extends Date
{
    // Static Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('sitemodule', 'Simple date');
    }

    /**
     * @inheritdoc
     */
    public function getSettingsHtml()
    {
        return '';
    }

    /**
     * @inheritdoc
     */
    protected function inputHtml($value, ElementInterface $element = null): string
    {
        $variables = [
            'id' => Html::id($this->handle),
            'name' => $this->handle,
            'value' => $value
        ];

        $input = '';

        if ($this->showDate) {
            $input .= Craft::$app->getView()->renderTemplate('sitemodule/_components/fields/SimpleDate_input', $variables);
        }

        return $input;
    }
}
