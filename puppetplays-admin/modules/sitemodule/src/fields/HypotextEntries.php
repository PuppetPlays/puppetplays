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
use modules\sitemodule\assetbundles\hypotextentriesfield\HypotextEntriesFieldAsset;

use Craft;
use craft\db\Table as DbTable;
use craft\elements\db\EntryQuery;
use craft\elements\Entry;
use craft\fields\BaseRelationField;
use craft\gql\arguments\elements\Entry as EntryArguments;
use craft\gql\interfaces\elements\Entry as EntryInterface;
use craft\gql\resolvers\elements\Entry as EntryResolver;
use craft\helpers\Db;
use craft\helpers\Gql;
use GraphQL\Type\Definition\Type;

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
class HypotextEntries extends BaseRelationField
{
    // Public Properties
    // =========================================================================

    public $inputTemplate = 'sitemodule/_components/fields/HypotextEntries_input';

    // Static Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    protected static function elementType(): string
    {
        return Entry::class;
    }

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('sitemodule', 'Hypotext entries');
    }

    /**
     * @inheritdoc
     */
    public static function defaultSelectionLabel(): string
    {
        return Craft::t('sitemodule', 'Select one or several hypotext(s)');
    }

    /**
     * @inheritdoc
     */
    public static function valueType(): string
    {
        return EntryQuery::class;
    }

    /**
     * @inheritdoc
     * @since 3.3.0
     */
    public function getContentGqlType()
    {
        return [
            'name' => $this->handle,
            'type' => Type::listOf(EntryInterface::getType()),
            'args' => EntryArguments::getArguments(),
            'resolve' => EntryResolver::class . '::resolve',
        ];
    }

    /**
     * @inheritdoc
     * @since 3.3.0
     */
    public function getEagerLoadingGqlConditions()
    {
        $allowedEntities = Gql::extractAllowedEntitiesFromSchema();
        $allowedSectionUids = $allowedEntities['sections'] ?? [];
        $allowedEntryTypeUids = $allowedEntities['entrytypes'] ?? [];

        if (empty($allowedSectionUids) || empty($allowedEntryTypeUids)) {
            return false;
        }

        $entryTypeIds = Db::idsByUids(DbTable::ENTRYTYPES, $allowedEntryTypeUids);
        $sectionIds = Db::idsByUids(DbTable::SECTIONS, $allowedSectionUids);

        return [
            'typeId' => array_values($entryTypeIds),
            'sectionId' => array_values($sectionIds)
        ];
    }
}
