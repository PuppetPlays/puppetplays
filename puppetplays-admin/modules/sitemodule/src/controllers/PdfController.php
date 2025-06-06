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

    public function actionGenerate($entryId = null, $language = null): Response
    {
        Craft::info("PDF Generation started for entryId: $entryId, language: $language", __METHOD__);

        try {
            // Validar que se proporcione un ID
            if (!$entryId) {
                throw new BadRequestHttpException('Entry ID is required');
            }

            // Determinar el site basado en el idioma
            $site = $this->resolveSite($language);

            // Recuperar la entry por ID en el site específico
            $entry = Craft::$app->entries->getEntryById($entryId, $site->id);

            if (!$entry) {
                throw new NotFoundHttpException("Entry with ID $entryId not found for language '{$site->language}'");
            }

            // Verificar que la entry esté habilitada para este site
            if (!$entry->getEnabledForSite($site->id)) {
                throw new NotFoundHttpException("Entry with ID $entryId is not enabled for language '{$site->language}'");
            }

            Craft::info("Entry found: {$entry->title} (Site: {$site->name}, Language: {$site->language})", __METHOD__);

            // Configurar el site actual para el contexto de renderizado
            $originalSiteId = Craft::$app->sites->getCurrentSite()->id;
            Craft::$app->sites->setCurrentSite($site);

            try {
                // Generar PDF usando template Twig
                $pdfResult = Craft::$app->view->renderString(
                    '{{ craft.documentHelper.pdf(template, destination, filename, entry, pdfOptions) }}',
                    [
                        'template' => '_pdf/works-template.twig',
                        'destination' => 'string',
                        'filename' => null,
                        'entry' => $entry,
                        'pdfOptions' => $this->getPdfOptions($entry, $site)
                    ]
                );
            } finally {
                // Restaurar el site original
                $originalSite = Craft::$app->sites->getSiteById($originalSiteId);
                if ($originalSite) {
                    Craft::$app->sites->setCurrentSite($originalSite);
                }
            }

            // Verificar que se generó contenido
            if (empty($pdfResult)) {
                throw new ServerErrorHttpException('PDF generation returned empty result');
            }

            Craft::info("PDF generated successfully. Size: " . strlen($pdfResult) . " bytes", __METHOD__);

            // Generar nombre de archivo con idioma
            $filename = $this->generateFilename($entry, $site);

            // Servir el PDF
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

    private function resolveSite(?string $language): Site
    {
        // Si no se proporciona idioma, usar el site por defecto
        if (!$language) {
            return Craft::$app->sites->getPrimarySite();
        }

        // Buscar site por idioma
        $sites = Craft::$app->sites->getAllSites();

        foreach ($sites as $site) {
            // Comparar con el código de idioma completo (ej: fr, en)
            if (substr($site->language, 0, 2) === $language) {
                return $site;
            }

            // Comparar con el handle del site si coincide
            if ($site->handle === $language) {
                return $site;
            }
        }

        // Si no se encuentra, lanzar excepción
        throw new BadRequestHttpException("Language '$language' is not supported. Available languages: " .
            implode(', ', array_unique(array_map(fn($s) => substr($s->language, 0, 2), $sites))));
    }
    /**
     * Generar nombre de archivo
     */
    private function generateFilename($entry, Site $site): string
    {
        $titleSlug = Craft::$app->view->renderString('{{ title }}', ['title' => $entry->title]);
        $language = substr($site->language, 0, 2);
        $date = date('Y-m-d');

        return "documento-{$titleSlug}-{$language}-{$date}.pdf";
    }

    /**
     * Opciones básicas para PDF
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
}
