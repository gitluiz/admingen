(function ($) {
    'use strict';

    let app = angular.module('admGenApp', ['ngSanitize']);

    var version = [];

    app.controller('detalhesController', ['mainFac', '$scope', function (mainFac, $scope) {
            mainFac.init($scope);
            $scope.loadDetalhes = function (id) {
                mainFac.detalhe(function (cb) {
                    $scope.item = cb;
                    $scope.$applyAsync();
                    console.log('Item carregado!');
                }, $scope.table, id);
            };
        }]);

    app.controller('listaController', ['mainFac', '$scope', function (mainFac, $scope) {
            mainFac.init($scope);

            $scope.loadList = function (offset, field, order, where) {
                $scope.bloquearTela();
                $scope.limit = parseInt($scope.qtdeporpagina) || 10;
                if (where) {
                    $scope.limit = 1000;
                }
                $scope.page = offset || 0;
                $scope.offset = (offset || 0) * $scope.limit;
                $scope.field = field || $scope.field;
                $scope.order = order || $scope.order;
                mainFac.list(function (cb) {
                    $scope.list = cb.results;
                    $scope.totalRegistro = parseInt(cb.total);
                    if ($scope.totalRegistro > $scope.limit) {
                        $scope.totalPaginas = parseInt($scope.totalRegistro / $scope.limit);
                    } else {
                        $scope.totalPaginas = 0;
                    }
                    $scope.pagination = swerp.createPagination($scope.totalPaginas, $scope.page, 3);
                    $scope.paginfo = {
                        pagination: $scope.pagination,
                        page: $scope.page,
                        limit: $scope.limit,
                        offset: $scope.offset,
                        field: $scope.field,
                        order: $scope.order,
                        table: $scope.table
                    };
                    $scope.$applyAsync(function () {
                        $scope.desbloquearTela();
                    });
                    console.log('listagem carregada!');
                }, $scope.table, $scope.offset, $scope.field, $scope.order, $scope.limit, where);
            };

            $scope.$on('filtra_' + $scope.table, function (ev, args) {
                $scope.loadList($scope.offset, $scope.field, $scope.order, args);
            });

        }]);

    //FABRICA
    app.factory('mainFac', [
        function () {
            let mainFactory = {
                instance: function (table) {
                    let instance = {
                        mylocal: {
                            logradouro: "Rua 1",
                            descricao: "Mais informações entre em contato.",
                            email: 'contato@nomedosite.com.br',
                            numero: "A1",
                            bairro: 'Centro',
                            tipo_id: '1',
                            cidade_id: '1',
                            up: 'SP',
                            inclusoes: {
                                estruturas: [],
                                instalacoes: []
                            }
                        }
                    };
                    return instance[table];
                },
                service: function (table, $scope) {
                    let service = {
                        mylocal: function ($scope) {
                            $scope.cidades = [];
                            $scope.estadosBrasil = mainFactory.estadosBrasil;

                            mainFactory.listAll(function (cb) {
                                $scope.cidades = cb;
                            }, 'cidade', 'nome_cidade', 'ASC');

                            mainFactory.listAll(function (cb) {
                                $scope.tipos = cb;
                            }, 'tipo', 'nome_tipo', 'ASC');

                            mainFactory.listAll(function (cb) {
                                $scope.faixa_precos = cb;
                            }, 'faixa_preco', 'nome_preco', 'ASC');

                            mainFactory.listAll(function (cb) {
                                $scope.instalacoes = cb;
                            }, 'instalacoes', 'nome_instalacao', 'ASC');

                            mainFactory.listAll(function (cb) {
                                $scope.estruturas = cb;
                            }, 'estrutura', 'nome_estrutura', 'ASC');

                            $scope.inserirInfo = function (value, type) {
                                if (value !== null) {
                                    for (let i = 0; i < $scope.item.inclusoes[type].length; i++) {
                                        let id1 = $scope.item.inclusoes[type][i]['id_' + type];
                                        let id2 = $scope.item.inclusoes[type][i].id;
                                        if (id1 == value.id || id2 == value.id) {
                                            value = null;
                                            return;
                                        }
                                    }
                                    if (value !== null) {
                                        $scope.item.inclusoes[type].push(angular.copy(value));
                                    }
                                }
                            };
                        }
                    };
                    if (!swerp.isEmpty(service[table])) {
                        service[table]($scope);
                    }
                }
            };

            mainFactory.cache = function (name, fn, $scope, tabelaRef) {

                $scope[name] = angular.copy(swerp.getlocalStorageObj(name));

                if (!swerp.getlocalStorageObj(name)) {
                    fn(function (cb) {
                        swerp.setlocalStorageObj(name, cb);
                        $scope[name] = angular.copy(cb);
                        $scope.$apply();
                    });
                    return;
                }

                $.ajax({
                    url: url_ajax + '?' + 'action=adminGen_tversion',
                    type: 'get',
                    dataType: "json",
                    success: function (response, a) {
                        let version = response;
                        for (var i = 0; i < version.length; i++) {
                            let v = swerp.getlocalStorageObj(tabelaRef || version[i].tabela);
                            if (v && v.tabela === version[i].tabela) {
                                if (version[i].version != v.version) {
                                    fn(function (cb, prop) {
                                        swerp.setlocalStorageObj(prop, cb);
                                        $scope[prop] = angular.copy(cb);
                                        $scope.$apply();
                                    });
                                    swerp.setlocalStorageObj(version[i].tabela, version[i]);
                                    return;
                                }
                                $scope[name] = angular.copy(swerp.getlocalStorageObj(name));
                                $scope.$apply();
                                return;
                            } else {
                                swerp.setlocalStorageObj(version[i].tabela, version[i]);
                            }
                        }
                    },
                    error: function (error, a) {
                        console.log(false);
                    }
                });

            };

            mainFactory.init = function (s) {
                swerp.extend(s, swerp);
                s.pagination = [];
                s.page = 0;
                s.limit = 10;
                s.offset = 0;
                s.field = 'id';
                s.order = 'DESC';
                s.paginfo = {
                    pagination: s.pagination,
                    page: s.page,
                    limit: s.limit,
                    offset: s.offset,
                    field: s.field,
                    order: s.order
                };
                s.bloquearTela = function () {
                    /*
                     $.blockUI({
                     message: 'Carregando...',
                     css: {
                     border: 'none',
                     padding: '10px',
                     backgroundColor: '#000',
                     fontSize: '25px',
                     color: '#FFF',
                     width: '100%',
                     left: 0
                     },
                     overlayCSS: {
                     backgroundColor: '#000',
                     opacity: 0.8,
                     cursor: 'wait'
                     }
                     });
                     */
                };
                s.desbloquearTela = function (t) {
                    setTimeout($.unblockUI, t || 100);
                };
            };

            mainFactory.list = function (fn, table, offset, field, order, limit, where) {
                let data = {
                    action: 'adminGen_getList',
                    table: table,
                    offset: offset || 0,
                    limit: limit || 10,
                    field: field || 'id',
                    order: order || 'DESC',
                    where: where || null
                };
                mainFactory.http('POST', data, null, fn);
            };

            mainFactory.http = function (type, data, params, fn) {
                $.ajax({
                    url: url_ajax + '?' + params,
                    type: type,
                    dataType: "json",
                    data: data,
                    success: function (response, a) {
                        fn(response);
                    },
                    error: function (error, a) {
                        fn(false);
                    }
                });
            };

            mainFactory.detalhe = function (fn, table, id) {
                let data = {
                    action: 'adminGen_getId',
                    table: table,
                    id: id
                };
                $.ajax({
                    url: url_ajax,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (response, a) {
                        fn(response);
                    },
                    error: function (error, a) {
                        fn(false);
                    }
                });
            };

            mainFactory.listAll = function (fn, table, field, order) {
                let data = {
                    action: 'adminGen_getListAll',
                    field: field || 'id',
                    order: order || 'DESC'
                };
                let params = "action=" + data.action + "&table=" + table + "&field=" + data.field + "&order=" + data.order;
                mainFactory.http('GET', data, params, fn);
            };

            mainFactory.update = function (table, item, fn) {
                let data = {
                    table: table,
                    action: 'adminGen_update',
                    data: item
                };
                $.ajax({
                    url: url_ajax,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (response, a) {
                        if (response || response == 0) {
                            fn(response);
                            alert('Registro atualizado SUCESSO!');
                        }
                    },
                    error: function (error, a) {
                        console.log(error);
                        console.log(a);
                        fn(false);
                        alert('FALHA NA CONEXÃO!');
                    }
                });
            };

            mainFactory.insert = function (table, item, fn) {
                let data = {
                    table: table,
                    action: 'adminGen_insert',
                    data: item
                };
                $.ajax({
                    url: url_ajax,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (response, a) {
                        if (a == 'success') {
                            fn(response);
                            alert('Inclusão feita com SUCESSO!');
                        }
                    },
                    error: function (error, a) {
                        console.log(error);
                        console.log(a);
                        alert('FALHA NA CONEXÃO!');
                    }
                });
            };

            mainFactory.remove = function (table, item, fn) {
                let data = {
                    table: table,
                    action: 'adminGen_delete',
                    data: item
                };
                $.ajax({
                    url: url_ajax,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (response, a) {
                        console.log(response);
                        if (response || response == 0) {
                            fn(response);
                            alert('SUCESSO!');
                        }
                    },
                    error: function (error, a) {
                        console.log(error);
                        console.log(a);
                        fn(false);
                        alert('FALHA NA CONEXÃO!');
                    }
                });
            };

            mainFactory.deleteFile = function (table, id, file, fn) {
                let data = {
                    table: table,
                    action: 'adminGen_deleteFile',
                    id: id,
                    file: file
                };
                $.ajax({
                    url: url_ajax,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (response, a) {
                        console.log(response);
                        if (response || response == 0) {
                            fn(response);
                            alert('Removido com Sucesso!');
                        }
                    },
                    error: function (error, a) {
                        console.log(error);
                        console.log(a);
                        fn(false);
                        alert('FALHA NA CONEXÃO!');
                    }
                });
            };

            mainFactory.uploadInit = function (table, item, config, fileComplete, allComplete) {
                let defaultConfig = {
                    'uploadScript': url_ajax + '?upload=1',
                    'buttonClass': 'btn btn-success btn-x',
                    'buttonText': 'ENVIAR ARQUIVO',
                    'fileSizeLimit': 65536,
                    'simUploadLimit': 10,
                    'removeCompleted': true,
                    'fileType': ['image/x-png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/png'],
                    'fileObjName': 'files',
                    'queueID': 'some-queue-admingen',
                    'formData': {
                        'table': table,
                        'id': item.id,
                        'action': 'adminGen_upload',
                        'timestamp': swerp.date.stringToDateTime(new Date()),
                        'token': swerp.generateIdUnique('6', 'abcdef1234567890')
                    },
                    'onUploadComplete': function (file, data) {
                        fileComplete(file, JSON.parse(data));
                    },
                    'onQueueComplete': function (uploads) {
                        allComplete(uploads);
                    }
                };
                for (let p in config) {
                    defaultConfig[p] = config[p];
                }
                $('#file_upload').uploadifive(defaultConfig);
            };

            mainFactory.loadTemplate = function (table, path, fn) {
                let tpl = table ? table + '-' + path : path;
                $.ajax({
                    url: path_plugin + 'templates/' + tpl + '.html',
                    type: 'GET',
                    success: function (response, a) {
                        fn(response);
                    },
                    error: function (error, a) {
                        fn(false);
                    }
                });
            };
            mainFactory.fontAwersome = [{"name": "Glass", "id": "glass", "unicode": "f000", "cat": "Web Application Icons"}, {"name": "Music", "id": "music", "unicode": "f001", "cat": "Web Application Icons"}, {"name": "Search", "id": "search", "unicode": "f002", "cat": "Web Application Icons"}, {"name": "Envelope Outlined", "id": "envelope-o", "unicode": "f003", "cat": "Web Application Icons"}, {"name": "Heart", "id": "heart", "unicode": "f004", "cat": "Web Application Icons"}, {"name": "Star", "id": "star", "unicode": "f005", "cat": "Web Application Icons"}, {"name": "Star Outlined", "id": "star-o", "unicode": "f006", "cat": "Web Application Icons"}, {"name": "User", "id": "user", "unicode": "f007", "cat": "Web Application Icons"}, {"name": "Film", "id": "film", "unicode": "f008", "cat": "Web Application Icons"}, {"name": "th-large", "id": "th-large", "unicode": "f009", "cat": "Text Editor Icons"}, {"name": "th", "id": "th", "unicode": "f00a", "cat": "Text Editor Icons"}, {"name": "th-list", "id": "th-list", "unicode": "f00b", "cat": "Text Editor Icons"}, {"name": "Check", "id": "check", "unicode": "f00c", "cat": "Web Application Icons"}, {"name": "Times", "id": "times", "unicode": "f00d", "cat": "Web Application Icons"}, {"name": "Search Plus", "id": "search-plus", "unicode": "f00e", "cat": "Web Application Icons"}, {"name": "Search Minus", "id": "search-minus", "unicode": "f010", "cat": "Web Application Icons"}, {"name": "Power Off", "id": "power-off", "unicode": "f011", "cat": "Web Application Icons"}, {"name": "signal", "id": "signal", "unicode": "f012", "cat": "Web Application Icons"}, {"name": "cog", "id": "cog", "unicode": "f013", "cat": "Web Application Icons"}, {"name": "Trash Outlined", "id": "trash-o", "unicode": "f014", "cat": "Web Application Icons"}, {"name": "home", "id": "home", "unicode": "f015", "cat": "Web Application Icons"}, {"name": "File Outlined", "id": "file-o", "unicode": "f016", "cat": "Text Editor Icons"}, {"name": "Clock Outlined", "id": "clock-o", "unicode": "f017", "cat": "Web Application Icons"}, {"name": "road", "id": "road", "unicode": "f018", "cat": "Web Application Icons"}, {"name": "Download", "id": "download", "unicode": "f019", "cat": "Web Application Icons"}, {"name": "Arrow Circle Outlined Down", "id": "arrow-circle-o-down", "unicode": "f01a", "cat": "Directional Icons"}, {"name": "Arrow Circle Outlined Up", "id": "arrow-circle-o-up", "unicode": "f01b", "cat": "Directional Icons"}, {"name": "inbox", "id": "inbox", "unicode": "f01c", "cat": "Web Application Icons"}, {"name": "Play Circle Outlined", "id": "play-circle-o", "unicode": "f01d", "cat": "Video Player Icons"}, {"name": "Repeat", "id": "repeat", "unicode": "f01e", "cat": "Text Editor Icons"}, {"name": "refresh", "id": "refresh", "unicode": "f021", "cat": "Web Application Icons"}, {"name": "list-alt", "id": "list-alt", "unicode": "f022", "cat": "Text Editor Icons"}, {"name": "lock", "id": "lock", "unicode": "f023", "cat": "Web Application Icons"}, {"name": "flag", "id": "flag", "unicode": "f024", "cat": "Web Application Icons"}, {"name": "headphones", "id": "headphones", "unicode": "f025", "cat": "Web Application Icons"}, {"name": "volume-off", "id": "volume-off", "unicode": "f026", "cat": "Web Application Icons"}, {"name": "volume-down", "id": "volume-down", "unicode": "f027", "cat": "Web Application Icons"}, {"name": "volume-up", "id": "volume-up", "unicode": "f028", "cat": "Web Application Icons"}, {"name": "qrcode", "id": "qrcode", "unicode": "f029", "cat": "Web Application Icons"}, {"name": "barcode", "id": "barcode", "unicode": "f02a", "cat": "Web Application Icons"}, {"name": "tag", "id": "tag", "unicode": "f02b", "cat": "Web Application Icons"}, {"name": "tags", "id": "tags", "unicode": "f02c", "cat": "Web Application Icons"}, {"name": "book", "id": "book", "unicode": "f02d", "cat": "Web Application Icons"}, {"name": "bookmark", "id": "bookmark", "unicode": "f02e", "cat": "Web Application Icons"}, {"name": "print", "id": "print", "unicode": "f02f", "cat": "Web Application Icons"}, {"name": "camera", "id": "camera", "unicode": "f030", "cat": "Web Application Icons"}, {"name": "font", "id": "font", "unicode": "f031", "cat": "Text Editor Icons"}, {"name": "bold", "id": "bold", "unicode": "f032", "cat": "Text Editor Icons"}, {"name": "italic", "id": "italic", "unicode": "f033", "cat": "Text Editor Icons"}, {"name": "text-height", "id": "text-height", "unicode": "f034", "cat": "Text Editor Icons"}, {"name": "text-width", "id": "text-width", "unicode": "f035", "cat": "Text Editor Icons"}, {"name": "align-left", "id": "align-left", "unicode": "f036", "cat": "Text Editor Icons"}, {"name": "align-center", "id": "align-center", "unicode": "f037", "cat": "Text Editor Icons"}, {"name": "align-right", "id": "align-right", "unicode": "f038", "cat": "Text Editor Icons"}, {"name": "align-justify", "id": "align-justify", "unicode": "f039", "cat": "Text Editor Icons"}, {"name": "list", "id": "list", "unicode": "f03a", "cat": "Text Editor Icons"}, {"name": "Outdent", "id": "outdent", "unicode": "f03b", "cat": "Text Editor Icons"}, {"name": "Indent", "id": "indent", "unicode": "f03c", "cat": "Text Editor Icons"}, {"name": "Video Camera", "id": "video-camera", "unicode": "f03d", "cat": "Web Application Icons"}, {"name": "Picture Outlined", "id": "picture-o", "unicode": "f03e", "cat": "Web Application Icons"}, {"name": "pencil", "id": "pencil", "unicode": "f040", "cat": "Web Application Icons"}, {"name": "map-marker", "id": "map-marker", "unicode": "f041", "cat": "Web Application Icons"}, {"name": "adjust", "id": "adjust", "unicode": "f042", "cat": "Web Application Icons"}, {"name": "tint", "id": "tint", "unicode": "f043", "cat": "Web Application Icons"}, {"name": "Pencil Square Outlined", "id": "pencil-square-o", "unicode": "f044", "cat": "Web Application Icons"}, {"name": "Share Square Outlined", "id": "share-square-o", "unicode": "f045", "cat": "Web Application Icons"}, {"name": "Check Square Outlined", "id": "check-square-o", "unicode": "f046", "cat": "Web Application Icons"}, {"name": "Arrows", "id": "arrows", "unicode": "f047", "cat": "Web Application Icons"}, {"name": "step-backward", "id": "step-backward", "unicode": "f048", "cat": "Video Player Icons"}, {"name": "fast-backward", "id": "fast-backward", "unicode": "f049", "cat": "Video Player Icons"}, {"name": "backward", "id": "backward", "unicode": "f04a", "cat": "Video Player Icons"}, {"name": "play", "id": "play", "unicode": "f04b", "cat": "Video Player Icons"}, {"name": "pause", "id": "pause", "unicode": "f04c", "cat": "Video Player Icons"}, {"name": "stop", "id": "stop", "unicode": "f04d", "cat": "Video Player Icons"}, {"name": "forward", "id": "forward", "unicode": "f04e", "cat": "Video Player Icons"}, {"name": "fast-forward", "id": "fast-forward", "unicode": "f050", "cat": "Video Player Icons"}, {"name": "step-forward", "id": "step-forward", "unicode": "f051", "cat": "Video Player Icons"}, {"name": "eject", "id": "eject", "unicode": "f052", "cat": "Video Player Icons"}, {"name": "chevron-left", "id": "chevron-left", "unicode": "f053", "cat": "Directional Icons"}, {"name": "chevron-right", "id": "chevron-right", "unicode": "f054", "cat": "Directional Icons"}, {"name": "Plus Circle", "id": "plus-circle", "unicode": "f055", "cat": "Web Application Icons"}, {"name": "Minus Circle", "id": "minus-circle", "unicode": "f056", "cat": "Web Application Icons"}, {"name": "Times Circle", "id": "times-circle", "unicode": "f057", "cat": "Web Application Icons"}, {"name": "Check Circle", "id": "check-circle", "unicode": "f058", "cat": "Web Application Icons"}, {"name": "Question Circle", "id": "question-circle", "unicode": "f059", "cat": "Web Application Icons"}, {"name": "Info Circle", "id": "info-circle", "unicode": "f05a", "cat": "Web Application Icons"}, {"name": "Crosshairs", "id": "crosshairs", "unicode": "f05b", "cat": "Web Application Icons"}, {"name": "Times Circle Outlined", "id": "times-circle-o", "unicode": "f05c", "cat": "Web Application Icons"}, {"name": "Check Circle Outlined", "id": "check-circle-o", "unicode": "f05d", "cat": "Web Application Icons"}, {"name": "ban", "id": "ban", "unicode": "f05e", "cat": "Web Application Icons"}, {"name": "arrow-left", "id": "arrow-left", "unicode": "f060", "cat": "Directional Icons"}, {"name": "arrow-right", "id": "arrow-right", "unicode": "f061", "cat": "Directional Icons"}, {"name": "arrow-up", "id": "arrow-up", "unicode": "f062", "cat": "Directional Icons"}, {"name": "arrow-down", "id": "arrow-down", "unicode": "f063", "cat": "Directional Icons"}, {"name": "Share", "id": "share", "unicode": "f064", "cat": "Web Application Icons"}, {"name": "Expand", "id": "expand", "unicode": "f065", "cat": "Video Player Icons"}, {"name": "Compress", "id": "compress", "unicode": "f066", "cat": "Video Player Icons"}, {"name": "plus", "id": "plus", "unicode": "f067", "cat": "Web Application Icons"}, {"name": "minus", "id": "minus", "unicode": "f068", "cat": "Web Application Icons"}, {"name": "asterisk", "id": "asterisk", "unicode": "f069", "cat": "Web Application Icons"}, {"name": "Exclamation Circle", "id": "exclamation-circle", "unicode": "f06a", "cat": "Web Application Icons"}, {"name": "gift", "id": "gift", "unicode": "f06b", "cat": "Web Application Icons"}, {"name": "leaf", "id": "leaf", "unicode": "f06c", "cat": "Web Application Icons"}, {"name": "fire", "id": "fire", "unicode": "f06d", "cat": "Web Application Icons"}, {"name": "Eye", "id": "eye", "unicode": "f06e", "cat": "Web Application Icons"}, {"name": "Eye Slash", "id": "eye-slash", "unicode": "f070", "cat": "Web Application Icons"}, {"name": "Exclamation Triangle", "id": "exclamation-triangle", "unicode": "f071", "cat": "Web Application Icons"}, {"name": "plane", "id": "plane", "unicode": "f072", "cat": "Web Application Icons"}, {"name": "calendar", "id": "calendar", "unicode": "f073", "cat": "Web Application Icons"}, {"name": "random", "id": "random", "unicode": "f074", "cat": "Web Application Icons"}, {"name": "comment", "id": "comment", "unicode": "f075", "cat": "Web Application Icons"}, {"name": "magnet", "id": "magnet", "unicode": "f076", "cat": "Web Application Icons"}, {"name": "chevron-up", "id": "chevron-up", "unicode": "f077", "cat": "Directional Icons"}, {"name": "chevron-down", "id": "chevron-down", "unicode": "f078", "cat": "Directional Icons"}, {"name": "retweet", "id": "retweet", "unicode": "f079", "cat": "Web Application Icons"}, {"name": "shopping-cart", "id": "shopping-cart", "unicode": "f07a", "cat": "Web Application Icons"}, {"name": "Folder", "id": "folder", "unicode": "f07b", "cat": "Web Application Icons"}, {"name": "Folder Open", "id": "folder-open", "unicode": "f07c", "cat": "Web Application Icons"}, {"name": "Arrows Vertical", "id": "arrows-v", "unicode": "f07d", "cat": "Web Application Icons"}, {"name": "Arrows Horizontal", "id": "arrows-h", "unicode": "f07e", "cat": "Web Application Icons"}, {"name": "Bar Chart", "id": "bar-chart", "unicode": "f080", "cat": "Web Application Icons"}, {"name": "Twitter Square", "id": "twitter-square", "unicode": "f081", "cat": "Brand Icons"}, {"name": "Facebook Square", "id": "facebook-square", "unicode": "f082", "cat": "Brand Icons"}, {"name": "camera-retro", "id": "camera-retro", "unicode": "f083", "cat": "Web Application Icons"}, {"name": "key", "id": "key", "unicode": "f084", "cat": "Web Application Icons"}, {"name": "cogs", "id": "cogs", "unicode": "f085", "cat": "Web Application Icons"}, {"name": "comments", "id": "comments", "unicode": "f086", "cat": "Web Application Icons"}, {"name": "Thumbs Up Outlined", "id": "thumbs-o-up", "unicode": "f087", "cat": "Web Application Icons"}, {"name": "Thumbs Down Outlined", "id": "thumbs-o-down", "unicode": "f088", "cat": "Web Application Icons"}, {"name": "star-half", "id": "star-half", "unicode": "f089", "cat": "Web Application Icons"}, {"name": "Heart Outlined", "id": "heart-o", "unicode": "f08a", "cat": "Web Application Icons"}, {"name": "Sign Out", "id": "sign-out", "unicode": "f08b", "cat": "Web Application Icons"}, {"name": "LinkedIn Square", "id": "linkedin-square", "unicode": "f08c", "cat": "Brand Icons"}, {"name": "Thumb Tack", "id": "thumb-tack", "unicode": "f08d", "cat": "Web Application Icons"}, {"name": "External Link", "id": "external-link", "unicode": "f08e", "cat": "Web Application Icons"}, {"name": "Sign In", "id": "sign-in", "unicode": "f090", "cat": "Web Application Icons"}, {"name": "trophy", "id": "trophy", "unicode": "f091", "cat": "Web Application Icons"}, {"name": "GitHub Square", "id": "github-square", "unicode": "f092", "cat": "Brand Icons"}, {"name": "Upload", "id": "upload", "unicode": "f093", "cat": "Web Application Icons"}, {"name": "Lemon Outlined", "id": "lemon-o", "unicode": "f094", "cat": "Web Application Icons"}, {"name": "Phone", "id": "phone", "unicode": "f095", "cat": "Web Application Icons"}, {"name": "Square Outlined", "id": "square-o", "unicode": "f096", "cat": "Web Application Icons"}, {"name": "Bookmark Outlined", "id": "bookmark-o", "unicode": "f097", "cat": "Web Application Icons"}, {"name": "Phone Square", "id": "phone-square", "unicode": "f098", "cat": "Web Application Icons"}, {"name": "Twitter", "id": "twitter", "unicode": "f099", "cat": "Brand Icons"}, {"name": "Facebook", "id": "facebook", "unicode": "f09a", "cat": "Brand Icons"}, {"name": "GitHub", "id": "github", "unicode": "f09b", "cat": "Brand Icons"}, {"name": "unlock", "id": "unlock", "unicode": "f09c", "cat": "Web Application Icons"}, {"name": "credit-card", "id": "credit-card", "unicode": "f09d", "cat": "Web Application Icons"}, {"name": "rss", "id": "rss", "unicode": "f09e", "cat": "Web Application Icons"}, {"name": "HDD", "id": "hdd-o", "unicode": "f0a0", "cat": "Web Application Icons"}, {"name": "bullhorn", "id": "bullhorn", "unicode": "f0a1", "cat": "Web Application Icons"}, {"name": "bell", "id": "bell", "unicode": "f0f3", "cat": "Web Application Icons"}, {"name": "certificate", "id": "certificate", "unicode": "f0a3", "cat": "Web Application Icons"}, {"name": "Hand Outlined Right", "id": "hand-o-right", "unicode": "f0a4", "cat": "Directional Icons"}, {"name": "Hand Outlined Left", "id": "hand-o-left", "unicode": "f0a5", "cat": "Directional Icons"}, {"name": "Hand Outlined Up", "id": "hand-o-up", "unicode": "f0a6", "cat": "Directional Icons"}, {"name": "Hand Outlined Down", "id": "hand-o-down", "unicode": "f0a7", "cat": "Directional Icons"}, {"name": "Arrow Circle Left", "id": "arrow-circle-left", "unicode": "f0a8", "cat": "Directional Icons"}, {"name": "Arrow Circle Right", "id": "arrow-circle-right", "unicode": "f0a9", "cat": "Directional Icons"}, {"name": "Arrow Circle Up", "id": "arrow-circle-up", "unicode": "f0aa", "cat": "Directional Icons"}, {"name": "Arrow Circle Down", "id": "arrow-circle-down", "unicode": "f0ab", "cat": "Directional Icons"}, {"name": "Globe", "id": "globe", "unicode": "f0ac", "cat": "Web Application Icons"}, {"name": "Wrench", "id": "wrench", "unicode": "f0ad", "cat": "Web Application Icons"}, {"name": "Tasks", "id": "tasks", "unicode": "f0ae", "cat": "Web Application Icons"}, {"name": "Filter", "id": "filter", "unicode": "f0b0", "cat": "Web Application Icons"}, {"name": "Briefcase", "id": "briefcase", "unicode": "f0b1", "cat": "Web Application Icons"}, {"name": "Arrows Alt", "id": "arrows-alt", "unicode": "f0b2", "cat": "Video Player Icons"}, {"name": "Users", "id": "users", "unicode": "f0c0", "cat": "Web Application Icons"}, {"name": "Link", "id": "link", "unicode": "f0c1", "cat": "Text Editor Icons"}, {"name": "Cloud", "id": "cloud", "unicode": "f0c2", "cat": "Web Application Icons"}, {"name": "Flask", "id": "flask", "unicode": "f0c3", "cat": "Web Application Icons"}, {"name": "Scissors", "id": "scissors", "unicode": "f0c4", "cat": "Text Editor Icons"}, {"name": "Files Outlined", "id": "files-o", "unicode": "f0c5", "cat": "Text Editor Icons"}, {"name": "Paperclip", "id": "paperclip", "unicode": "f0c6", "cat": "Text Editor Icons"}, {"name": "Floppy Outlined", "id": "floppy-o", "unicode": "f0c7", "cat": "Text Editor Icons"}, {"name": "Square", "id": "square", "unicode": "f0c8", "cat": "Web Application Icons"}, {"name": "Bars", "id": "bars", "unicode": "f0c9", "cat": "Web Application Icons"}, {"name": "list-ul", "id": "list-ul", "unicode": "f0ca", "cat": "Text Editor Icons"}, {"name": "list-ol", "id": "list-ol", "unicode": "f0cb", "cat": "Text Editor Icons"}, {"name": "Strikethrough", "id": "strikethrough", "unicode": "f0cc", "cat": "Text Editor Icons"}, {"name": "Underline", "id": "underline", "unicode": "f0cd", "cat": "Text Editor Icons"}, {"name": "table", "id": "table", "unicode": "f0ce", "cat": "Text Editor Icons"}, {"name": "magic", "id": "magic", "unicode": "f0d0", "cat": "Web Application Icons"}, {"name": "truck", "id": "truck", "unicode": "f0d1", "cat": "Web Application Icons"}, {"name": "Pinterest", "id": "pinterest", "unicode": "f0d2", "cat": "Brand Icons"}, {"name": "Pinterest Square", "id": "pinterest-square", "unicode": "f0d3", "cat": "Brand Icons"}, {"name": "Google Plus Square", "id": "google-plus-square", "unicode": "f0d4", "cat": "Brand Icons"}, {"name": "Google Plus", "id": "google-plus", "unicode": "f0d5", "cat": "Brand Icons"}, {"name": "Money", "id": "money", "unicode": "f0d6", "cat": "Web Application Icons"}, {"name": "Caret Down", "id": "caret-down", "unicode": "f0d7", "cat": "Directional Icons"}, {"name": "Caret Up", "id": "caret-up", "unicode": "f0d8", "cat": "Directional Icons"}, {"name": "Caret Left", "id": "caret-left", "unicode": "f0d9", "cat": "Directional Icons"}, {"name": "Caret Right", "id": "caret-right", "unicode": "f0da", "cat": "Directional Icons"}, {"name": "Columns", "id": "columns", "unicode": "f0db", "cat": "Text Editor Icons"}, {"name": "Sort", "id": "sort", "unicode": "f0dc", "cat": "Web Application Icons"}, {"name": "Sort Descending", "id": "sort-desc", "unicode": "f0dd", "cat": "Web Application Icons"}, {"name": "Sort Ascending", "id": "sort-asc", "unicode": "f0de", "cat": "Web Application Icons"}, {"name": "Envelope", "id": "envelope", "unicode": "f0e0", "cat": "Web Application Icons"}, {"name": "LinkedIn", "id": "linkedin", "unicode": "f0e1", "cat": "Brand Icons"}, {"name": "Undo", "id": "undo", "unicode": "f0e2", "cat": "Text Editor Icons"}, {"name": "Gavel", "id": "gavel", "unicode": "f0e3", "cat": "Web Application Icons"}, {"name": "Tachometer", "id": "tachometer", "unicode": "f0e4", "cat": "Web Application Icons"}, {"name": "comment-o", "id": "comment-o", "unicode": "f0e5", "cat": "Web Application Icons"}, {"name": "comments-o", "id": "comments-o", "unicode": "f0e6", "cat": "Web Application Icons"}, {"name": "Lightning Bolt", "id": "bolt", "unicode": "f0e7", "cat": "Web Application Icons"}, {"name": "Sitemap", "id": "sitemap", "unicode": "f0e8", "cat": "Web Application Icons"}, {"name": "Umbrella", "id": "umbrella", "unicode": "f0e9", "cat": "Web Application Icons"}, {"name": "Clipboard", "id": "clipboard", "unicode": "f0ea", "cat": "Text Editor Icons"}, {"name": "Lightbulb Outlined", "id": "lightbulb-o", "unicode": "f0eb", "cat": "Web Application Icons"}, {"name": "Exchange", "id": "exchange", "unicode": "f0ec", "cat": "Web Application Icons"}, {"name": "Cloud Download", "id": "cloud-download", "unicode": "f0ed", "cat": "Web Application Icons"}, {"name": "Cloud Upload", "id": "cloud-upload", "unicode": "f0ee", "cat": "Web Application Icons"}, {"name": "user-md", "id": "user-md", "unicode": "f0f0", "cat": "Medical Icons"}, {"name": "Stethoscope", "id": "stethoscope", "unicode": "f0f1", "cat": "Medical Icons"}, {"name": "Suitcase", "id": "suitcase", "unicode": "f0f2", "cat": "Web Application Icons"}, {"name": "Bell Outlined", "id": "bell-o", "unicode": "f0a2", "cat": "Web Application Icons"}, {"name": "Coffee", "id": "coffee", "unicode": "f0f4", "cat": "Web Application Icons"}, {"name": "Cutlery", "id": "cutlery", "unicode": "f0f5", "cat": "Web Application Icons"}, {"name": "File Text Outlined", "id": "file-text-o", "unicode": "f0f6", "cat": "Text Editor Icons"}, {"name": "Building Outlined", "id": "building-o", "unicode": "f0f7", "cat": "Web Application Icons"}, {"name": "hospital Outlined", "id": "hospital-o", "unicode": "f0f8", "cat": "Medical Icons"}, {"name": "ambulance", "id": "ambulance", "unicode": "f0f9", "cat": "Medical Icons"}, {"name": "medkit", "id": "medkit", "unicode": "f0fa", "cat": "Medical Icons"}, {"name": "fighter-jet", "id": "fighter-jet", "unicode": "f0fb", "cat": "Web Application Icons"}, {"name": "beer", "id": "beer", "unicode": "f0fc", "cat": "Web Application Icons"}, {"name": "H Square", "id": "h-square", "unicode": "f0fd", "cat": "Medical Icons"}, {"name": "Plus Square", "id": "plus-square", "unicode": "f0fe", "cat": "Medical Icons"}, {"name": "Angle Double Left", "id": "angle-double-left", "unicode": "f100", "cat": "Directional Icons"}, {"name": "Angle Double Right", "id": "angle-double-right", "unicode": "f101", "cat": "Directional Icons"}, {"name": "Angle Double Up", "id": "angle-double-up", "unicode": "f102", "cat": "Directional Icons"}, {"name": "Angle Double Down", "id": "angle-double-down", "unicode": "f103", "cat": "Directional Icons"}, {"name": "angle-left", "id": "angle-left", "unicode": "f104", "cat": "Directional Icons"}, {"name": "angle-right", "id": "angle-right", "unicode": "f105", "cat": "Directional Icons"}, {"name": "angle-up", "id": "angle-up", "unicode": "f106", "cat": "Directional Icons"}, {"name": "angle-down", "id": "angle-down", "unicode": "f107", "cat": "Directional Icons"}, {"name": "Desktop", "id": "desktop", "unicode": "f108", "cat": "Web Application Icons"}, {"name": "Laptop", "id": "laptop", "unicode": "f109", "cat": "Web Application Icons"}, {"name": "tablet", "id": "tablet", "unicode": "f10a", "cat": "Web Application Icons"}, {"name": "Mobile Phone", "id": "mobile", "unicode": "f10b", "cat": "Web Application Icons"}, {"name": "Circle Outlined", "id": "circle-o", "unicode": "f10c", "cat": "Web Application Icons"}, {"name": "quote-left", "id": "quote-left", "unicode": "f10d", "cat": "Web Application Icons"}, {"name": "quote-right", "id": "quote-right", "unicode": "f10e", "cat": "Web Application Icons"}, {"name": "Spinner", "id": "spinner", "unicode": "f110", "cat": "Web Application Icons"}, {"name": "Circle", "id": "circle", "unicode": "f111", "cat": "Web Application Icons"}, {"name": "Reply", "id": "reply", "unicode": "f112", "cat": "Web Application Icons"}, {"name": "GitHub Alt", "id": "github-alt", "unicode": "f113", "cat": "Brand Icons"}, {"name": "Folder Outlined", "id": "folder-o", "unicode": "f114", "cat": "Web Application Icons"}, {"name": "Folder Open Outlined", "id": "folder-open-o", "unicode": "f115", "cat": "Web Application Icons"}, {"name": "Smile Outlined", "id": "smile-o", "unicode": "f118", "cat": "Web Application Icons"}, {"name": "Frown Outlined", "id": "frown-o", "unicode": "f119", "cat": "Web Application Icons"}, {"name": "Meh Outlined", "id": "meh-o", "unicode": "f11a", "cat": "Web Application Icons"}, {"name": "Gamepad", "id": "gamepad", "unicode": "f11b", "cat": "Web Application Icons"}, {"name": "Keyboard Outlined", "id": "keyboard-o", "unicode": "f11c", "cat": "Web Application Icons"}, {"name": "Flag Outlined", "id": "flag-o", "unicode": "f11d", "cat": "Web Application Icons"}, {"name": "flag-checkered", "id": "flag-checkered", "unicode": "f11e", "cat": "Web Application Icons"}, {"name": "Terminal", "id": "terminal", "unicode": "f120", "cat": "Web Application Icons"}, {"name": "Code", "id": "code", "unicode": "f121", "cat": "Web Application Icons"}, {"name": "reply-all", "id": "reply-all", "unicode": "f122", "cat": "Web Application Icons"}, {"name": "Star Half Outlined", "id": "star-half-o", "unicode": "f123", "cat": "Web Application Icons"}, {"name": "location-arrow", "id": "location-arrow", "unicode": "f124", "cat": "Web Application Icons"}, {"name": "crop", "id": "crop", "unicode": "f125", "cat": "Web Application Icons"}, {"name": "code-fork", "id": "code-fork", "unicode": "f126", "cat": "Web Application Icons"}, {"name": "Chain Broken", "id": "chain-broken", "unicode": "f127", "cat": "Text Editor Icons"}, {"name": "Question", "id": "question", "unicode": "f128", "cat": "Web Application Icons"}, {"name": "Info", "id": "info", "unicode": "f129", "cat": "Web Application Icons"}, {"name": "exclamation", "id": "exclamation", "unicode": "f12a", "cat": "Web Application Icons"}, {"name": "superscript", "id": "superscript", "unicode": "f12b", "cat": "Text Editor Icons"}, {"name": "subscript", "id": "subscript", "unicode": "f12c", "cat": "Text Editor Icons"}, {"name": "eraser", "id": "eraser", "unicode": "f12d", "cat": "Text Editor Icons"}, {"name": "Puzzle Piece", "id": "puzzle-piece", "unicode": "f12e", "cat": "Web Application Icons"}, {"name": "microphone", "id": "microphone", "unicode": "f130", "cat": "Web Application Icons"}, {"name": "Microphone Slash", "id": "microphone-slash", "unicode": "f131", "cat": "Web Application Icons"}, {"name": "shield", "id": "shield", "unicode": "f132", "cat": "Web Application Icons"}, {"name": "calendar-o", "id": "calendar-o", "unicode": "f133", "cat": "Web Application Icons"}, {"name": "fire-extinguisher", "id": "fire-extinguisher", "unicode": "f134", "cat": "Web Application Icons"}, {"name": "rocket", "id": "rocket", "unicode": "f135", "cat": "Web Application Icons"}, {"name": "MaxCDN", "id": "maxcdn", "unicode": "f136", "cat": "Brand Icons"}, {"name": "Chevron Circle Left", "id": "chevron-circle-left", "unicode": "f137", "cat": "Directional Icons"}, {"name": "Chevron Circle Right", "id": "chevron-circle-right", "unicode": "f138", "cat": "Directional Icons"}, {"name": "Chevron Circle Up", "id": "chevron-circle-up", "unicode": "f139", "cat": "Directional Icons"}, {"name": "Chevron Circle Down", "id": "chevron-circle-down", "unicode": "f13a", "cat": "Directional Icons"}, {"name": "HTML 5 Logo", "id": "html5", "unicode": "f13b", "cat": "Brand Icons"}, {"name": "CSS 3 Logo", "id": "css3", "unicode": "f13c", "cat": "Brand Icons"}, {"name": "Anchor", "id": "anchor", "unicode": "f13d", "cat": "Web Application Icons"}, {"name": "Unlock Alt", "id": "unlock-alt", "unicode": "f13e", "cat": "Web Application Icons"}, {"name": "Bullseye", "id": "bullseye", "unicode": "f140", "cat": "Web Application Icons"}, {"name": "Ellipsis Horizontal", "id": "ellipsis-h", "unicode": "f141", "cat": "Web Application Icons"}, {"name": "Ellipsis Vertical", "id": "ellipsis-v", "unicode": "f142", "cat": "Web Application Icons"}, {"name": "RSS Square", "id": "rss-square", "unicode": "f143", "cat": "Web Application Icons"}, {"name": "Play Circle", "id": "play-circle", "unicode": "f144", "cat": "Video Player Icons"}, {"name": "Ticket", "id": "ticket", "unicode": "f145", "cat": "Web Application Icons"}, {"name": "Minus Square", "id": "minus-square", "unicode": "f146", "cat": "Web Application Icons"}, {"name": "Minus Square Outlined", "id": "minus-square-o", "unicode": "f147", "cat": "Web Application Icons"}, {"name": "Level Up", "id": "level-up", "unicode": "f148", "cat": "Web Application Icons"}, {"name": "Level Down", "id": "level-down", "unicode": "f149", "cat": "Web Application Icons"}, {"name": "Check Square", "id": "check-square", "unicode": "f14a", "cat": "Web Application Icons"}, {"name": "Pencil Square", "id": "pencil-square", "unicode": "f14b", "cat": "Web Application Icons"}, {"name": "External Link Square", "id": "external-link-square", "unicode": "f14c", "cat": "Web Application Icons"}, {"name": "Share Square", "id": "share-square", "unicode": "f14d", "cat": "Web Application Icons"}, {"name": "Compass", "id": "compass", "unicode": "f14e", "cat": "Web Application Icons"}, {"name": "Caret Square Outlined Down", "id": "caret-square-o-down", "unicode": "f150", "cat": "Web Application Icons"}, {"name": "Caret Square Outlined Up", "id": "caret-square-o-up", "unicode": "f151", "cat": "Web Application Icons"}, {"name": "Caret Square Outlined Right", "id": "caret-square-o-right", "unicode": "f152", "cat": "Web Application Icons"}, {"name": "Euro (EUR)", "id": "eur", "unicode": "f153", "cat": "Currency Icons"}, {"name": "GBP", "id": "gbp", "unicode": "f154", "cat": "Currency Icons"}, {"name": "US Dollar", "id": "usd", "unicode": "f155", "cat": "Currency Icons"}, {"name": "Indian Rupee (INR)", "id": "inr", "unicode": "f156", "cat": "Currency Icons"}, {"name": "Japanese Yen (JPY)", "id": "jpy", "unicode": "f157", "cat": "Currency Icons"}, {"name": "Russian Ruble (RUB)", "id": "rub", "unicode": "f158", "cat": "Currency Icons"}, {"name": "Korean Won (KRW)", "id": "krw", "unicode": "f159", "cat": "Currency Icons"}, {"name": "Bitcoin (BTC)", "id": "btc", "unicode": "f15a", "cat": "Currency Icons"}, {"name": "File", "id": "file", "unicode": "f15b", "cat": "Text Editor Icons"}, {"name": "File Text", "id": "file-text", "unicode": "f15c", "cat": "Text Editor Icons"}, {"name": "Sort Alpha Ascending", "id": "sort-alpha-asc", "unicode": "f15d", "cat": "Web Application Icons"}, {"name": "Sort Alpha Descending", "id": "sort-alpha-desc", "unicode": "f15e", "cat": "Web Application Icons"}, {"name": "Sort Amount Ascending", "id": "sort-amount-asc", "unicode": "f160", "cat": "Web Application Icons"}, {"name": "Sort Amount Descending", "id": "sort-amount-desc", "unicode": "f161", "cat": "Web Application Icons"}, {"name": "Sort Numeric Ascending", "id": "sort-numeric-asc", "unicode": "f162", "cat": "Web Application Icons"}, {"name": "Sort Numeric Descending", "id": "sort-numeric-desc", "unicode": "f163", "cat": "Web Application Icons"}, {"name": "thumbs-up", "id": "thumbs-up", "unicode": "f164", "cat": "Web Application Icons"}, {"name": "thumbs-down", "id": "thumbs-down", "unicode": "f165", "cat": "Web Application Icons"}, {"name": "YouTube Square", "id": "youtube-square", "unicode": "f166", "cat": "Brand Icons"}, {"name": "YouTube", "id": "youtube", "unicode": "f167", "cat": "Brand Icons"}, {"name": "Xing", "id": "xing", "unicode": "f168", "cat": "Brand Icons"}, {"name": "Xing Square", "id": "xing-square", "unicode": "f169", "cat": "Brand Icons"}, {"name": "YouTube Play", "id": "youtube-play", "unicode": "f16a", "cat": "Brand Icons"}, {"name": "Dropbox", "id": "dropbox", "unicode": "f16b", "cat": "Brand Icons"}, {"name": "Stack Overflow", "id": "stack-overflow", "unicode": "f16c", "cat": "Brand Icons"}, {"name": "Instagram", "id": "instagram", "unicode": "f16d", "cat": "Brand Icons"}, {"name": "Flickr", "id": "flickr", "unicode": "f16e", "cat": "Brand Icons"}, {"name": "App.net", "id": "adn", "unicode": "f170", "cat": "Brand Icons"}, {"name": "Bitbucket", "id": "bitbucket", "unicode": "f171", "cat": "Brand Icons"}, {"name": "Bitbucket Square", "id": "bitbucket-square", "unicode": "f172", "cat": "Brand Icons"}, {"name": "Tumblr", "id": "tumblr", "unicode": "f173", "cat": "Brand Icons"}, {"name": "Tumblr Square", "id": "tumblr-square", "unicode": "f174", "cat": "Brand Icons"}, {"name": "Long Arrow Down", "id": "long-arrow-down", "unicode": "f175", "cat": "Directional Icons"}, {"name": "Long Arrow Up", "id": "long-arrow-up", "unicode": "f176", "cat": "Directional Icons"}, {"name": "Long Arrow Left", "id": "long-arrow-left", "unicode": "f177", "cat": "Directional Icons"}, {"name": "Long Arrow Right", "id": "long-arrow-right", "unicode": "f178", "cat": "Directional Icons"}, {"name": "Apple", "id": "apple", "unicode": "f179", "cat": "Brand Icons"}, {"name": "Windows", "id": "windows", "unicode": "f17a", "cat": "Brand Icons"}, {"name": "Android", "id": "android", "unicode": "f17b", "cat": "Brand Icons"}, {"name": "Linux", "id": "linux", "unicode": "f17c", "cat": "Brand Icons"}, {"name": "Dribbble", "id": "dribbble", "unicode": "f17d", "cat": "Brand Icons"}, {"name": "Skype", "id": "skype", "unicode": "f17e", "cat": "Brand Icons"}, {"name": "Foursquare", "id": "foursquare", "unicode": "f180", "cat": "Brand Icons"}, {"name": "Trello", "id": "trello", "unicode": "f181", "cat": "Brand Icons"}, {"name": "Female", "id": "female", "unicode": "f182", "cat": "Web Application Icons"}, {"name": "Male", "id": "male", "unicode": "f183", "cat": "Web Application Icons"}, {"name": "Gratipay (Gittip)", "id": "gratipay", "unicode": "f184", "cat": "Brand Icons"}, {"name": "Sun Outlined", "id": "sun-o", "unicode": "f185", "cat": "Web Application Icons"}, {"name": "Moon Outlined", "id": "moon-o", "unicode": "f186", "cat": "Web Application Icons"}, {"name": "Archive", "id": "archive", "unicode": "f187", "cat": "Web Application Icons"}, {"name": "Bug", "id": "bug", "unicode": "f188", "cat": "Web Application Icons"}, {"name": "VK", "id": "vk", "unicode": "f189", "cat": "Brand Icons"}, {"name": "Weibo", "id": "weibo", "unicode": "f18a", "cat": "Brand Icons"}, {"name": "Renren", "id": "renren", "unicode": "f18b", "cat": "Brand Icons"}, {"name": "Pagelines", "id": "pagelines", "unicode": "f18c", "cat": "Brand Icons"}, {"name": "Stack Exchange", "id": "stack-exchange", "unicode": "f18d", "cat": "Brand Icons"}, {"name": "Arrow Circle Outlined Right", "id": "arrow-circle-o-right", "unicode": "f18e", "cat": "Directional Icons"}, {"name": "Arrow Circle Outlined Left", "id": "arrow-circle-o-left", "unicode": "f190", "cat": "Directional Icons"}, {"name": "Caret Square Outlined Left", "id": "caret-square-o-left", "unicode": "f191", "cat": "Web Application Icons"}, {"name": "Dot Circle Outlined", "id": "dot-circle-o", "unicode": "f192", "cat": "Web Application Icons"}, {"name": "Wheelchair", "id": "wheelchair", "unicode": "f193", "cat": "Web Application Icons"}, {"name": "Vimeo Square", "id": "vimeo-square", "unicode": "f194", "cat": "Brand Icons"}, {"name": "Turkish Lira (TRY)", "id": "try", "unicode": "f195", "cat": "Currency Icons"}, {"name": "Plus Square Outlined", "id": "plus-square-o", "unicode": "f196", "cat": "Web Application Icons"}, {"name": "Space Shuttle", "id": "space-shuttle", "unicode": "f197", "cat": "Web Application Icons"}, {"name": "Slack Logo", "id": "slack", "unicode": "f198", "cat": "Brand Icons"}, {"name": "Envelope Square", "id": "envelope-square", "unicode": "f199", "cat": "Web Application Icons"}, {"name": "WordPress Logo", "id": "wordpress", "unicode": "f19a", "cat": "Brand Icons"}, {"name": "OpenID", "id": "openid", "unicode": "f19b", "cat": "Brand Icons"}, {"name": "University", "id": "university", "unicode": "f19c", "cat": "Web Application Icons"}, {"name": "Graduation Cap", "id": "graduation-cap", "unicode": "f19d", "cat": "Web Application Icons"}, {"name": "Yahoo Logo", "id": "yahoo", "unicode": "f19e", "cat": "Brand Icons"}, {"name": "Google Logo", "id": "google", "unicode": "f1a0", "cat": "Brand Icons"}, {"name": "reddit Logo", "id": "reddit", "unicode": "f1a1", "cat": "Brand Icons"}, {"name": "reddit Square", "id": "reddit-square", "unicode": "f1a2", "cat": "Brand Icons"}, {"name": "StumbleUpon Circle", "id": "stumbleupon-circle", "unicode": "f1a3", "cat": "Brand Icons"}, {"name": "StumbleUpon Logo", "id": "stumbleupon", "unicode": "f1a4", "cat": "Brand Icons"}, {"name": "Delicious Logo", "id": "delicious", "unicode": "f1a5", "cat": "Brand Icons"}, {"name": "Digg Logo", "id": "digg", "unicode": "f1a6", "cat": "Brand Icons"}, {"name": "Pied Piper Logo", "id": "pied-piper", "unicode": "f1a7", "cat": "Brand Icons"}, {"name": "Pied Piper Alternate Logo", "id": "pied-piper-alt", "unicode": "f1a8", "cat": "Brand Icons"}, {"name": "Drupal Logo", "id": "drupal", "unicode": "f1a9", "cat": "Brand Icons"}, {"name": "Joomla Logo", "id": "joomla", "unicode": "f1aa", "cat": "Brand Icons"}, {"name": "Language", "id": "language", "unicode": "f1ab", "cat": "Web Application Icons"}, {"name": "Fax", "id": "fax", "unicode": "f1ac", "cat": "Web Application Icons"}, {"name": "Building", "id": "building", "unicode": "f1ad", "cat": "Web Application Icons"}, {"name": "Child", "id": "child", "unicode": "f1ae", "cat": "Web Application Icons"}, {"name": "Paw", "id": "paw", "unicode": "f1b0", "cat": "Web Application Icons"}, {"name": "spoon", "id": "spoon", "unicode": "f1b1", "cat": "Web Application Icons"}, {"name": "Cube", "id": "cube", "unicode": "f1b2", "cat": "Web Application Icons"}, {"name": "Cubes", "id": "cubes", "unicode": "f1b3", "cat": "Web Application Icons"}, {"name": "Behance", "id": "behance", "unicode": "f1b4", "cat": "Brand Icons"}, {"name": "Behance Square", "id": "behance-square", "unicode": "f1b5", "cat": "Brand Icons"}, {"name": "Steam", "id": "steam", "unicode": "f1b6", "cat": "Brand Icons"}, {"name": "Steam Square", "id": "steam-square", "unicode": "f1b7", "cat": "Brand Icons"}, {"name": "Recycle", "id": "recycle", "unicode": "f1b8", "cat": "Web Application Icons"}, {"name": "Car", "id": "car", "unicode": "f1b9", "cat": "Web Application Icons"}, {"name": "Taxi", "id": "taxi", "unicode": "f1ba", "cat": "Web Application Icons"}, {"name": "Tree", "id": "tree", "unicode": "f1bb", "cat": "Web Application Icons"}, {"name": "Spotify", "id": "spotify", "unicode": "f1bc", "cat": "Brand Icons"}, {"name": "deviantART", "id": "deviantart", "unicode": "f1bd", "cat": "Brand Icons"}, {"name": "SoundCloud", "id": "soundcloud", "unicode": "f1be", "cat": "Brand Icons"}, {"name": "Database", "id": "database", "unicode": "f1c0", "cat": "Web Application Icons"}, {"name": "PDF File Outlined", "id": "file-pdf-o", "unicode": "f1c1", "cat": "Web Application Icons"}, {"name": "Word File Outlined", "id": "file-word-o", "unicode": "f1c2", "cat": "Web Application Icons"}, {"name": "Excel File Outlined", "id": "file-excel-o", "unicode": "f1c3", "cat": "Web Application Icons"}, {"name": "Powerpoint File Outlined", "id": "file-powerpoint-o", "unicode": "f1c4", "cat": "Web Application Icons"}, {"name": "Image File Outlined", "id": "file-image-o", "unicode": "f1c5", "cat": "Web Application Icons"}, {"name": "Archive File Outlined", "id": "file-archive-o", "unicode": "f1c6", "cat": "Web Application Icons"}, {"name": "Audio File Outlined", "id": "file-audio-o", "unicode": "f1c7", "cat": "Web Application Icons"}, {"name": "Video File Outlined", "id": "file-video-o", "unicode": "f1c8", "cat": "Web Application Icons"}, {"name": "Code File Outlined", "id": "file-code-o", "unicode": "f1c9", "cat": "Web Application Icons"}, {"name": "Vine", "id": "vine", "unicode": "f1ca", "cat": "Brand Icons"}, {"name": "Codepen", "id": "codepen", "unicode": "f1cb", "cat": "Brand Icons"}, {"name": "jsFiddle", "id": "jsfiddle", "unicode": "f1cc", "cat": "Brand Icons"}, {"name": "Life Ring", "id": "life-ring", "unicode": "f1cd", "cat": "Web Application Icons"}, {"name": "Circle Outlined Notched", "id": "circle-o-notch", "unicode": "f1ce", "cat": "Web Application Icons"}, {"name": "Rebel Alliance", "id": "rebel", "unicode": "f1d0", "cat": "Brand Icons"}, {"name": "Galactic Empire", "id": "empire", "unicode": "f1d1", "cat": "Brand Icons"}, {"name": "Git Square", "id": "git-square", "unicode": "f1d2", "cat": "Brand Icons"}, {"name": "Git", "id": "git", "unicode": "f1d3", "cat": "Brand Icons"}, {"name": "Hacker News", "id": "hacker-news", "unicode": "f1d4", "cat": "Brand Icons"}, {"name": "Tencent Weibo", "id": "tencent-weibo", "unicode": "f1d5", "cat": "Brand Icons"}, {"name": "QQ", "id": "qq", "unicode": "f1d6", "cat": "Brand Icons"}, {"name": "Weixin (WeChat)", "id": "weixin", "unicode": "f1d7", "cat": "Brand Icons"}, {"name": "Paper Plane", "id": "paper-plane", "unicode": "f1d8", "cat": "Web Application Icons"}, {"name": "Paper Plane Outlined", "id": "paper-plane-o", "unicode": "f1d9", "cat": "Web Application Icons"}, {"name": "History", "id": "history", "unicode": "f1da", "cat": "Web Application Icons"}, {"name": "Circle Outlined Thin", "id": "circle-thin", "unicode": "f1db", "cat": "Web Application Icons"}, {"name": "header", "id": "header", "unicode": "f1dc", "cat": "Text Editor Icons"}, {"name": "paragraph", "id": "paragraph", "unicode": "f1dd", "cat": "Text Editor Icons"}, {"name": "Sliders", "id": "sliders", "unicode": "f1de", "cat": "Web Application Icons"}, {"name": "Share Alt", "id": "share-alt", "unicode": "f1e0", "cat": "Web Application Icons"}, {"name": "Share Alt Square", "id": "share-alt-square", "unicode": "f1e1", "cat": "Web Application Icons"}, {"name": "Bomb", "id": "bomb", "unicode": "f1e2", "cat": "Web Application Icons"}, {"name": "Futbol Outlined", "id": "futbol-o", "unicode": "f1e3", "cat": "Web Application Icons"}, {"name": "TTY", "id": "tty", "unicode": "f1e4", "cat": "Web Application Icons"}, {"name": "Binoculars", "id": "binoculars", "unicode": "f1e5", "cat": "Web Application Icons"}, {"name": "Plug", "id": "plug", "unicode": "f1e6", "cat": "Web Application Icons"}, {"name": "Slideshare", "id": "slideshare", "unicode": "f1e7", "cat": "Brand Icons"}, {"name": "Twitch", "id": "twitch", "unicode": "f1e8", "cat": "Brand Icons"}, {"name": "Yelp", "id": "yelp", "unicode": "f1e9", "cat": "Brand Icons"}, {"name": "Newspaper Outlined", "id": "newspaper-o", "unicode": "f1ea", "cat": "Web Application Icons"}, {"name": "WiFi", "id": "wifi", "unicode": "f1eb", "cat": "Web Application Icons"}, {"name": "Calculator", "id": "calculator", "unicode": "f1ec", "cat": "Web Application Icons"}, {"name": "Paypal", "id": "paypal", "unicode": "f1ed", "cat": "Brand Icons"}, {"name": "Google Wallet", "id": "google-wallet", "unicode": "f1ee", "cat": "Brand Icons"}, {"name": "Visa Credit Card", "id": "cc-visa", "unicode": "f1f0", "cat": "Brand Icons"}, {"name": "MasterCard Credit Card", "id": "cc-mastercard", "unicode": "f1f1", "cat": "Brand Icons"}, {"name": "Discover Credit Card", "id": "cc-discover", "unicode": "f1f2", "cat": "Brand Icons"}, {"name": "American Express Credit Card", "id": "cc-amex", "unicode": "f1f3", "cat": "Brand Icons"}, {"name": "Paypal Credit Card", "id": "cc-paypal", "unicode": "f1f4", "cat": "Brand Icons"}, {"name": "Stripe Credit Card", "id": "cc-stripe", "unicode": "f1f5", "cat": "Brand Icons"}, {"name": "Bell Slash", "id": "bell-slash", "unicode": "f1f6", "cat": "Web Application Icons"}, {"name": "Bell Slash Outlined", "id": "bell-slash-o", "unicode": "f1f7", "cat": "Web Application Icons"}, {"name": "Trash", "id": "trash", "unicode": "f1f8", "cat": "Web Application Icons"}, {"name": "Copyright", "id": "copyright", "unicode": "f1f9", "cat": "Web Application Icons"}, {"name": "At", "id": "at", "unicode": "f1fa", "cat": "Web Application Icons"}, {"name": "Eyedropper", "id": "eyedropper", "unicode": "f1fb", "cat": "Web Application Icons"}, {"name": "Paint Brush", "id": "paint-brush", "unicode": "f1fc", "cat": "Web Application Icons"}, {"name": "Birthday Cake", "id": "birthday-cake", "unicode": "f1fd", "cat": "Web Application Icons"}, {"name": "Area Chart", "id": "area-chart", "unicode": "f1fe", "cat": "Web Application Icons"}, {"name": "Pie Chart", "id": "pie-chart", "unicode": "f200", "cat": "Web Application Icons"}, {"name": "Line Chart", "id": "line-chart", "unicode": "f201", "cat": "Web Application Icons"}, {"name": "last.fm", "id": "lastfm", "unicode": "f202", "cat": "Brand Icons"}, {"name": "last.fm Square", "id": "lastfm-square", "unicode": "f203", "cat": "Brand Icons"}, {"name": "Toggle Off", "id": "toggle-off", "unicode": "f204", "cat": "Web Application Icons"}, {"name": "Toggle On", "id": "toggle-on", "unicode": "f205", "cat": "Web Application Icons"}, {"name": "Bicycle", "id": "bicycle", "unicode": "f206", "cat": "Web Application Icons"}, {"name": "Bus", "id": "bus", "unicode": "f207", "cat": "Web Application Icons"}, {"name": "ioxhost", "id": "ioxhost", "unicode": "f208", "cat": "Brand Icons"}, {"name": "AngelList", "id": "angellist", "unicode": "f209", "cat": "Brand Icons"}, {"name": "Closed Captions", "id": "cc", "unicode": "f20a", "cat": "Web Application Icons"}, {"name": "Shekel (ILS)", "id": "ils", "unicode": "f20b", "cat": "Currency Icons"}, {"name": "meanpath", "id": "meanpath", "unicode": "f20c", "cat": "Brand Icons"}, {"name": "BuySellAds", "id": "buysellads", "unicode": "f20d", "cat": "Brand Icons"}, {"name": "Connect Develop", "id": "connectdevelop", "unicode": "f20e", "cat": "Brand Icons"}, {"name": "DashCube", "id": "dashcube", "unicode": "f210", "cat": "Brand Icons"}, {"name": "Forumbee", "id": "forumbee", "unicode": "f211", "cat": "Brand Icons"}, {"name": "Leanpub", "id": "leanpub", "unicode": "f212", "cat": "Brand Icons"}, {"name": "Sellsy", "id": "sellsy", "unicode": "f213", "cat": "Brand Icons"}, {"name": "Shirts in Bulk", "id": "shirtsinbulk", "unicode": "f214", "cat": "Brand Icons"}, {"name": "SimplyBuilt", "id": "simplybuilt", "unicode": "f215", "cat": "Brand Icons"}, {"name": "skyatlas", "id": "skyatlas", "unicode": "f216", "cat": "Brand Icons"}, {"name": "Add to Shopping Cart", "id": "cart-plus", "unicode": "f217", "cat": "Web Application Icons"}, {"name": "Shopping Cart Arrow Down", "id": "cart-arrow-down", "unicode": "f218", "cat": "Web Application Icons"}, {"name": "Diamond", "id": "diamond", "unicode": "f219", "cat": "Web Application Icons"}, {"name": "Ship", "id": "ship", "unicode": "f21a", "cat": "Web Application Icons"}, {"name": "User Secret", "id": "user-secret", "unicode": "f21b", "cat": "Web Application Icons"}, {"name": "Motorcycle", "id": "motorcycle", "unicode": "f21c", "cat": "Web Application Icons"}, {"name": "Street View", "id": "street-view", "unicode": "f21d", "cat": "Web Application Icons"}, {"name": "Heartbeat", "id": "heartbeat", "unicode": "f21e", "cat": "Web Application Icons"}, {"name": "Venus", "id": "venus", "unicode": "f221", "cat": "Gender Icons"}, {"name": "Mars", "id": "mars", "unicode": "f222", "cat": "Gender Icons"}, {"name": "Mercury", "id": "mercury", "unicode": "f223", "cat": "Gender Icons"}, {"name": "Transgender", "id": "transgender", "unicode": "f224", "cat": "Gender Icons"}, {"name": "Transgender Alt", "id": "transgender-alt", "unicode": "f225", "cat": "Gender Icons"}, {"name": "Venus Double", "id": "venus-double", "unicode": "f226", "cat": "Gender Icons"}, {"name": "Mars Double", "id": "mars-double", "unicode": "f227", "cat": "Gender Icons"}, {"name": "Venus Mars", "id": "venus-mars", "unicode": "f228", "cat": "Gender Icons"}, {"name": "Mars Stroke", "id": "mars-stroke", "unicode": "f229", "cat": "Gender Icons"}, {"name": "Mars Stroke Vertical", "id": "mars-stroke-v", "unicode": "f22a", "cat": "Gender Icons"}, {"name": "Mars Stroke Horizontal", "id": "mars-stroke-h", "unicode": "f22b", "cat": "Gender Icons"}, {"name": "Neuter", "id": "neuter", "unicode": "f22c", "cat": "Gender Icons"}, {"name": "Genderless", "id": "genderless", "unicode": "f22d", "cat": "Gender Icons"}, {"name": "Facebook Official", "id": "facebook-official", "unicode": "f230", "cat": "Brand Icons"}, {"name": "Pinterest P", "id": "pinterest-p", "unicode": "f231", "cat": "Brand Icons"}, {"name": "What's App", "id": "whatsapp", "unicode": "f232", "cat": "Brand Icons"}, {"name": "Server", "id": "server", "unicode": "f233", "cat": "Web Application Icons"}, {"name": "Add User", "id": "user-plus", "unicode": "f234", "cat": "Web Application Icons"}, {"name": "Remove User", "id": "user-times", "unicode": "f235", "cat": "Web Application Icons"}, {"name": "Bed", "id": "bed", "unicode": "f236", "cat": "Web Application Icons"}, {"name": "Viacoin", "id": "viacoin", "unicode": "f237", "cat": "Brand Icons"}, {"name": "Train", "id": "train", "unicode": "f238", "cat": "Transportation Icons"}, {"name": "Subway", "id": "subway", "unicode": "f239", "cat": "Transportation Icons"}, {"name": "Medium", "id": "medium", "unicode": "f23a", "cat": "Brand Icons"}, {"name": "Y Combinator", "id": "y-combinator", "unicode": "f23b", "cat": "Brand Icons"}, {"name": "Optin Monster", "id": "optin-monster", "unicode": "f23c", "cat": "Brand Icons"}, {"name": "OpenCart", "id": "opencart", "unicode": "f23d", "cat": "Brand Icons"}, {"name": "ExpeditedSSL", "id": "expeditedssl", "unicode": "f23e", "cat": "Brand Icons"}, {"name": "Battery Full", "id": "battery-full", "unicode": "f240", "cat": "Web Application Icons"}, {"name": "Battery 3/4 Full", "id": "battery-three-quarters", "unicode": "f241", "cat": "Web Application Icons"}, {"name": "Battery 1/2 Full", "id": "battery-half", "unicode": "f242", "cat": "Web Application Icons"}, {"name": "Battery 1/4 Full", "id": "battery-quarter", "unicode": "f243", "cat": "Web Application Icons"}, {"name": "Battery Empty", "id": "battery-empty", "unicode": "f244", "cat": "Web Application Icons"}, {"name": "Mouse Pointer", "id": "mouse-pointer", "unicode": "f245", "cat": "Web Application Icons"}, {"name": "I Beam Cursor", "id": "i-cursor", "unicode": "f246", "cat": "Web Application Icons"}, {"name": "Object Group", "id": "object-group", "unicode": "f247", "cat": "Web Application Icons"}, {"name": "Object Ungroup", "id": "object-ungroup", "unicode": "f248", "cat": "Web Application Icons"}, {"name": "Sticky Note", "id": "sticky-note", "unicode": "f249", "cat": "Web Application Icons"}, {"name": "Sticky Note Outlined", "id": "sticky-note-o", "unicode": "f24a", "cat": "Web Application Icons"}, {"name": "JCB Credit Card", "id": "cc-jcb", "unicode": "f24b", "cat": "Brand Icons"}, {"name": "Diner's Club Credit Card", "id": "cc-diners-club", "unicode": "f24c", "cat": "Brand Icons"}, {"name": "Clone", "id": "clone", "unicode": "f24d", "cat": "Web Application Icons"}, {"name": "Balance Scale", "id": "balance-scale", "unicode": "f24e", "cat": "Web Application Icons"}, {"name": "Hourglass Outlined", "id": "hourglass-o", "unicode": "f250", "cat": "Web Application Icons"}, {"name": "Hourglass Start", "id": "hourglass-start", "unicode": "f251", "cat": "Web Application Icons"}, {"name": "Hourglass Half", "id": "hourglass-half", "unicode": "f252", "cat": "Web Application Icons"}, {"name": "Hourglass End", "id": "hourglass-end", "unicode": "f253", "cat": "Web Application Icons"}, {"name": "Hourglass", "id": "hourglass", "unicode": "f254", "cat": "Web Application Icons"}, {"name": "Rock (Hand)", "id": "hand-rock-o", "unicode": "f255", "cat": "Web Application Icons"}, {"name": "Paper (Hand)", "id": "hand-paper-o", "unicode": "f256", "cat": "Web Application Icons"}, {"name": "Scissors (Hand)", "id": "hand-scissors-o", "unicode": "f257", "cat": "Web Application Icons"}, {"name": "Lizard (Hand)", "id": "hand-lizard-o", "unicode": "f258", "cat": "Web Application Icons"}, {"name": "Spock (Hand)", "id": "hand-spock-o", "unicode": "f259", "cat": "Web Application Icons"}, {"name": "Hand Pointer", "id": "hand-pointer-o", "unicode": "f25a", "cat": "Web Application Icons"}, {"name": "Hand Peace", "id": "hand-peace-o", "unicode": "f25b", "cat": "Web Application Icons"}, {"name": "Trademark", "id": "trademark", "unicode": "f25c", "cat": "Web Application Icons"}, {"name": "Registered Trademark", "id": "registered", "unicode": "f25d", "cat": "Web Application Icons"}, {"name": "Creative Commons", "id": "creative-commons", "unicode": "f25e", "cat": "Web Application Icons"}, {"name": "GG Currency", "id": "gg", "unicode": "f260", "cat": "Currency Icons"}, {"name": "GG Currency Circle", "id": "gg-circle", "unicode": "f261", "cat": "Currency Icons"}, {"name": "TripAdvisor", "id": "tripadvisor", "unicode": "f262", "cat": "Brand Icons"}, {"name": "Odnoklassniki", "id": "odnoklassniki", "unicode": "f263", "cat": "Brand Icons"}, {"name": "Odnoklassniki Square", "id": "odnoklassniki-square", "unicode": "f264", "cat": "Brand Icons"}, {"name": "Get Pocket", "id": "get-pocket", "unicode": "f265", "cat": "Brand Icons"}, {"name": "Wikipedia W", "id": "wikipedia-w", "unicode": "f266", "cat": "Brand Icons"}, {"name": "Safari", "id": "safari", "unicode": "f267", "cat": "Brand Icons"}, {"name": "Chrome", "id": "chrome", "unicode": "f268", "cat": "Brand Icons"}, {"name": "Firefox", "id": "firefox", "unicode": "f269", "cat": "Brand Icons"}, {"name": "Opera", "id": "opera", "unicode": "f26a", "cat": "Brand Icons"}, {"name": "Internet-explorer", "id": "internet-explorer", "unicode": "f26b", "cat": "Brand Icons"}, {"name": "Television", "id": "television", "unicode": "f26c", "cat": "Web Application Icons"}, {"name": "Contao", "id": "contao", "unicode": "f26d", "cat": "Brand Icons"}, {"name": "500px", "id": "500px", "unicode": "f26e", "cat": "Brand Icons"}, {"name": "Amazon", "id": "amazon", "unicode": "f270", "cat": "Brand Icons"}, {"name": "Calendar Plus Outlined", "id": "calendar-plus-o", "unicode": "f271", "cat": "Web Application Icons"}, {"name": "Calendar Minus Outlined", "id": "calendar-minus-o", "unicode": "f272", "cat": "Web Application Icons"}, {"name": "Calendar Times Outlined", "id": "calendar-times-o", "unicode": "f273", "cat": "Web Application Icons"}, {"name": "Calendar Check Outlined", "id": "calendar-check-o", "unicode": "f274", "cat": "Web Application Icons"}, {"name": "Industry", "id": "industry", "unicode": "f275", "cat": "Web Application Icons"}, {"name": "Map Pin", "id": "map-pin", "unicode": "f276", "cat": "Web Application Icons"}, {"name": "Map Signs", "id": "map-signs", "unicode": "f277", "cat": "Web Application Icons"}, {"name": "Map Outline", "id": "map-o", "unicode": "f278", "cat": "Web Application Icons"}, {"name": "Map", "id": "map", "unicode": "f279", "cat": "Web Application Icons"}, {"name": "Commenting", "id": "commenting", "unicode": "f27a", "cat": "Web Application Icons"}, {"name": "Commenting Outlined", "id": "commenting-o", "unicode": "f27b", "cat": "Web Application Icons"}, {"name": "Houzz", "id": "houzz", "unicode": "f27c", "cat": "Brand Icons"}, {"name": "Vimeo", "id": "vimeo", "unicode": "f27d", "cat": "Brand Icons"}, {"name": "Font Awesome Black Tie", "id": "black-tie", "unicode": "f27e", "cat": "Brand Icons"}, {"name": "Fonticons", "id": "fonticons", "unicode": "f280", "cat": "Brand Icons"}, {"name": "reddit Alien", "id": "reddit-alien", "unicode": "f281", "cat": "Brand Icons"}, {"name": "Edge Browser", "id": "edge", "unicode": "f282", "cat": "Brand Icons"}, {"name": "Credit Card", "id": "credit-card-alt", "unicode": "f283", "cat": "Payment Icons"}, {"name": "Codie Pie", "id": "codiepie", "unicode": "f284", "cat": "Brand Icons"}, {"name": "MODX", "id": "modx", "unicode": "f285", "cat": "Brand Icons"}, {"name": "Fort Awesome", "id": "fort-awesome", "unicode": "f286", "cat": "Brand Icons"}, {"name": "USB", "id": "usb", "unicode": "f287", "cat": "Brand Icons"}, {"name": "Product Hunt", "id": "product-hunt", "unicode": "f288", "cat": "Brand Icons"}, {"name": "Mixcloud", "id": "mixcloud", "unicode": "f289", "cat": "Brand Icons"}, {"name": "Scribd", "id": "scribd", "unicode": "f28a", "cat": "Brand Icons"}, {"name": "Pause Circle", "id": "pause-circle", "unicode": "f28b", "cat": "Video Player Icons"}, {"name": "Pause Circle Outlined", "id": "pause-circle-o", "unicode": "f28c", "cat": "Video Player Icons"}, {"name": "Stop Circle", "id": "stop-circle", "unicode": "f28d", "cat": "Video Player Icons"}, {"name": "Stop Circle Outlined", "id": "stop-circle-o", "unicode": "f28e", "cat": "Video Player Icons"}, {"name": "Shopping Bag", "id": "shopping-bag", "unicode": "f290", "cat": "Web Application Icons"}, {"name": "Shopping Basket", "id": "shopping-basket", "unicode": "f291", "cat": "Web Application Icons"}, {"name": "Hashtag", "id": "hashtag", "unicode": "f292", "cat": "Web Application Icons"}, {"name": "Bluetooth", "id": "bluetooth", "unicode": "f293", "cat": "Web Application Icons"}, {"name": "Bluetooth", "id": "bluetooth-b", "unicode": "f294", "cat": "Web Application Icons"}, {"name": "Percent", "id": "percent", "unicode": "f295", "cat": "Web Application Icons"}, {"name": "GitLab", "id": "gitlab", "unicode": "f296", "cat": "Brand Icons"}, {"name": "WPBeginner", "id": "wpbeginner", "unicode": "f297", "cat": "Brand Icons"}, {"name": "WPForms", "id": "wpforms", "unicode": "f298", "cat": "Brand Icons"}, {"name": "Envira Gallery", "id": "envira", "unicode": "f299", "cat": "Brand Icons"}, {"name": "Universal Access", "id": "universal-access", "unicode": "f29a", "cat": "Web Application Icons"}, {"name": "Wheelchair Alt", "id": "wheelchair-alt", "unicode": "f29b", "cat": "Web Application Icons"}, {"name": "Question Circle Outlined", "id": "question-circle-o", "unicode": "f29c", "cat": "Web Application Icons"}, {"name": "Blind", "id": "blind", "unicode": "f29d", "cat": "Web Application Icons"}, {"name": "Audio Description", "id": "audio-description", "unicode": "f29e", "cat": "Web Application Icons"}, {"name": "Volume Control Phone", "id": "volume-control-phone", "unicode": "f2a0", "cat": "Web Application Icons"}, {"name": "Braille", "id": "braille", "unicode": "f2a1", "cat": "Web Application Icons"}, {"name": "Assistive Listening Systems", "id": "assistive-listening-systems", "unicode": "f2a2", "cat": "Web Application Icons"}, {"name": "American Sign Language Interpreting", "id": "american-sign-language-interpreting", "unicode": "f2a3", "cat": "Web Application Icons"}, {"name": "Deaf", "id": "deaf", "unicode": "f2a4", "cat": "Web Application Icons"}, {"name": "Glide", "id": "glide", "unicode": "f2a5", "cat": "Brand Icons"}, {"name": "Glide G", "id": "glide-g", "unicode": "f2a6", "cat": "Brand Icons"}, {"name": "Sign Language", "id": "sign-language", "unicode": "f2a7", "cat": "Web Application Icons"}, {"name": "Low Vision", "id": "low-vision", "unicode": "f2a8", "cat": "Web Application Icons"}, {"name": "Viadeo", "id": "viadeo", "unicode": "f2a9", "cat": "Brand Icons"}, {"name": "Viadeo Square", "id": "viadeo-square", "unicode": "f2aa", "cat": "Brand Icons"}, {"name": "Snapchat", "id": "snapchat", "unicode": "f2ab", "cat": "Brand Icons"}, {"name": "Snapchat Ghost", "id": "snapchat-ghost", "unicode": "f2ac", "cat": "Brand Icons"}, {"name": "Snapchat Square", "id": "snapchat-square", "unicode": "f2ad", "cat": "Brand Icons"}];
            mainFactory.estadosBrasil = [{nome: "Acre", sigla: "AC"}, {nome: "Alagoas", sigla: "AL"}, {nome: "Amap\u00e1", sigla: "AP"}, {nome: "Amazonas", sigla: "AM"}, {nome: "Bahia", sigla: "BA"}, {nome: "Cear\u00e1", sigla: "CE"}, {nome: "Distrito Federal", sigla: "DF"}, {nome: "Esp\u00edrito Santo", sigla: "ES"}, {nome: "Goi\u00e1s", sigla: "GO"}, {nome: "Maranh\u00e3o", sigla: "MA"}, {nome: "Mato Grosso", sigla: "MT"}, {nome: "Mato Grosso do Sul", sigla: "MS"}, {nome: "Minas Gerais", sigla: "MG"}, {nome: "Par\u00e1", sigla: "PA"}, {nome: "Para\u00edba", sigla: "PB"}, {nome: "Paran\u00e1", sigla: "PR"}, {nome: "Pernambuco", sigla: "PE"}, {nome: "Piau\u00ed", sigla: "PI"}, {nome: "Rio de Janeiro", sigla: "RJ"}, {nome: "Rio Grande do Norte", sigla: "RN"}, {nome: "Rio Grande do Sul", sigla: "RS"}, {nome: "Rond\u00f4nia", sigla: "RO"}, {nome: "Roraima", sigla: "RR"}, {nome: "Santa Catarina", sigla: "SC"}, {nome: "S\u00e3o Paulo", sigla: "SP"}, {nome: "Sergipe", sigla: "SE"}, {nome: "Tocantins", sigla: "TO"}];
            return mainFactory;
        }]);

    app.directive('adminGenLista', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    table: "@",
                    template: "@",
                    wppage: "@",
                    showimg: "@",
                    titulo: "@",
                    qtdeporpagina: "@",
                    imgwidht: "@"
                },
                controller: 'listaController',
                link: function ($scope, elem) {
                    $scope.bloquearTela();
                    if (swerp.isEmpty($scope.template)) {
                        $scope.template = 'list';
                        $scope.gerador = $scope.table;
                    }
                    mainFac.loadTemplate($scope.gerador, $scope.template, function (html) {
                        elem.append(html);
                        $compile(elem.contents())($scope);
                        $scope.loadList();
                    });
                }
            };
        }]);

    app.directive('adminGenUpload', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    id: "=?",
                    table: "@",
                    item: "=?",
                    config: "=?"
                },
                template: '<button class="btn btn-x btn-success" ng-click="upload()" ng-bind-html="template"></button>',
                link: function ($scope, elem) {

                    $scope.title = "Upload de Imagens";
                    mainFac.init($scope);
                    mainFac.service($scope.table, $scope);

                    var update = function () {
                        mainFac.update($scope.table, {
                            id: $scope.item.id,
                            imagens: swerp.isEmpty($scope.item.imagens) ? null : $scope.item.imagens
                        }, function (cb) {
                            $scope.template = swerp.isEmpty($scope.item.imagens) ? '<i class="fa fa-upload"></i>' : '<strong>' + $scope.item.imagens.length + '</strong>';
                            $scope.$applyAsync();
                        });
                    };

                    $scope.deleteFile = function (file, index) {
                        let confirm = window.confirm("Deseja apagar imagem?");
                        if (confirm) {
                            mainFac.deleteFile($scope.table, $scope.item.id, file, function (cb) {
                                $scope.item.imagens.splice(index, 1);
                                update();
                            });
                        }
                    };

                    $scope.template = swerp.isEmpty($scope.item.imagens) ? '<i class="fa fa-upload"></i>' : '<strong>' + $scope.item.imagens.length + '</strong>';
                    $scope.upload = function () {
                        mainFac.loadTemplate(null, 'commons/modal_upload', function (modal) {
                            mainFac.loadTemplate(null, 'commons/upload', function (html) {
                                $('#modal_conteudo_admingen').html(modal.replace(/#_modal_content/gmi, html));
                                $compile($('#modal_conteudo_admingen').contents())($scope);
                                $('#main_modal_conteudo_admingen').modal('show');
                                mainFac.uploadInit($scope.table, $scope.item, $scope.config, function (file, data) {
                                    if (swerp.isEmpty($scope.item.imagens)) {
                                        $scope.item.imagens = [];
                                    }
                                    $scope.item.imagens.push(data);
                                }, function (all) {
                                    update();
                                });
                            });
                        });
                    };
                }
            };
        }]);

    app.directive('adminGenEdit', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    id: "=?",
                    table: "@",
                    item: "=?"
                },
                template: '<button class="btn btn-x btn-info" ng-click="edit()"><i class="fa fa-edit"></i></button>',
                link: function ($scope, elem) {
                    $scope.title = "Editar";
                    mainFac.init($scope);
                    mainFac.service($scope.table, $scope);
                    $scope.edit = function () {
                        mainFac.loadTemplate(null, 'commons/modal', function (modal) {
                            mainFac.loadTemplate($scope.table, 'form', function (html) {
                                $('#modal_conteudo_admingen').html(modal.replace(/#_modal_content/gmi, html));
                                $compile($('#modal_conteudo_admingen').contents())($scope);
                                $('#main_modal_conteudo_admingen').modal('show');
                            });
                        });
                    };
                    $scope.save = function (form) {
                        mainFac.update($scope.table, $scope.item, function (cb) {
                            $('#main_modal_conteudo_admingen').modal('hide');
                        });
                    };
                }
            };
        }]);

    app.directive('adminGenNovo', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    table: "@",
                    label: "@",
                    action: "&"
                },
                template: '<button class="btn btn-x btn-dark" ng-click="novo()"><i class="fa fa-file"></i> {{label}}</button>',
                link: function ($scope, elem) {
                    $scope.title = "Novo";
                    mainFac.init($scope);
                    mainFac.service($scope.table, $scope);
                    $scope.item = mainFac.instance($scope.table);
                    $scope.novo = function () {
                        mainFac.loadTemplate(null, 'commons/modal', function (modal) {
                            mainFac.loadTemplate($scope.table, 'form', function (html) {
                                $('#modal_conteudo_admingen').html(modal.replace(/#_modal_content/gmi, html));
                                $compile($('#modal_conteudo_admingen').contents())($scope);
                                $('#main_modal_conteudo_admingen').modal('show');
                            });
                        });
                    };
                    $scope.save = function (form) {
                        mainFac.insert($scope.table, $scope.item, function (cb) {
                            $scope.action();
                            $('#main_modal_conteudo_admingen').modal('hide');
                        });
                    };
                }
            };
        }]);

    app.directive('adminGenRemove', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    id: "=?",
                    table: "@",
                    item: "=?",
                    label: "@",
                    action: "&"
                },
                template: '<button class="btn btn-x btn-danger" ng-click="remove()"><i class="fa fa-trash"></i> {{label}}</button>',
                link: function ($scope, elem) {
                    mainFac.init($scope);
                    $scope.title = "Remover";
                    $scope.remove = function () {
                        let confirm = window.confirm('Realmente deseja remover? \n\nATENÇÃO REGISTRO VICULADOS PODEM SER EXCLUIDOS!');
                        if (confirm) {
                            mainFac.remove($scope.table, $scope.item, function (cb) {
                                if (cb) {
                                    $scope.action({
                                        offset: 0
                                    });
                                }
                            });
                        }
                    };
                }
            };
        }]);

    app.directive('adminGenInputIcon', ['mainFac', function (mainFac) {
            return {
                restrict: 'AE',
                scope: {
                    model: "=?"
                },
                templateUrl: path_plugin + 'templates/commons/input-icon.html',
                link: function ($scope, elem) {
                    $scope.fontAwersome = mainFac.fontAwersome;
                    $scope.setIcon = function (font) {
                        $scope.model = font.id;
                    };
                }
            };
        }]);

    app.directive('adminGenDetalhe', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                scope: {
                    table: "@",
                    id: "@"
                },
                link: function ($scope, elem) {
                    console.log('carregou detalhe', $scope.id);
                    mainFac.init($scope);
                    mainFac.detalhe(function (cb) {
                        mainFac.loadTemplate(null, 'detalhes', function (html) {
                            $scope.item = cb;
                            $scope.$applyAsync();
                            elem.html(html);
                            $compile(elem.contents())($scope);
                            console.log('Item carregado!');
                        });
                    }, $scope.table, $scope.id);
                }
            };
        }]);

    app.directive('adminGenPaginacao', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                link: function ($scope, elem) {
                    mainFac.init($scope);
                    mainFac.loadTemplate(null, 'commons/paginacao', function (html) {
                        elem.html(html);
                        $compile(elem.contents())($scope);
                    });
                }
            };
        }]);

    app.directive('adminGenFiltro', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                link: function ($scope, elem, attrs) {
                    mainFac.cache('cidades', function (fn) {
                        mainFac.listAll(function (cb) {
                            $scope.cidades = cb;
                            fn(cb, 'cidades');
                        }, 'cidade', 'nome_cidade', 'ASC');
                    }, $scope);
                    mainFac.cache('tipos', function (fn) {
                        mainFac.listAll(function (cb) {
                            $scope.tipos = cb;
                            fn(cb, 'tipos');
                        }, 'tipo', 'nome_tipo', 'ASC');
                    }, $scope);
                    mainFac.cache('faixa_precos', function (fn) {
                        mainFac.listAll(function (cb) {
                            $scope.faixa_precos = cb;
                            fn(cb, 'faixa_precos');
                        }, 'faixa_preco', 'nome_preco', 'ASC');
                    }, $scope);
                    mainFac.loadTemplate(null, 'filtro', function (html) {
                        elem.append(html);
                        $compile(elem.contents())($scope);
                    });

                    $scope.filtro = {};

                    $scope.filtrar = function (filtros) {
                        $scope.$broadcast('filtra_' + attrs.table, filtros);
                        if (!swerp.isEmpty(attrs.id)) {
                            swerp.setlocalStorageObj('filtro456', filtros);
                            window.location.href = "?p=" + attrs.pagelist;
                        }
                    };
                    $scope.limpa_filtrar = function () {
                        $scope.filtro = {};
                        $scope.$broadcast('filtra_' + attrs.table, $scope.filtro);
                    };

                    if (swerp.getlocalStorageObj('filtro456')) {
                        setTimeout(function () {
                            $scope.filtro = swerp.getlocalStorageObj('filtro456');
                            $scope.filtrar($scope.filtro);
                            swerp.setlocalStorageObj('filtro456', null);
                            $scope.$applyAsync();
                        }, 1000);
                    }
                }
            };
        }]);

    app.directive('adminGenFiltroCidade', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                link: function ($scope, elem) {
                    mainFac.init($scope);
                    mainFac.cache('filtroCidade', function (fn) {
                        mainFac.http('POST', {
                            action: 'adminGen_filtrocidade'
                        }, null, function (cb) {
                            $scope.filtroCidade = cb;
                            fn(cb, 'filtroCidade');
                        });
                    }, $scope, 'mylocal');
                    mainFac.loadTemplate(null, 'filtro-cidade', function (html) {
                        elem.html(html);
                        $compile(elem.contents())($scope);
                    });
                }
            };
        }]);

    app.directive('adminGenFiltroTipo', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                link: function ($scope, elem) {
                    mainFac.init($scope);
                    mainFac.cache('filtroTipo', function (fn) {
                        mainFac.http('POST', {
                            action: 'adminGen_filtrotipo'
                        }, null, function (cb) {
                            $scope.filtroTipo = cb;
                            fn(cb, 'filtroTipo');
                        });
                    }, $scope, 'mylocal');
                    mainFac.loadTemplate(null, 'filtro-tipo', function (html) {
                        elem.html(html);
                        $compile(elem.contents())($scope);
                    });
                }
            };
        }]);

    app.directive('adminGenFiltroPreco', ['mainFac', '$compile', function (mainFac, $compile) {
            return {
                restrict: 'AE',
                link: function ($scope, elem) {
                    mainFac.init($scope);
                    mainFac.cache('filtroPreco', function (fn) {
                        mainFac.http('POST', {
                            action: 'adminGen_filtropreco'
                        }, null, function (cb) {
                            $scope.filtroPreco = cb;
                            fn(cb, 'filtroPreco');
                        });
                    }, $scope, 'mylocal');
                    mainFac.loadTemplate(null, 'filtro-preco', function (html) {
                        elem.html(html);
                        $compile(elem.contents())($scope);
                    });
                }
            };
        }]);

    app.directive("gridContainerFree", [function () {
            return {
                restrict: "A",
                scope: {
                    gridContainerFree: "@",
                    minmax: "@",
                    literal: "@",
                    widthReference: "@",
                    config: "="
                },
                link: function ($scope, $elem) {

                    var init = function () {
                        var widthReference;
                        if (!swerp.isEmpty($scope.widthReference)) {
                            widthReference = $($scope.widthReference).width();
                        }
                        var elem = $($scope.widthReference);
                        while (widthReference <= 100) {
                            widthReference = elem.width();
                            elem = elem.parent();
                        }
                        var baseGrid = swerp.fnBaseGrid(widthReference);
                        var templateString = [];
                        var template = [];
                        var childrens = $elem.children();

                        for (var i = 0; i < childrens.length; i++) {
                            template.push("1fr");
                        }

                        templateString = template.join(" ");
                        if (baseGrid.xs) {
                            templateString = '100%';
                        } else {
                            if (!swerp.isEmpty($scope.gridContainerFree)) {
                                templateString = $scope.gridContainerFree;
                            }
                            if (!swerp.isEmpty($scope.minmax)) {
                                template = [];
                                for (var i = 0; i < childrens.length; i++) {
                                    template.push($scope.minmax);
                                }

                                templateString = template.join(" ");
                            }
                            if ($scope.literal) {
                                templateString = $scope.literal;
                                //Ex: repeat(auto-fit, minmax(100px, auto))
                                //Ex: repeat(6, minmax(80px, auto)) 25px
                            }
                            if (!swerp.isEmpty($scope.config)) {
                                template = [];
                                for (var prop in $scope.config) {
                                    var cfg = $scope.config[prop];
                                    if (cfg.visible && !swerp.isEmpty(cfg.gwidth)) {
                                        template.push(cfg.gwidth);
                                    }
                                }
                                templateString = template.join(" ");
                            }
                            if ($scope.literal) {
                                templateString = $scope.literal;
                            }
                            if (!swerp.isEmpty($scope.config)) {
                                template = [];
                                for (var prop in $scope.config) {
                                    var cfg = $scope.config[prop];
                                    if (cfg.visible && !swerp.isEmpty(cfg.gwidth)) {
                                        template.push(cfg.gwidth);
                                    }
                                }
                                templateString = template.join(" ");
                            }
                        }
                        $elem.css('display', 'grid');
                        $elem.css('grid-template-columns', templateString);
                        $elem.css('grid-column-gap', '3px');
                    };

                    $scope.$watch('config', function (nv) {
                        if (nv) {
                            init();
                        }
                    }, true);
                    $scope.$watch(function () {
                        return $($scope.widthReference || document).width();
                    }, function () {
                        init();
                    });
                    $scope.$watch(function () {
                        return $elem.children().length;
                    }, function () {
                        init();
                    });
                    init();
                }
            };
        }
    ]);

})(jQuery);