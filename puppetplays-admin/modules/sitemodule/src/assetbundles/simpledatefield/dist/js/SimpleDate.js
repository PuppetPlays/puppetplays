/**
 * Site module for Craft CMS
 *
 * SimpleDate Field JS
 *
 * @author    intactile DESIGN
 * @copyright Copyright (c) 2021 intactile DESIGN
 * @link      https://intactile.com
 * @package   SiteModule
 * @since     1.0.0SiteModuleSimpleDate
 */

 ;(function ( $, window, document, undefined ) {

    var pluginName = "SiteModuleSimpleDate",
        defaults = {
        };

    // Plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function(id) {
            var _this = this;

            $(function () {

/* -- _this.options gives us access to the $jsonVars that our FieldType passed down to us */

            });
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
