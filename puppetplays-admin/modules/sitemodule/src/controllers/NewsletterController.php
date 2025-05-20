<?php

/**
 * Site module for Craft CMS 3.x
 *
 * A custom module to enhance the website
 *
 * @link      https://intactile.com
 * @copyright Copyright (c) 2021 intactile DESIGN
 */

namespace modules\sitemodule\controllers;

use modules\sitemodule\Sitemodule;

use Craft;
use craft\web\Controller;
use yii\web\Response;
use yii\web\BadRequestHttpException;

class NewsletterController extends Controller
{
  // Protected Properties
  // =========================================================================

  /**
   * @var    bool|array Allows anonymous access to this controller's actions.
   *         The actions must be in 'kebab-case'
   * @access protected
   */
  protected  array|bool|int $allowAnonymous = ['subscribe'];


  // Public Methods
  // =========================================================================
  /**
   * @inheritdoc
   */
  public function beforeAction($action): bool
  {
    if ($action->id === 'subscribe') {
      $this->enableCsrfValidation = false;
    }

    return parent::beforeAction($action);
  }

  /**
   * Handle the subscription to the newsletter
   *
   * @return mixed
   */
  public function actionSubscribe()
  {
    $this->requireAcceptsJson();

    $request = Craft::$app->getRequest();
    $response = Craft::$app->getResponse();

    // Add CORS headers
    $response->getHeaders()
      ->add('Access-Control-Allow-Origin', getenv('SITE_URL'))
      ->add('Access-Control-Allow-Headers', 'content-type')
      ->add('Access-Control-Allow-Methods', 'POST')
      ->add('Access-Control-Allow-Credentials', 'true');

    if ($request->getIsOptions()) {
      // This is just a preflight request, no need to run the actual query yet
      $response->format = Response::FORMAT_RAW;
      $response->data = '';
      return $response;
    }

    $response->format = Response::FORMAT_JSON;

    if ($request->getIsPost()) {
      $email = $request->getBodyParam('email');
      // $locale = $request->getBodyParam('locale');
      // $html = Craft::t('sitemodule', 'Subscription confirmed content', [], $locale);
      // $subject = Craft::t('sitemodule', 'Subscription confirmed', [], $locale);

      $emailSuccesfullySent = $this->sendMail('', 'subscribe puppetplays_newsletter', $email, 'sympa@univ-montp3.fr');

      if (!$emailSuccesfullySent) {
        throw new BadRequestHttpException('Cannot subscribe to the newsletter');
      }

      $response->data = 'Subscription confirmed';
      return $response;
    }
  }

  /**
   * @param string                            $html
   * @param string                            $subject
   * @param array|string|\craft\elements\User $mail
   *
   * @return bool
   */
  public function sendMail(string $html, string $subject, $from, $to): bool
  {
    return Craft::$app
      ->getMailer()
      ->compose()
      ->setFrom($from)
      ->setTo($to)
      ->setSubject($subject)
      ->setHtmlBody($html)
      ->send();
  }
}
