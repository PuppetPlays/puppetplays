<?php
// modules/main/src/controllers/PdfController.php

namespace modules\sitemodule\controllers;

use Craft;
use craft\web\Controller;
use yii\web\BadRequestHttpException;
use yii\web\Response;
use yii\web\ServerErrorHttpException;
use yii\web\NotFoundHttpException;
use craft\models\Site;

class PdfController extends Controller
{
    protected array|bool|int $allowAnonymous = ['generate'];

    /**
     * Template Config
     */
    private array $templateConfig = [
        'works' => 'works-template',
        'persons' => 'persons-template',
    ];

    public function actionGenerate($entryId = null, $language = null): Response
    {
        Craft::info("PDF Generation started for entryId: $entryId, language: $language", __METHOD__);

        try {
            // Validate that an ID is provided
            if (!$entryId) {
                throw new BadRequestHttpException('Entry ID is required');
            }

            // Determine the site based on the language
            $site = $this->resolveSite($language);

            // Retrieve the entry by ID in the specific site
            $entry = Craft::$app->entries->getEntryById($entryId, $site->id);

            if (!$entry) {
                throw new NotFoundHttpException("Entry with ID $entryId not found for language '{$site->language}'");
            }

            // Verify that the entry is enabled for this site
            if (!$entry->getEnabledForSite($site->id)) {
                throw new NotFoundHttpException("Entry with ID $entryId is not enabled for language '{$site->language}'");
            }

            $pdfOptions = $this->getPdfOptions($entry, $site);

            $entryType = $entry->getType()->handle;

            if ($entryType === 'persons') {
                $pdfOptions['custom']['works'] = $this->getAuthorWorks($entry);
            }

            $template = $this->getTemplateForEntryType($entryType);

            Craft::info("Entry found: {$entry->title} (Type: {$entryType}, Site: {$site->name}, Language: {$site->language})", __METHOD__);

            // Set up the current site for the rendering context
            $originalSiteId = Craft::$app->sites->getCurrentSite()->id;
            Craft::$app->sites->setCurrentSite($site);
            try {
                // Generate PDF using Twig template and PDF generator Plugin
                $pdfResult = Craft::$app->view->renderString(
                    '{{ craft.documentHelper.pdf(template, destination, filename, entry, pdfOptions) }}',
                    [
                        'template' => '_pdf/' . $template . '.twig',
                        'destination' => 'string',
                        'filename' => null,
                        'entry' => $entry,
                        'pdfOptions' => $pdfOptions
                    ]
                );
            } finally {
                // Restore original site
                $originalSite = Craft::$app->sites->getSiteById($originalSiteId);
                if ($originalSite) {
                    Craft::$app->sites->setCurrentSite($originalSite);
                }
            }

            // Verificate that content was generated
            if (empty($pdfResult)) {
                throw new ServerErrorHttpException('PDF generation returned empty result');
            }

            Craft::info("PDF generated successfully. Size: " . strlen($pdfResult) . " bytes", __METHOD__);

            // Generating Name
            $filename = $this->generateFilename($entry, $site);

            // Serve PDF
            return $this->response->sendContentAsFile(
                $pdfResult,
                $filename,
                [
                    'mimeType' => 'application/pdf',
                    'inline' => false
                ]
            );
        } catch (\Exception $e) {
            Craft::error('PDF generation failed: ' . $e->getMessage(), __METHOD__);

            $this->response->setStatusCode(500);
            $this->response->format = Response::FORMAT_HTML;
            $this->response->data = 'Error generando PDF: ' . $e->getMessage() .
                "\n\nStack trace:\n" . $e->getTraceAsString();

            return $this->response;
        }
    }

    /**
     * Get template by entry type
     */
    private function getTemplateForEntryType(string $entryType): string
    {
        if (!isset($this->templateConfig[$entryType])) {
            throw new BadRequestHttpException(
                "No template configured for entry type: '$entryType'. Available types: " .
                    implode(', ', array_keys($this->templateConfig))
            );
        }

        return $this->templateConfig[$entryType];
    }

    private function resolveSite(?string $language): Site
    {
        // If no language is provided, use the default site
        if (!$language) {
            return Craft::$app->sites->getPrimarySite();
        }

        // Search for site by language
        $sites = Craft::$app->sites->getAllSites();

        foreach ($sites as $site) {
            // Compare with the full language code (e.g.: fr, en)
            if (substr($site->language, 0, 2) === $language) {
                return $site;
            }

            // Compare with site handle if it matches
            if ($site->handle === $language) {
                return $site;
            }
        }

        // If not found, throw exception
        throw new BadRequestHttpException("Language '$language' is not supported. Available languages: " .
            implode(', ', array_unique(array_map(fn($s) => substr($s->language, 0, 2), $sites))));
    }

    /**
     * Generate filename
     */
    private function generateFilename($entry, Site $site): string
    {
        $titleSlug = Craft::$app->view->renderString('{{ title }}', ['title' => $entry->title]);
        $language = substr($site->language, 0, 2);
        $date = date('Y-m-d');

        return "{$titleSlug}-{$language}-{$date}.pdf";
    }

    /**
     * Basic PDF options
     */
    private function getPdfOptions($entry): array
    {

        return [
            'format' => 'A4',
            'encoding' => 'UTF-8',
            'margin_top' => 20,
            'margin_right' => 15,
            'margin_bottom' => 20,
            'margin_left' => 15,
            'custom' => [
                'author' => $entry->author->fullName,
            ]
        ];
    }

    /**
     * Works by Author
     */
    private function getAuthorWorks($authorEntry): array
    {

        $worksQuery = \craft\elements\Entry::find()
            ->section('works')
            ->relatedTo([
                'targetElement' => $authorEntry,
                'field' => 'authors'
            ])
            ->orderBy('title ASC')
            ->all();
        $works = [];
        foreach ($worksQuery as $work) {
            $works[] = [
                'id' => $work->id,
                'title' => $work->title,
                'slug' => $work->slug,
                'date' => $work->date ? $work->date->format('Y') : null,
                'url' => $work->url,
                'mostRelevantDate' => $work->mostRelevantDate,
            ];
        }

        return $works;
    }
}
