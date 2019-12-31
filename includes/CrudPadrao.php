<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CrudPadrao
 *
 * @author luiz
 */
class CrudPadrao {

    private $infoDB;

    public function __construct() {
        $startApp = new StartApp();
        $this->infoDB = $startApp->getInfo();
    }

    public function normalize($data, $table) {
        $obj = array();

        $infoTable = $this->tableInfo($table);
        $relacionados = $infoTable['relacionados'];
        $fiel_exclusoes = array('$$hashKey', 'id', 'count', 'inclusoes');
        if (!empty($relacionados)) {
            foreach ($relacionados as $r) {
                foreach ($r['columns'] as $rc) {
                    array_push($fiel_exclusoes, $rc);
                }
            }
        }
        foreach ($data as $key => $value) {
            if (!in_array($key, $fiel_exclusoes)) {
                if ($key === 'imagens') {
                    $obj[$key] = utf8_encode(json_encode($value));
                } else {
                    if (!empty($value) && $value !== "") {
                        $obj[$key] = $value;
                    }
                }
            }
        }
        return $obj;
    }

    public function prefix($prefix) {
        return $prefix . 'adgen_';
    }

    public function getId() {
        $t = $_POST['table'];
        $id = intval($_POST['id']);

        global $wpdb;

        $infoTable = $this->tableInfo($t);
        $relacionados = $infoTable['relacionados'];
        $inclusoes = $infoTable['inclusoes'];
        $table_name = $this->prefix($wpdb->prefix) . $t;

        $sql = "SELECT * from $table_name as t_main1 WHERE t_main1.id = $id;";

        $columns = array();
        $join = "";

        if (!empty($relacionados)) {
            foreach ($relacionados as $key => $r) {
                $t2 = $this->prefix($wpdb->prefix) . $r['table'];
                $join = $join . " LEFT JOIN $t2 as t_ad$key ";
                $join = $join . " ON t_main1.$r[field] = t_ad$key.id ";
                foreach ($r['columns'] as $rc) {
                    array_push($columns, "t_ad$key.$rc");
                }
            }
            $columnsJoin = join(", ", $columns);
            $sql = "SELECT t_main1.*, $columnsJoin from $table_name as t_main1 $join WHERE t_main1.id = $id;";
        }

        $item = $wpdb->get_row($sql);

        if (!empty($inclusoes)) {
            $inclusoes_r = array();

            $item->inclusoes = array();
            foreach ($inclusoes as $r) {
                $t1 = $this->prefix($wpdb->prefix) . $r['t1'];
                $t2 = $this->prefix($wpdb->prefix) . $r['t2'];
                $sqlTpl = "select t1.id as id_ref, " . join(", t2.", $r['t2f']) . " from $t1 as t1 left join $t2 as t2 on t2.id = t1.$r[id_loc] where $r[where] = $item->id;";
                $item->inclusoes[$r['alias']] = $wpdb->get_results($sqlTpl);
                foreach ($item->inclusoes[$r['alias']] as $itemInclusao) {
                    if (isset($itemInclusao->imagens)) {
                        $itemInclusao->imagens = json_decode($itemInclusao->imagens);
                    }
                }
            }
        }

        if (isset($item->imagens)) {
            $item->imagens = json_decode($item->imagens);
            foreach ($item->imagens as $key => $value) {
                //$item->imagens[$key] = json_decode($value, true); //str_replace("\\", "", $value)
            }
        }


        echo json_encode($item); //'sql' => $sql, 'inclusoes' => $inclusoes_r));
        die();
    }

