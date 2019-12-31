<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://www.criosites.com.br/
 * @since      1.0.0
 *
 * @package    Admingen
 * @subpackage Admingen/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Admingen
 * @subpackage Admingen/public
 * @author     Luiz <luizantoniocardosocosta@gmail.com>
 */
class Admingen_Public {

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;
    private $adminGenConfig;
    private $crudPadrao;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of the plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version) {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->adminGenConfig = new AdminGenConfig();
        $this->crudPadrao = new CrudPadrao();
    }

    public function enqueue_styles() {
        $this->add_cssFiles();
    }

    public function enqueue_scripts() {
        $this->add_jsFiles();
    }

    public function add_jsFiles() {
        $jsFiles = $this->adminGenConfig->config_js();
        $this->adminGenConfig->jsDefault($this->plugin_name, $this->version);
        foreach ($jsFiles as $js) {
            $jsFile = "public_" . $this->plugin_name . str_replace('/', '_', str_replace('.', '_', $js));
            wp_enqueue_script($jsFile, LACC_ADMINGEN_APP . $js, array(), $this->version, true);
        }
    }

    public function add_cssFiles() {
        $cssFiles = $this->adminGenConfig->config_css();
        foreach ($cssFiles as $css) {
            $cssFile = "public_" . $this->plugin_name . "_" . str_replace('/', '_', str_replace('.', '_', $css));
            wp_enqueue_style($cssFile, LACC_ADMINGEN_APP . $css, array(), $this->version, 'all');
        }
    }

    public function add_ajax() {
        $funcs = array();
        foreach ($funcs as $nam) {
            $function = str_replace('-', '_', $nam);
            $ajaxName = 'wp_ajax_' . $function;
            add_action($ajaxName, array($this, $function));
        }
        $this->crudPadrao->add_ajax('public', 'wp_ajax_nopriv_');
    }

    public function lacc_img($tag) {
        $attr = array(
            "class" => isset($tag['class']) ? $tag['class'] : '',
            "style" => isset($tag['style']) ? $tag['style'] : '',
            "width" => isset($tag['width']) ? $tag['width'] : '120'
        );
        return '<img ng-src="{{item.imagens[0].url}}" width="' . $attr['width'] . '" class="' . $attr['class'] . '" style="' . $attr['style'] . '"/>';
    }

    public function lacc_img_aux($tag) {
        $attr = array(
            "class" => isset($tag['class']) ? $tag['class'] : '',
            "style" => isset($tag['style']) ? $tag['style'] : '',
            "width" => isset($tag['width']) ? $tag['width'] : '120'
        );
        return '<img ng-src="{{x.imagens[0].url}}" width="' . $attr['width'] . '" class="' . $attr['class'] . '" style="' . $attr['style'] . '"/>';
    }

    public function lacc_detalhe_item($tag, $content) {
        $htm = preg_replace('/%item%/', $_GET['item'], file_get_contents(LACC_ADMINGEN_DIR . 'public/detalhe-header.php'));
        $htm = $htm . (isset($content) ? do_shortcode($content) : "");
        $htm = $htm . file_get_contents(LACC_ADMINGEN_DIR . 'public/detalhe-footer.php');
        return $htm;
    }

    public function lacc_abri_item($tag) {
        $attr = array(
            "page" => isset($tag['page']) ? $tag['page'] : '1',
            "label" => isset($tag['label']) ? $tag['label'] : 'Detalhes'
        );
        return '<a href="?&item={{item.id}}&p=' . $attr['page'] . '">' . $attr['label'] . '</a>';
    }

    public function lacc_item($tag) {
        $attr = array(
            "name" => isset($tag['name']) ? $tag['name'] : 'item.nome',
            "elem" => isset($tag['elem']) ? $tag['elem'] : 'span');
        $htm = "<" . $attr['elem'] . " ng-bind-html='item." . $attr['name'] . "'></" . $attr['elem'] . ">";
        if ($attr['name'] == 'icon') {
            $class = "fa fas fa-{{item." . $attr['name'] . "}}";
            $htm = "<i class='" . $class . "'></i> ";
        }
        return $htm;
    }

    public function lacc_lista_aux($tag, $content) {
        $attr = array("name" => isset($tag['name']) ? $tag['name'] : 'x.nome', "elem" => isset($tag['elem']) ? $tag['elem'] : 'div');
        $htm = "<" . $attr['elem'] . " ng-repeat='x in item." . $attr['name'] . "'>";
        $htm = $htm . (isset($content) ? do_shortcode($content) : "");
        $htm = $htm . "</" . $attr['elem'] . ">";
        return $htm;
    }

    public function lacc_item_aux($tag) {
        $attr = array("name" => isset($tag['name']) ? $tag['name'] : 'x.nome', "elem" => isset($tag['elem']) ? $tag['elem'] : 'span');
        $htm = "<" . $attr['elem'] . " ng-bind-html='x." . $attr['name'] . "'></" . $attr['elem'] . ">";
        if ($attr['name'] == 'icon') {
            $class = "fa fas fa-{{x." . $attr['name'] . "}}";
            $htm = "<i class='" . $class . "'></i> ";
        }
        return $htm;
    }

    public function lacc_album($tag, $content) {
        $attr = array(
            "width" => isset($tag['width']) ? $tag['width'] : '315'
        );
        $htm = '<div style="width:' . $attr['width'] . 'px">' . file_get_contents(LACC_ADMINGEN_DIR . 'public/carousel.php') . '</div>';
        return $htm;
    }

    public function lacc_lista($tag, $content) {
        $htm = file_get_contents(LACC_ADMINGEN_DIR . 'public/listagem-header.php');
        $htm = $htm . (isset($content) ? do_shortcode($content) : "");
        $htm = $htm . file_get_contents(LACC_ADMINGEN_DIR . 'public/listagem-footer.php');
        return $htm;
    }

    public function lacc_filtro_list($tag) {
        $attr = array(
            "table" => isset($tag['table']) ? $tag['table'] : 'mylocal',
            "pagelist" => isset($tag['pagelist']) ? $tag['pagelist'] : '2'
        );

        $id = NULL;

        if (isset($_GET['item'])) {
            $id = $_GET['item'];
        }

        return "<admin-gen-filtro table='$attr[table]' id=\"$id\" pagelist=\"$attr[pagelist]\"></admin-gen-filtro>";
    }

    public function lacc_list_template($tag) {
        $attr = array(
            "qtdeporpagina" => isset($tag['qtdeporpagina']) ? $tag['qtdeporpagina'] : 10,
            "titulo" => isset($tag['titulo']) ? $tag['titulo'] : 'Listagem',
            "imgwidht" => isset($tag['imgwidht']) ? $tag['imgwidht'] : '',
            "showimg" => isset($tag['showimg']) ? $tag['showimg'] : 'não',
            "page" => isset($tag['page']) ? $tag['page'] : '1',
            "table" => isset($tag['table']) ? $tag['table'] : 'mylocal'
        );
        return "<admin-gen-lista table=\"$attr[table]\" template='listagem-principal' wppage=\"$attr[page]\" qtdeporpagina=\"$attr[qtdeporpagina]\" imgwidht='$attr[imgwidht]' showimg='$attr[showimg]' titulo='$attr[titulo]'></admin-gen-lista>";
    }

    public function lacc_detalhe_template($tag) {
        $attr = array(
            "table" => isset($tag['table']) ? $tag['table'] : 'mylocal'
        );
        $id = $_GET['item'];
        return "<admin-gen-detalhe table=\"$attr[table]\" id=\"$id\"></admin-gen-detalhe>";
    }

    public function lacc_filtro_cidade($tag) {
        return "<admin-gen-filtro-cidade></admin-gen-filtro-cidade>";
    }

    public function lacc_filtro_tipo($tag) {
        return "<admin-gen-filtro-tipo></admin-gen-filtro-tipo>";
    }

    public function lacc_filtro_preco($tag) {
        return "<admin-gen-filtro-preco></admin-gen-filtro-preco>";
    }

    public function add_shortcodes() {
        $shortcodes = array(
            'lacc_lista',
            'lacc_album',
            'lacc_abri_item',
            'lacc_detalhe_item',
            'lacc_item',
            'lacc_lista_aux',
            'lacc_item_aux',
            'lacc_img_aux',
            'lacc_img',
            'lacc_list_template',
            'lacc_detalhe_template', //c
            'lacc_filtro_cidade', //c
            'lacc_filtro_tipo', //c
            'lacc_filtro_preco', //c
            'lacc_filtro_list'
        );
        foreach ($shortcodes as $shortcode) {
            $function = str_replace('-', '_     ', $shortcode);
            add_shortcode($shortcode, array($this, $function));
        }
    }

}
