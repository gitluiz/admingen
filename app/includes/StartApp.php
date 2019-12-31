<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of StartApp
 *
 * @author luiz
 */
class StartApp {

    private $tables;

    public function __construct() {
        $this->tables = array(
            array(
                'tableName' => 'tversion',
                'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        tabela VARCHAR(254) NULL DEFAULT NULL,
                        version VARCHAR(254) NULL DEFAULT NULL,
                        PRIMARY KEY (id),
                        INDEX fk_tversion_tabela1_idx (tabela ASC))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array(
                'tableName' => 'cidade',
                'exclusoes' => array(
                    array('table' => 'mylocal', 'field' => 'cidade_id')
                ),
                'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        nome_cidade VARCHAR(254) NULL DEFAULT NULL,
                        PRIMARY KEY (id))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array(
                'tableName' => 'tipo',
                'exclusoes' => array(
                    array('table' => 'mylocal', 'field' => 'tipo_id')
                ),
                'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        nome_tipo VARCHAR(254) NULL DEFAULT NULL,
                        PRIMARY KEY (id))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array(
                'tableName' => 'faixa_preco',
                'exclusoes' => array(
                    array('table' => 'mylocal', 'field' => 'faixa_preco_id')
                ),
                'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        nome_preco VARCHAR(254) NULL DEFAULT NULL,
                        PRIMARY KEY (id))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array(
                'tableName' => 'mylocal',
                'exclusoes' => array(
                    array('table' => 'local_instalacoes', 'field' => 'mylocal_id'),
                    array('table' => 'local_estrutura', 'field' => 'mylocal_id')
                ),
                'inclusoes' => array(
                    array('t1' => 'local_instalacoes', 't2' => 'instalacoes', 't2f' => array('nome_instalacao', 'icon', 'imagens'), 'id_loc' => 'instalacoes_id', 'where' => 'mylocal_id', 'alias' => 'instalacoes'),
                    array('t1' => 'local_estrutura', 't2' => 'estrutura', 't2f' => array('nome_estrutura', 'icon', 'imagens'), 'id_loc' => 'estrutura_id', 'where' => 'mylocal_id', 'alias' => 'estruturas')
                ),
                'relacionados' => array(
                    array('table' => 'cidade', 'field' => 'cidade_id', 'columns' => array('nome_cidade')),
                    array('table' => 'tipo', 'field' => 'tipo_id', 'columns' => array('nome_tipo')),
                    array('table' => 'faixa_preco', 'field' => 'faixa_preco_id', 'columns' => array('nome_preco'))
                ),
                'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        nome VARCHAR(254) NULL DEFAULT NULL,
                        email VARCHAR(254) NULL DEFAULT NULL,
                        site VARCHAR(254) NULL DEFAULT NULL,
                        descricao TEXT NULL DEFAULT NULL,
                        contatos TEXT NULL DEFAULT NULL,
                        imagens TEXT NULL DEFAULT NULL,
                        informacoes_adicional TEXT NULL DEFAULT NULL,
                        horarios_visita VARCHAR(254) NULL DEFAULT NULL,
                        logradouro VARCHAR(254) NULL DEFAULT NULL,
                        numero VARCHAR(10) NULL DEFAULT NULL,
                        bairro VARCHAR(254) NULL DEFAULT NULL,
                        cep VARCHAR(254) NULL DEFAULT NULL,
                        up VARCHAR(2) NULL DEFAULT NULL,
                        cidade_id INT(8) NOT NULL,
                        tipo_id INT(8) NOT NULL,
                        faixa_preco_id INT(8) NOT NULL,
                        PRIMARY KEY (id),
                        INDEX fk_mylocal_nome1_idx (nome ASC),
                        INDEX fk_mylocal_cidade1_idx (cidade_id ASC),
                        INDEX fk_mylocal_tipo1_idx (cidade_id ASC),
                        INDEX fk_mylocal_faixa_preco1_idx (faixa_preco_id ASC))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array('tableName' => 'estrutura', 'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        nome_estrutura VARCHAR(254) NULL DEFAULT NULL,
                        imagens TEXT NULL DEFAULT NULL,
                        icon VARCHAR(254) NULL DEFAULT NULL,
                        PRIMARY KEY (id))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array('tableName' => 'instalacoes', 'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        nome_instalacao VARCHAR(254) NULL DEFAULT NULL,
                        imagens TEXT NULL DEFAULT NULL,
                        icon VARCHAR(254) NULL DEFAULT NULL,
                        PRIMARY KEY (id))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;'),
            array('tableName' => 'local_instalacoes', 'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        mylocal_id INT(8) NOT NULL,
                        instalacoes_id INT(8) NOT NULL,
                        PRIMARY KEY (id),
                        INDEX fk_local_instalacoes_mylocal1_idx (mylocal_id ASC),
                        INDEX fk_local_instalacoes_instalacoes1_idx (instalacoes_id ASC))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci'),
            array('tableName' => 'local_estrutura', 'sql' => 'CREATE TABLE %s (
                        id INT(8) NOT NULL AUTO_INCREMENT,
                        mylocal_id INT(8) NOT NULL,
                        estrutura_id INT(8) NOT NULL,
                        PRIMARY KEY (id),
                        INDEX fk_local_estrutura_mylocal_idx (mylocal_id ASC),
                        INDEX fk_local_estrutura_estrutura1_idx (estrutura_id ASC))
                        ENGINE = InnoDB
                        DEFAULT CHARACTER SET = utf8mb4
                        COLLATE = utf8mb4_unicode_520_ci;')
        );
    }