    public function getList() {

        $t = $_POST['table'];
        $o = $_POST['offset'];
        $l = $_POST['limit'];
        $f = $_POST['field'];
        $or = $_POST['order'];
        $w = $_POST['where'];

        if (!empty($w)) {
            $listWhere = array();
            foreach ($w as $key => $value) {
                if (!empty($value)) {
                    array_push($listWhere, 'AND t_main1.' . $key . ($key === 'nome' ? " LIKE '%" . $value . "%'" : " = " . intval($value)));
                }
            }
            $w = 'WHERE 1=1 ' . join(" ", $listWhere);
        }

        global $wpdb;

        $infoTable = $this->tableInfo($t);
        $relacionados = $infoTable['relacionados'];
        $inclusoes = $infoTable['inclusoes'];
        $table_name = $this->prefix($wpdb->prefix) . $t;
        $total = $wpdb->get_var("SELECT COUNT(t_main1.id) FROM $table_name as t_main1 $w;");

        $sql = "SELECT * from $table_name as t_main1 $w ORDER BY t_main1.$f $or LIMIT $o, $l;";

        $columns = array();
        $join = "";

        if (!empty($relacionados)) {
            foreach ($relacionados as $key => $r) {
                $t2 = $this->prefix($wpdb->prefix) . $r['table'];
                $join = $join . " LEFT JOIN $t2 as t_ad$key ";
                $join = $join . " ON t_main1.$r[field] = t_ad$key.id ";
                foreach ($r['columns'] as $rc) {
                    array_push($columns, "t_ad$key.$rc");
                }
            }
            $columnsJoin = join(", ", $columns);
            $sql = "SELECT t_main1.*, $columnsJoin from $table_name as t_main1 $join $w ORDER BY t_main1.$f $or LIMIT $o, $l;";
        }

        $results = $wpdb->get_results($sql);

        if (!empty($inclusoes)) {
            foreach ($results as $item) {
                $item->inclusoes = array();
                foreach ($inclusoes as $r) {
                    $t1 = $this->prefix($wpdb->prefix) . $r['t1'];
                    $t2 = $this->prefix($wpdb->prefix) . $r['t2'];
                    $sqlTpl = "select t1.id as id_ref, t2.id as id_$r[alias], " . join(", t2.", $r['t2f']) . " from $t1 as t1 left join $t2 as t2 on t2.id = t1.$r[id_loc] where $r[where] = $item->id;";
                    $item->inclusoes[$r['alias']] = $wpdb->get_results($sqlTpl);
                    foreach ($item->inclusoes[$r['alias']] as $itemInclusao) {
                        if (isset($itemInclusao->imagens)) {
                            $itemInclusao->imagens = json_decode($itemInclusao->imagens);
                        }
                    }
                }
            }
        }

        foreach ($results as $item) {
            if (isset($item->imagens)) {
                $item->imagens = json_decode($item->imagens);
            }
        }

        echo json_encode((object) array('results' => $results, 'total' => $total, 'sql' => $w, 'inclusoes' => $w));
        die();
    }

    public function getListAll() {

        $t = $_GET['table'];
        $f = $_GET['field'];
        $or = $_GET['order'];
        global $wpdb;
        $table_name = $this->prefix($wpdb->prefix) . $t;
        $results = $wpdb->get_results("SELECT * from $table_name ORDER BY $f $or");
        echo json_encode($results);
        die();
    }

    public function tableInfo($table) {
        foreach ($this->infoDB as $value) {
            if ($value['tableName'] === $table) {
                return $value;
            }
        }
        return null;
    }

    public function insert() {

        $obj = $_POST;

        $id = intval($obj['data']['id']);
        $table = $obj['table'];
        $retorno = FALSE;
        $d = new DateTime();
        if (isset($id)) {
            global $wpdb;
            $dataNormalizada = $this->normalize($obj['data'], $table);
            $table_name = $this->prefix($wpdb->prefix) . $table;
            $retorno = $wpdb->insert($table_name, $dataNormalizada);
            $wpdb->update($this->prefix($wpdb->prefix) . 'tversion', array('version' => $d->format("Y-m-d H:i:s")), array('tabela' => $table));
        }
        $lastid = $wpdb->insert_id;
        $inclusoes_data = $obj['data']['inclusoes'];
        if (!empty($inclusoes_data)) {
            $infoTable = $this->tableInfo($table);
            $inclusoes = $infoTable['inclusoes'];
            foreach ($inclusoes as $r) {
                $data = $inclusoes_data[$r['alias']];
                foreach ($data as $value) {
                    $wpdb->insert($this->prefix($wpdb->prefix) . $r['t1'], array($r['id_loc'] => $value['id'], $r['where'] => $lastid));
                }
            }
        }

        echo json_encode($retorno);
        die();
    }

    public function update() {
        $obj = $_POST;
        $id = intval($obj['data']['id']);
        $table = $obj['table'];
        $retorno = FALSE;
        $d = new DateTime();
        if (isset($id)) {
            global $wpdb;
            $dataNormalizada = $this->normalize($obj['data'], $table);
            $table_name = $this->prefix($wpdb->prefix) . $table;
            $retorno = $wpdb->update($table_name, $dataNormalizada, array('id' => $id));
            $wpdb->update($this->prefix($wpdb->prefix) . 'tversion', array('version' => $d->format("Y-m-d H:i:s")), array('tabela' => $table));
        }
        $inclusoes_data = $obj['data']['inclusoes'];
        if (!empty($inclusoes_data)) {
            $infoTable = $this->tableInfo($table);
            $inclusoes = $infoTable['inclusoes'];
            foreach ($inclusoes as $r) {
                $data = $inclusoes_data[$r['alias']];
                foreach ($data as $value) {
                    if (isset($value['id_ref']) && isset($value['isRemove'])) {
                        $wpdb->delete($this->prefix($wpdb->prefix) . $r['t1'], array('id' => $value['id_ref']));
                    }
                    if (!isset($value['id_ref']) && !isset($value['isRemove'])) {
                        $wpdb->insert($this->prefix($wpdb->prefix) . $r['t1'], array($r['id_loc'] => $value['id'], $r['where'] => $id));
                    }
                }
            }
        }
        echo json_encode($retorno);
        die();
    }

