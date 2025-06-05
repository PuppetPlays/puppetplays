<?php
// modules/main/src/controllers/PdfController.php

namespace modules\sitemodule\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;
use yii\web\ServerErrorHttpException;
use yii\web\NotFoundHttpException;

class PdfController extends Controller
{
    protected array|bool|int $allowAnonymous = ['generate'];

    public function actionGenerate($entryId = null): Response
    {
        Craft::info("PDF Generation started", __METHOD__);

        try {
            // Validar que se proporcione un ID
            if (!$entryId) {
                throw new ServerErrorHttpException('Entry ID is required');
            }

            // Recuperar la entry por ID
            $entry = Craft::$app->entries->getEntryById($entryId);

            if (!$entry) {
                throw new NotFoundHttpException("Entry with ID $entryId not found");
            }

            Craft::info("Entry found: " . $entry->title, __METHOD__);

            // Generar PDF usando template Twig
            $pdfResult = Craft::$app->view->renderString(
                '{{ craft.documentHelper.pdf(template, destination, filename, entry, pdfOptions) }}',
                [
                    'template' => '_pdf/simple-document.twig',  // Template en templates/_pdf/simple-document.twig
                    'destination' => 'string',             // Devolver contenido como string
                    'filename' => null,                    // Filename automático
                    'entry' => $entry,                       // Sin entry específico
                    'pdfOptions' => $this->getPdfOptions($entry)   // Opciones básicas
                ]
            );

            // Verificar que se generó contenido
            if (empty($pdfResult)) {
                throw new ServerErrorHttpException('PDF generation returned empty result');
            }

            Craft::info("PDF generated successfully. Size: " . strlen($pdfResult) . " bytes", __METHOD__);

            // Servir el PDF como descarga
            return $this->response->sendContentAsFile(
                $pdfResult,
                'documento-' . date('Y-m-d-H-i-s') . '.pdf',
                [
                    'mimeType' => 'application/pdf',
                    'inline' => false  // Forzar descarga
                ]
            );
        } catch (\Exception $e) {
            Craft::error('PDF generation failed: ' . $e->getMessage(), __METHOD__);

            // ✅ Forma correcta de devolver error en Craft
            $this->response->setStatusCode(500);
            $this->response->format = Response::FORMAT_HTML;
            $this->response->data = 'Error generando PDF: ' . $e->getMessage() .
                "\n\nStack trace:\n" . $e->getTraceAsString();

            return $this->response;
        }
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
