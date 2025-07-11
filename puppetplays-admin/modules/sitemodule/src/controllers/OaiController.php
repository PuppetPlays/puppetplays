<?php
// modules/main/src/controllers/OaiController.php

namespace modules\sitemodule\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;

class OaiController extends Controller
{
    protected array|bool|int $allowAnonymous = ['index'];

    public function actionIndex(): Response
    {
        $verb = Craft::$app->request->getParam('verb');

        $this->response->format = Response::FORMAT_RAW;
        $this->response->headers->set('Content-Type', 'application/xml; charset=utf-8');

        $commonVars = [
            'responseDate' => gmdate('Y-m-d\TH:i:s\Z'),
            'baseUrl' => Craft::$app->request->getAbsoluteUrl(),
            'verb' => $verb,
        ];

        if ($verb === 'Identify') {
            $config = Craft::$app->config->getConfigFromFile('oai');

            $earliestEntry = \craft\elements\Entry::find()
                ->status('enabled')
                ->orderBy('dateCreated ASC')
                ->one();

            $earliestDatestamp = $earliestEntry ?
                $earliestEntry->dateCreated->format('Y-m-d\TH:i:s\Z') :
                '2020-01-01T00:00:00Z';

            $vars = array_merge($commonVars, [
                'repositoryName' => $config['repositoryName'],
                'adminEmail' => $config['adminEmail'],
                'earliestDatestamp' => $earliestDatestamp,
                'requestParams' => [],
            ]);

            $this->response->data = $this->renderTemplate('oai/identify', $vars);
        } elseif ($verb === 'ListMetadataFormats') {
            $vars = array_merge($commonVars, [
                'requestParams' => ['metadataPrefix' => 'oai_dc'],
            ]);

            $this->response->data = $this->renderTemplate('oai/list-metadata-formats', $vars);
        } elseif ($verb === 'ListSets') {
            $sections = Craft::$app->sections->getAllSections();
            $sites = Craft::$app->sites->getAllSites();

            $setsData = [];

            foreach ($sections as $section) {
                $setsData[] = (object)[
                    'setSpec' => $section->handle,
                    'setName' => $section->name,
                ];
            }

            foreach ($sections as $section) {
                foreach ($sites as $site) {
                    $setsData[] = (object)[
                        'setSpec' => $section->handle . ':' . $site->language,
                        'setName' => $section->name . ' (' . strtoupper($site->language) . ')',
                    ];
                }
            }

            $vars = array_merge($commonVars, [
                'sets' => $setsData,
                'requestParams' => [],
            ]);

            $this->response->data = $this->renderTemplate('oai/list-sets', $vars);
        } elseif ($verb === 'ListIdentifiers') {
            $set = Craft::$app->request->getParam('set');
            $from = Craft::$app->request->getParam('from');
            $until = Craft::$app->request->getParam('until');

            $setFilter = $this->parseSetFilter($set);
            $query = \craft\elements\Entry::find()->status('enabled');

            if ($setFilter['section']) {
                $query->section($setFilter['section']);
            }

            if ($setFilter['language']) {
                $sitesByLanguage = Craft::$app->sites->getAllSites();
                foreach ($sitesByLanguage as $site) {
                    if ($site->language === $setFilter['language']) {
                        $query->siteId($site->id);
                        break;
                    }
                }
            }

            if ($from) {
                $fromDate = $this->parseOaiDate($from);
                if ($fromDate) {
                    $query->dateUpdated('>= ' . $fromDate->format('Y-m-d H:i:s'));
                }
            }

            if ($until) {
                $untilDate = $this->parseOaiDate($until);
                if ($untilDate) {
                    $query->dateUpdated('<= ' . $untilDate->format('Y-m-d H:i:s'));
                }
            }

            $entries = $query->all();

            $requestParams = ['metadataPrefix' => 'oai_dc'];
            if ($set) $requestParams['set'] = $set;
            if ($from) $requestParams['from'] = $from;
            if ($until) $requestParams['until'] = $until;

            $entriesData = [];
            foreach ($entries as $entry) {
                $entriesData[] = (object)[
                    'oaiIdentifier' => $this->generateOaiIdentifier($entry),
                    'dateUpdated' => $entry->dateUpdated,
                    'section' => $entry->section,
                ];
            }

            $vars = array_merge($commonVars, [
                'entries' => $entriesData,
                'requestParams' => $requestParams,
            ]);

            $this->response->data = $this->renderTemplate('oai/list-identifiers', $vars);
        } elseif ($verb === 'GetRecord') {
            $identifier = Craft::$app->request->getParam('identifier');

            if (!$identifier) {
                $this->response->data = $this->renderTemplate('oai/error', array_merge($commonVars, [
                    'errorCode' => 'badArgument',
                    'errorMessage' => 'Missing identifier parameter',
                    'requestParams' => [],
                ]));
                return $this->response;
            }

            $parts = explode(':', $identifier);
            if (count($parts) !== 3) {
                $this->response->data = $this->renderTemplate('oai/error', array_merge($commonVars, [
                    'errorCode' => 'idDoesNotExist',
                    'errorMessage' => 'Invalid identifier format',
                    'requestParams' => [],
                ]));
                return $this->response;
            }

            $entryParts = explode('-', $parts[2]);
            if (count($entryParts) < 2) {
                $this->response->data = $this->renderTemplate('oai/error', array_merge($commonVars, [
                    'errorCode' => 'idDoesNotExist',
                    'errorMessage' => 'Invalid identifier format',
                    'requestParams' => [],
                ]));
                return $this->response;
            }

            $entryId = $entryParts[1];
            $entry = \craft\elements\Entry::find()->id($entryId)->one();

            if (!$entry) {
                $this->response->data = $this->renderTemplate('oai/error', array_merge($commonVars, [
                    'errorCode' => 'idDoesNotExist',
                    'errorMessage' => 'Entry not found',
                    'requestParams' => [],
                ]));
                return $this->response;
            }

            $recordData = (object)[
                'oaiIdentifier' => $this->generateOaiIdentifier($entry),
                'dateUpdated' => $entry->dateUpdated,
                'section' => $entry->section,
                'title' => $entry->title,
                'creator' => $this->extractCreators($entry),
                'dateCreated' => $entry->dateCreated,
                'description' => $entry->abstract ?? $entry->note ?? $entry->projectSummary ?? 'No description available',
                'subjects' => $this->extractSubjects($entry),
                'url' => $entry->getUrl() ?? '',
                'language' => $entry->site->language,
                'type' => $entry->section->name,
            ];

            $vars = array_merge($commonVars, [
                'record' => $recordData,
                'requestParams' => [
                    'identifier' => $identifier,
                    'metadataPrefix' => 'oai_dc'
                ],
            ]);

            $this->response->data = $this->renderTemplate('oai/get-record', $vars);
        } elseif ($verb === 'ListRecords') {
            $set = Craft::$app->request->getParam('set');
            $from = Craft::$app->request->getParam('from');
            $until = Craft::$app->request->getParam('until');

            $setFilter = $this->parseSetFilter($set);
            $query = \craft\elements\Entry::find()->status('enabled');

            if ($setFilter['section']) {
                $query->section($setFilter['section']);
            }

            if ($setFilter['language']) {
                $sitesByLanguage = Craft::$app->sites->getAllSites();
                foreach ($sitesByLanguage as $site) {
                    if ($site->language === $setFilter['language']) {
                        $query->siteId($site->id);
                        break;
                    }
                }
            }

            if ($from) {
                $fromDate = $this->parseOaiDate($from);
                if ($fromDate) {
                    $query->dateUpdated('>= ' . $fromDate->format('Y-m-d H:i:s'));
                }
            }

            if ($until) {
                $untilDate = $this->parseOaiDate($until);
                if ($untilDate) {
                    $query->dateUpdated('<= ' . $untilDate->format('Y-m-d H:i:s'));
                }
            }

            $entries = $query->all();

            $requestParams = ['metadataPrefix' => 'oai_dc'];
            if ($set) $requestParams['set'] = $set;
            if ($from) $requestParams['from'] = $from;
            if ($until) $requestParams['until'] = $until;

            $entriesData = [];
            foreach ($entries as $entry) {
                $entriesData[] = (object)[
                    'oaiIdentifier' => $this->generateOaiIdentifier($entry),
                    'dateUpdated' => $entry->dateUpdated,
                    'section' => $entry->section,
                    'title' => $entry->title,
                    'creator' => $this->extractCreators($entry),
                    'dateCreated' => $entry->dateCreated,
                    'description' => $entry->abstract ?? $entry->note ?? $entry->projectSummary ?? 'No description available',
                    'subjects' => $this->extractSubjects($entry),
                    'url' => $entry->getUrl() ?? '',
                    'language' => $entry->site->language,
                    'type' => $entry->section->name,
                ];
            }

            $vars = array_merge($commonVars, [
                'entries' => $entriesData,
                'requestParams' => $requestParams,
            ]);

            $this->response->data = $this->renderTemplate('oai/list-records', $vars);
        } else {
            $this->response->data = $this->renderTemplate('oai/error', array_merge($commonVars, [
                'errorCode' => 'badVerb',
                'errorMessage' => 'Verb not implemented yet',
                'requestParams' => [],
            ]));
        }

        return $this->response;
    }

