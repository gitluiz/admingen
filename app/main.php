<div style="padding: 10px" ng-app="admGenApp">
    <div style="padding: 5px;border: 1px solid #999;padding-bottom: 0;margin-bottom: 5px;">
        <div class="row">
            <div class="col-12">
                <ul class="nav nav-pills" id="pills-tab" role="tablist">
                    <li class="nav-item col-lg-2 col-md-3 col-sm-12" style="padding: 0">
                        <a class="nav-link btn active" id="pills-home-tab" data-toggle="pill" href="#pills-1"
                           role="tab" aria-controls="pills-home" aria-selected="true">Principal</a>
                    </li>
                    <li class="nav-item col-lg-2 col-md-3 col-sm-6" style="padding: 0">
                        <a class="nav-link btn" id="pills-profile-tab" data-toggle="pill" href="#pills-2"
                           role="tab" aria-controls="pills-profile" aria-selected="false">Cidades</a>
                    </li>
                    <li class="nav-item col-lg-2 col-md-3 col-sm-6" style="padding: 0">
                        <a class="nav-link btn" id="pills-contact-tab" data-toggle="pill" href="#pills-3"
                           role="tab" aria-controls="pills-contact" aria-selected="false">Estruturas</a>
                    </li>
                    <li class="nav-item col-lg-2 col-md-3 col-sm-6" style="padding: 0">
                        <a class="nav-link btn" id="pills-contact-tab" data-toggle="pill" href="#pills-4"
                           role="tab" aria-controls="pills-contact" aria-selected="false">Instalações</a>
                    </li>
                    <li class="nav-item col-lg-1 col-md-4 col-sm-6" style="padding: 0">
                        <a class="nav-link btn" id="pills-contact-tab" data-toggle="pill" href="#pills-5"
                           role="tab" aria-controls="pills-contact" aria-selected="false">Preço</a>
                    </li>
                    <li class="nav-item col-lg-1 col-md-4 col-sm-6" style="padding: 0">
                        <a class="nav-link btn" id="pills-contact-tab" data-toggle="pill" href="#pills-7"
                           role="tab" aria-controls="pills-contact" aria-selected="false">Tipos</a>
                    </li>
                    <li class="nav-item col-lg-2 col-md-4 col-sm-6" style="padding: 0">
                        <a class="nav-link btn" id="pills-contact-tab" data-toggle="pill" href="#pills-6"
                           role="tab" aria-controls="pills-contact" aria-selected="false">Configuração</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div style="padding: 5px;border: 1px solid #999;">
        <div class="row">
            <div class="col-12">
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-1" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <admin-gen-lista table='mylocal'></admin-gen-lista>
                    </div>
                    <div class="tab-pane fade" id="pills-2" role="tabpanel" aria-labelledby="pills-home-tab">
                        <admin-gen-lista table='cidade'></admin-gen-lista>
                    </div>
                    <div class="tab-pane fade" id="pills-3" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <admin-gen-lista table='estrutura'></admin-gen-lista>
                    </div>
                    <div class="tab-pane fade" id="pills-4" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <admin-gen-lista table='instalacoes'></admin-gen-lista>
                    </div>
                    <div class="tab-pane fade" id="pills-5" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <admin-gen-lista table='faixa_preco'></admin-gen-lista>
                    </div>
                    <div class="tab-pane fade" id="pills-7" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <admin-gen-lista table='tipo'></admin-gen-lista>
                    </div>
                    <div class="tab-pane fade" id="pills-6" role="tabpanel" aria-labelledby="pills-contact-tab">
                        Configuração:
                        <br>
                        Ex Listagem:<br>
                        <code>
                            [lacc_filtro_list]

                            Casas

                            [lacc_lista]

                            Nome: [lacc_item name="nome"]
                            Descrição: [lacc_item name="descricao"][lacc_abri_item page="60" label="ver mais"]

                            Estrutura e Instalações:

                            [lacc_lista_aux name="inclusoes.estruturas"]

                            [lacc_item_aux name="icon"] [lacc_item_aux name="nome_estrutura"]
                            [lacc_img_aux width="20"] [lacc_item_aux name="nome_estrutura"]

                            [/lacc_lista_aux]

                            Estrutura e Instalações:

                            [lacc_lista_aux name="inclusoes.instalacoes"]

                            [lacc_item_aux name="icon"] [lacc_item_aux name="nome_instalacao"]
                            [lacc_img_aux width="20"] [lacc_item_aux name="nome_instalacao"]

                            [/lacc_lista_aux]

                            [/lacc_lista]
                        </code>
                        <hr>
                        Ex: Detalhes:<br>
                        <code>
                            [lacc_detalhe_item]
                            <br>
                            Nome: [lacc_item name="nome" elem="div"]
                            <br>
                            Descrição: [lacc_item name="descricao" elem="div"]
                            <br>
                            [lacc_album width="400"]
                            <br>
                            [/lacc_detalhe_item]
                        </code>
                        <hr>
                        <h4>Disponiveis para "lacc_item name"</h4>
                        nome<br>
                        descricao<br>
                        contatos<br>
                        email<br>
                        site<br>
                        horarios_visita<br>
                        informacoes_adicional<br>
                        nome_preco<br>
                        logradouro<br>
                        numero<br>
                        bairro<br>
                        nome_cidade<br>
                        up<br>
                        cep<br>
                        <hr>
                        <h4>Pega a primeira Imagens</h4>
                        <code>
                            [lacc_img src="imagens[0].url" class="" width="120" style=""]
                        </code>
                        <hr>
                        <h4>Template Pronto</h4>
                        <code>
                            [lacc_filtro_list]
                            [lacc_list_template page="60" titulo="Casas Disponíveis" showimg="sim" qtdeporpagina="10"]
                        </code>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->

    <div class="modal fade" id="main_modal_conteudo_admingen" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" id="modal_conteudo_admingen">
            </div>
        </div>
    </div>
</div>