    public function getInfo() {
        return $this->tables;
    }

    public function createDataBase() {
        global $wpdb;

        $prefix = $wpdb->prefix . 'adgen_';
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

        foreach ($this->tables as $value) {
            $obj = (object) $value;
            $tableName = $prefix . $obj->tableName;
            if (count(dbDelta("SHOW TABLES LIKE '$tableName'")) === 0) {
                dbDelta(sprintf($obj->sql, $tableName));
                if ($obj->tableName == 'tversion') {
                    dbDelta("INSERT INTO " . $prefix . "tversion (tabela, version) VALUES('cidade', '');");
                    dbDelta("INSERT INTO " . $prefix . "tversion (tabela, version) VALUES('tipo', '');");
                    dbDelta("INSERT INTO " . $prefix . "tversion (tabela, version) VALUES('faixa_preco', '');");
                    dbDelta("INSERT INTO " . $prefix . "tversion (tabela, version) VALUES('estrutura', '');");
                    dbDelta("INSERT INTO " . $prefix . "tversion (tabela, version) VALUES('instalacoes', '');");
                    dbDelta("INSERT INTO " . $prefix . "tversion (tabela, version) VALUES('mylocal', '');");
                }
                if ($obj->tableName == 'cidade') {
                    dbDelta("INSERT INTO " . $prefix . "cidade (nome_cidade) VALUES('Campinas');");
                    dbDelta("INSERT INTO " . $prefix . "cidade (nome_cidade) VALUES('São Paulo');");
                    dbDelta("INSERT INTO " . $prefix . "cidade (nome_cidade) VALUES('Rio de Janeiro');");
                }
                if ($obj->tableName == 'tipo') {
                    dbDelta("INSERT INTO " . $prefix . "tipo (nome_tipo) VALUES('Casa de Repouso');");
                    dbDelta("INSERT INTO " . $prefix . "tipo (nome_tipo) VALUES('Centros Dia');");
                    dbDelta("INSERT INTO " . $prefix . "tipo (nome_tipo) VALUES('Centros de Convivência');");
                }
                if ($obj->tableName == 'faixa_preco') {
                    dbDelta("INSERT INTO " . $prefix . "faixa_preco (nome_preco) VALUES('Sob Consulta');");
                    dbDelta("INSERT INTO " . $prefix . "faixa_preco (nome_preco) VALUES('valor até R$ 1499,00');");
                    dbDelta("INSERT INTO " . $prefix . "faixa_preco (nome_preco) VALUES('valor de R$ 1500,00 a R$ 2999,00');");
                    dbDelta("INSERT INTO " . $prefix . "faixa_preco (nome_preco) VALUES('valor de R$ 3000,00 a R$ 4999,00');");
                    dbDelta("INSERT INTO " . $prefix . "faixa_preco (nome_preco) VALUES('mais de 4999,00');");
                }
                if ($obj->tableName == 'estrutura') {
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Médico', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Técnico de enfermagem', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Nutricionistas', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Terapeutas Ocupacionais', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Fisioterapeutas', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Fonoaudiologo', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Dentista', '');");
                    dbDelta("INSERT INTO " . $prefix . "estrutura (nome_estrutura, icon) VALUES('Psicólogos', '');");
                }
                if ($obj->tableName == 'instalacoes') {
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('6 Refeições por Dia', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Quartos Individuais', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Quartos Coletivos', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Câmera 24 horas', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Atividade e Área de Laze', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Cuidados Pessoais', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Atendimento Emergencial', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Alimentação Parenteral', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('Lavanderia Própria', '');");
                    dbDelta("INSERT INTO " . $prefix . "instalacoes (nome_instalacao, icon) VALUES('independente semi-dependente dependente', '');");
                }
            }
        }
    }

}
