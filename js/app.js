$(document).ready(function() {
    cardapio.eventos.init();

})

var cardapio = {};

var MEU_CARRINHO = [];

var VALLOR_CARRINHO = 0;
var VALLOR_ENTREGA = 5;
var MEU_ENDERECO = null
var CELULAR_EMPRESA= '5599988334562';
cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarButaoLigar();

    }

}

cardapio.metodos = {
    // Obter a lista de itens do cardápio
    obterItensCardapio: (categoria = 'copao_whisky', vermais = false) => {
        var filtro = MENU[categoria];
            console.log(filtro);

            if (!vermais) {
               $("#itensCardapio").html('')
                $("#btnVerMais").removeClass('hiden');
            }

             
            
            $.each(filtro, (i, e) => {

                // Alterando dados no templates
                let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                //formatando com duas casas decimais e alterando . por virgula 
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
                                                    


                // quando clicar no ver mais 
                if(vermais && i >= 8 && i < 12) {
                    $("#itensCardapio").append(temp);
                }
                // mostrar somente 8 itens
                if (!vermais && i < 8) {
                    $("#itensCardapio").append(temp);
                }

                

        })

        //remover o ativo
        $(".container-menu a").removeClass('active');

        // marcar selecionado como ativo
        $("#menu-" + categoria).addClass('active');
    },
    // clique no butao de ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true)
        $("#btnVerMais").addClass('hiden');
    },
    //diminuir a quantidade
    diminuirQuantidade: (id) => {
        let qntdAtual =parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },
    //aumentrar a quantidade
    aumentarQuantidade: (id) => {

        let qntdAtual =parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)


    },
    // adcionar produto ao carrinho
    adicionarAoCarrinho: (id) => {

        let qntdAtual =parseInt($("#qntd-" + id).text());
        if (qntdAtual > 0) {
            //obter a categoria 
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obter a lista de itens
            let filtro = MENU[categoria];

            // pegar item 
            let item = $.grep(filtro, (e, i) => { return e.id == id});

            if ( item.length > 0) {

                //validade de o item existe no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id});


                //caso o intem ja existe, só alterar a quantidade
                if (existe.length > 0) {

                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;


                }
                // caso ainda nao exite sera adcionado 1 quantidade
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                cardapio.metodos.mensagem('Item adcionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);


                cardapio.metodos.atualizarBadgeTotal ();
              
            }


        }

    },
    // atualizar badge de totais dos botoes "MEU CARRINHO"
    atualizarBadgeTotal: () => {
        var total = 0;
        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hiden')
            $(".container-total-carrinho").removeClass('hiden')
        }
        else {
            $(".botao-carrinho").addClass('hiden')
            $(".container-total-carrinho").addClass('hiden')
        }


        $(".badge-total-carrinho").html(total);

    
    },
    //mostrar modal full
    abrirCarrinho: (abrir) => {

        if  (abrir) {
            $("#modalCarrinho").removeClass('hiden');
            cardapio.metodos.carregarCarrinho();
        }
        else{
            $("#modalCarrinho").addClass('hiden');
        }

    },

    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hiden');
            $("#localEntrega").addClass('hiden');
            $("#resumoCarrinho").addClass('hiden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hiden');
            $("#btnEtapaEndereco").addClass('hiden');
            $("#btnEtapaResumo").addClass('hiden');
            $("#btnVoltar").addClass('hiden');

            
        }
        if (etapa == 2){

            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hiden');
            $("#localEntrega").removeClass('hiden');
            $("#resumoCarrinho").addClass('hiden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hiden');
            $("#btnEtapaEndereco").removeClass('hiden');
            $("#btnEtapaResumo").addClass('hiden');
            $("#btnVoltar").removeClass('hiden');


        }
        if (etapa == 3) {

            $("#lblTituloEtapa").text('Resumo do pedido');
            $("#itensCarrinho").addClass('hiden');
            $("#localEntrega").addClass('hiden');
            $("#resumoCarrinho").removeClass('hiden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hiden');
            $("#btnEtapaEndereco").addClass('hiden');
            $("#btnEtapaResumo").removeClass('hiden');
            $("#btnVoltar").removeClass('hiden');


        }

    },
    // botao voltar 
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa -1)
    },
    //metodo para carregar a lista de itens do carrinho
    carregarCarrinho: () => {
        
        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                //ultimo item
                if((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregaValores();
                }



            })

        }
        else {
            $("#itensCarrinho").html('<div class="carrinho-vazio"><i class="fa fa-shopping-bag"></i><p>Seu carrinho está vazio</p></div>');
             cardapio.metodos.carregaValores();

        }
    },
    //Diminui a quantidade de item do carrinho
    diminuirQuantidadeCarrinho: (id) => {

         let qntdAtual =parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual -1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(id)

        }



        
    },
    //aumentar a quantidade de item do carrinho
    aumentarQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },
    // botao remover do carrinho
    removerItemCarrinho: (id) => {
        MEU_CARRINHO = MEU_CARRINHO.filter((item) => item.id != id);
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.mensagem('Item removido do carrinho', 'red');
    },
    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {
        
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

            // atualizar o butao de carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
        
        //atualiza os valoes (R$) totais do carrinho
        cardapio.metodos.carregaValores();



    },

    //Carrega os valores total
    carregaValores: () => {

        VALLOR_CARRINHO = 0 ;
        $("#lblSubTotal").text('R$ 0,00')
        $("#lblValorEntrega").text('+ R$ 0,00')
        $("#lblValorTotal").text('R$ 0,00')

        $.each(MEU_CARRINHO, (i, e) => {
            VALLOR_CARRINHO +=parseFloat(e.price*e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALLOR_CARRINHO.toFixed(2).replace('.',',')}`);
            $("#lblValorEntrega").text(`+ R$ ${VALLOR_ENTREGA.toFixed(2).replace('.',',')}`)
            $("#lblValorTotal").text(`R$ ${(VALLOR_CARRINHO + VALLOR_ENTREGA).toFixed(2).replace('.',',')}`)
            }
        })

    }, 
    //Carrgar a etpa de endereços
    carregarEndereco: () => {
        if (MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem('Seu Caringo está vazio.')
            return;
        }

        cardapio.metodos.carregarEtapa(2);
    },

    //API ViaCEP
    bucarCep: () => {
        //cria a variavel com o valor do cep
        var cep = $("#txtCep").val().trim().replace(/\D/g, '');
        //veifica se o cep tem valor informado
        if (cep != "") {
            //expressão regular para validar cep
           var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (dados) {
                    
                    if (!("erro" in dados)) {

                        //atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtEndereco").focus();

                    }
                    else{
                        cardapio.metodos.mensagem("CEP não encontrado. Preencha as informações manualmente.");
                         $("#txtEndereco").focus();
                    }

                })

            }
            else{
                cardapio.metodos.mensagem('Formado do CEP inválido.')
                $("#txtCep").focus();
        
            }
        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCep").focus();
        }

    },

    //validação antes de prossegui para etapa 3
    resumoPedido: () => {

    let cep = $("#txtCep").val().trim();
    let endereco = $("#txtEndereco").val().trim();
    let bairro = $("#txtBairro").val().trim();
    let cidade = $("#txtCidade").val().trim();
    let uf = $("#ddlUf").val().trim();
    let numero = $("#txtNumero").val().trim();
    let complemento = $("#txtComplemento").val().trim();

    if (cep.length <= 0) {
        cardapio.metodos.mensagem("Informe o CEP, por favor.");
        $("#txtCep").focus();
        return;
    }
    if (endereco.length <= 0) {
        cardapio.metodos.mensagem('Informe o Endereço, por favor.');
        $("#txtEndereco").focus();
        return;
    }
    if (bairro.length <= 0) {
        cardapio.metodos.mensagem('Informe o Bairro, por favor.');
        $("#txtBairro").focus();
        return;
    }
    if (cidade.length <= 0) {
        cardapio.metodos.mensagem('Informe a Cidade, por favor.');
        $("#txtCidade").focus();
        return;
    }
    if (uf === "-1" || uf === "") {
        cardapio.metodos.mensagem('Informe o UF, por favor.');
        $("#ddlUf").focus();
        return;
    }
    if (numero.length <= 0) {
        cardapio.metodos.mensagem('Informe o Número, por favor.');
        $("#txtNumero").focus();
        return;
    }

    // Se todos os campos estiverem preenchidos corretamente:
    MEU_ENDERECO = {
        cep: cep,
        endereco: endereco,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        numero: numero,
        complemento: complemento
    };

    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();
},


    //carrega etapa de resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) =>{
            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${qntd}/g, e.qntd)

                $("#listaItensResumo").append(temp);
        });
        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf}/ ${MEU_ENDERECO.cep}  ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();



    },

    finalizarPedido: () => {
        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            // Geração de data e código do pedido
            const agora = new Date();
            const dataHoraFormatada = agora.toLocaleString('pt-BR');

            // Gera um número de 6 dígitos baseado no timestamp
            const numeroAleatorio = agora.getTime().toString().slice(-6); // ex: '123456'
            const codigoPedido = `${numeroAleatorio.slice(0, 3)}-${numeroAleatorio.slice(3)}`;

            // Itens do carrinho
            let itens = '';
            $.each(MEU_CARRINHO, (i, e) => {
                itens += `*${e.qntd}x* ${e.name}....... R$:${e.price.toFixed(2).replace('.', ',')}\n`;
            });

            // Mensagem de pedido para o WhatsApp
            let texto = `Olá! Gostaria de fazer um pedido:\n`;
            texto += `\n*Pedido nº ${codigoPedido}*`;
            texto += `\n🕒 *Data e hora:* ${dataHoraFormatada}`;
            texto += `\n\n📦🍺 *Itens do pedido:*\n${itens}`;
            texto += `\n📍 *Endereço de entrega:*`;
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n💵 *Total (com entrega): R$ ${(VALLOR_CARRINHO + VALLOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            // Link do WhatsApp
            let enconde = encodeURIComponent(texto);
            let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${enconde}`;

            $("#btnEtapaResumo").attr('href', URL);
        }
    },


    carregarBotaoReserva: () => {
        var texto = 'Olá! Gostaria de fazer uma *reserva:*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);
    },

    carregarButaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },









    //Mensagens personalizadas
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}"> ${texto}</div>`;

        $("#container-mensages").append(msg);

        setTimeout(() => {


            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            
            setTimeout(() => {
                $("#msg-" + id).remove();
                
            }, 800);

        }, tempo)

    },




}


cardapio.templates = {
    item: `
        <div class="col-3 mb-5 animated fadeInUp">
            <div class="card-item card" id="\${id}" style="border: none;">
                <div class="img-produto">
                    <img src="\${img}" alt="Foto">
                    <p class="title-produto text-center mt-4">
                        <b>\${nome}</b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$ \${preco}</b>
                    </p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"> <i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}" >0</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                    </div>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" alt="Foto">

            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$: \${preco}</b></p>
            </div>
            <div class="finalizar-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"> <i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}" >\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
            </div>   
                                               
        </div> 
    `,
    itemResumo: `
    <div class="col-12 item-carrinho resumo">
        <div class="img-produto-resumo">
            <img src="\${img}" alt="">
        </div>
        <div class="dados-produto">
            <p class="title-produto-resumo">
                <b>\${nome}</b>
            </p>
            <p class="price-produto-resumo">
                <b>R$ \${preco}</b>
            </p>
        </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
    </div>
    `
};
