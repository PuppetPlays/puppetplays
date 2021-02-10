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

class AuthController extends Controller
{
  // Protected Properties
  // =========================================================================

  /**
   * @var    bool|array Allows anonymous access to this controller's actions.
   *         The actions must be in 'kebab-case'
   * @access protected
   */
  protected $allowAnonymous = ['index'];


  // Public Methods
  // =========================================================================

  /**
   * Handle a request going to our module's index action URL,
   * e.g.: actions/sitemodule/auth
   *
   * @return mixed
   */
  public function actionIndex()
  {
    Craft::$app->getResponse()->getHeaders()->set('Access-Control-Allow-Origin', '*');
    Craft::$app->getResponse()->getHeaders()->set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Craft-Token');
    Craft::$app->getResponse()->getHeaders()->set('Access-Control-Allow-Credentials', true);
    
    $user = Craft::$app->user;

    if ($user) {
      return $this->asJson($user);
    }

    return $this->asErrorJson('The user is not loggedIn');
  }
}