    public function delete() {
        $obj = $_POST;
        $id = intval($obj['data']['id']);
        $table = $obj['table'];
        $infoTable = $this->tableInfo($table);
        $exclusoes = $infoTable['exclusoes'];
        $retorno = array();
        $d = new DateTime();
        if (isset($id)) {
            global $wpdb;
            $table_name = $this->prefix($wpdb->prefix) . $table;
            array_push($retorno, $wpdb->delete($table_name, array('id' => $id)));
            $wpdb->update($this->prefix($wpdb->prefix) . 'tversion', array('version' => $d->format("Y-m-d H:i:s")), array('tabela' => $table));
            foreach ($exclusoes as $r) {
                array_push($retorno, $wpdb->delete($this->prefix($wpdb->prefix) . $r['table'], array($r['field'] => $id)));
            }
        }
        echo json_encode($retorno);
        die();
    }

    public function filterInput($string, $strict = true) {

        // bad chars
        $strip = array("..", "*", "\n");

        // we need this sometimes
        if ($strict)
            array_push($strip, "/", "\\");

        $clean = trim(str_replace($strip, "_", strip_tags($string)));

        return $clean;
    }

    public function deleteFile() {
        $upload_handler = new UploadHandler();
        $upload_handler->options['upload_dir'] = LACC_ADMINGEN_DIR . 'repository/' . $_POST['table'] . '/' . $_POST['id'] . '/';
        echo json_encode($upload_handler->delete());
        die();
    }

    public function upload() {

        if ($_SERVER['REQUEST_METHOD'] != 'POST')
            die();

        $upload_handler = new UploadHandler();
        $pasta = LACC_ADMINGEN_DIR . 'repository/' . $_POST['table'] . '/' . $_POST['id'] . '/';
        if (!file_exists($pasta)) {
            mkdir($pasta, 0777, true);
        }
        $upload_handler->options['upload_dir'] = $pasta;
        $filename = '?';
        if (isset($_FILES['files']['name'])) {
            $filename = $this->filterInput(implode(" ", $_FILES['files']['name']));
        }

        header('Pragma: no-cache');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        header('Access-Control-Allow-Origin: *');
        $retorno = $upload_handler->post();
        $retorno['url'] = LACC_ADMINGEN_URI . 'repository/' . $_POST['table'] . '/' . $_POST['id'] . '/' . $retorno['file']->name;
        echo json_encode($retorno);
        die();
    }

    public function add_ajax($type = 'admin', $prefix = 'wp_ajax_') {
        $funcs = array(
            'admin' => array(
                'tversion',
                'getId',
                'getList',
                'getListAll',
                'upload',
                'deleteFile',
                'update',
                'insert',
                'delete',
                'filtropreco',
                'filtrotipo',
                'filtrocidade'
            ),
            'public' => array(
                'tversion',
                'getId',
                'getList',
                'getListAll',
                'filtropreco',
                'filtrotipo',
                'filtrocidade'
            )
        );
        foreach ($funcs[$type] as $nam) {
            $function = str_replace('-', '_', $nam);
            $ajaxName = $prefix . 'adminGen_' . $function;
            add_action($ajaxName, array($this, $function));
        }
    }

    /**
     * custom
     */
    public function filtrocidade() {
        global $wpdb;
        $tcidade = $this->prefix($wpdb->prefix) . 'cidade';
        $tmylocal = $this->prefix($wpdb->prefix) . 'mylocal';
        $sql = "select c.id, c.nome_cidade, COUNT(lc.id) as total from $tcidade as c right join $tmylocal as lc on lc.cidade_id = c.id GROUP by c.id, c.nome_cidade order by c.nome_cidade;";
        $results = $wpdb->get_results($sql);
        echo json_encode($results);
        die();
    }

    public function filtrotipo() {
        global $wpdb;
        $tipo = $this->prefix($wpdb->prefix) . 'tipo';
        $tmylocal = $this->prefix($wpdb->prefix) . 'mylocal';
        $sql = "select c.id, c.nome_tipo, COUNT(lc.id) as total from $tipo as c right join $tmylocal as lc on lc.tipo_id = c.id GROUP by c.id, c.nome_tipo order by c.nome_tipo;";
        $results = $wpdb->get_results($sql);
        echo json_encode($results);
        die();
    }

    public function filtropreco() {
        global $wpdb;
        $preco = $this->prefix($wpdb->prefix) . 'faixa_preco';
        $tmylocal = $this->prefix($wpdb->prefix) . 'mylocal';
        $sql = "select c.id, c.nome_preco, COUNT(lc.id) as total from $preco as c right join $tmylocal as lc on lc.faixa_preco_id = c.id GROUP by c.id, c.nome_preco order by c.nome_preco;";
        $results = $wpdb->get_results($sql);
        echo json_encode($results);
        die();
    }

    public function tversion() {
        global $wpdb;
        $tversion = $this->prefix($wpdb->prefix) . 'tversion';
        $sql = "select * from $tversion";
        $results = $wpdb->get_results($sql);
        echo json_encode($results);
        die();
    }

}