    private function generateOaiIdentifier($entry): string
    {
        $domain = Craft::$app->request->getHostName();
        $section = $entry->section->handle;
        $id = $entry->id;
        $language = $entry->site->language;

        return "oai:{$domain}:{$section}-{$id}-{$language}";
    }

    private function extractCreators($entry): string
    {
        $creators = [];

        if (isset($entry->authors) && $entry->authors) {
            foreach ($entry->authors->all() as $author) {
                if ($author && $author->title) {
                    $creators[] = $author->title;
                }
            }
        }

        return !empty($creators) ? implode(', ', $creators) : 'Unknown';
    }

    private function extractSubjects($entry): array
    {
        $subjects = [];

        if (isset($entry->keywords) && $entry->keywords) {
            foreach ($entry->keywords->all() as $tag) {
                if ($tag && $tag->title) {
                    $subjects[] = $tag->title;
                }
            }
        }

        return $subjects;
    }

    private function parseOaiDate($dateString): ?\DateTime
    {
        $formats = [
            'Y-m-d\TH:i:s\Z',
            'Y-m-d',
        ];

        foreach ($formats as $format) {
            $date = \DateTime::createFromFormat($format, $dateString);
            if ($date !== false) {
                return $date;
            }
        }

        return null;
    }

    private function parseSetFilter($set): array
    {
        if (!$set) {
            return ['section' => null, 'language' => null];
        }

        if (strpos($set, ':') !== false) {
            $parts = explode(':', $set, 2);
            return [
                'section' => $parts[0],
                'language' => $parts[1] ?? null
            ];
        }

        return ['section' => $set, 'language' => null];
    }
}
