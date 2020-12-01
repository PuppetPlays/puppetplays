<?php

use craft\elements\Entry;
use craft\helpers\UrlHelper;

return [
  'endpoints' => [
    'works' => function() {
      return [
        'resourceKey' => 'works',
        'elementType' => Entry::class,
        'criteria' => ['section' => 'works'],
        'transformer' => function(Entry $entry) {
          return [
            'title' => $entry->title,
            'abstract' => $entry->abstract,
            'doi' => $entry->doi,
            'startWritingDate' => $entry->startWritingDate,
            'endWritingDate' => $entry->endWritingDate,
            'writingDisplayDate' => $entry->writingDisplayDate,
          ];
        },
      ];
    },
    'works/<entryId:\d+>' => function($entryId) {
      return [
        'elementType' => Entry::class,
        'criteria' => ['id' => $entryId],
        'one' => true,
        'transformer' => function(Entry $entry) {
          return [
            'title' => $entry->title,
            'abstract' => $entry->abstract,
            'doi' => $entry->doi,
            'startWritingDate' => $entry->startWritingDate,
            'endWritingDate' => $entry->endWritingDate,
            'writingDisplayDate' => $entry->writingDisplayDate,
          ];
        },
      ];
    },
  ]
];