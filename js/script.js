function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function get_pergunta(callback){
    $.ajax({
        url : "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy",
        type: "GET",
        dataType: "json",
    }).done(function(data){
        callback(data.results[0]);
    }).fail(function(){
        console.log("Erro na requisição");
    });


}

$("#nova_pergunta").click(function(){
    $("#opcoes").html("");
    $("#erro_acerto").html("");
    $("#pergunta").html("");
    $("#nova_pergunta").hide();
    get_pergunta(gerar_pergunta);
})

let perguntasGeradas = 0;
let pontuacao = 0;

function gerar_pergunta(pergunta){
    if (perguntasGeradas >= 10) {
        $("#nova_pergunta").hide(); 
        return;
    }

    perguntasGeradas++;

    $("#pergunta").html(pergunta.question);
    var resposta_correta = pergunta.correct_answer;
    var respostas = pergunta.incorrect_answers;
    respostas.push(resposta_correta);
    respostas = shuffle(respostas);
    console.log('resposta correta:', resposta_correta);
    console.log('respostas: ', respostas);

    for (a = 0; a < respostas.length; a++){
        $("#opcoes").append('<input type="radio" name="opcao" value="' + respostas[a] + '"> ' + respostas[a] + '<br>');
    }

    $("#opcoes input[name='opcao']").change(function(){
        $("#submeter").show();

    });

    $("#submeter").click(function(){
        var resposta_escolhida = $("#opcoes input[name='opcao']:checked").val();

        $("#submeter").hide();

        if(resposta_escolhida == resposta_correta){
            $("#erro_acerto").html("<span style='color: green'; font-weight:bold'>Parabéns, você acertou! " + "</span>");
            pontuacao++;
            

        } else {
            $("#erro_acerto").html("<span style='color: red'; font-weight:bold'>Você errou! A resposta é: " + resposta_correta + "</span>");

        }

        $("#opcoes input[name='opcao']").attr('disabled',true);

        if(perguntasGeradas == 10){
            $("#pontuacao_total").show();
        } else{
            $("#nova_pergunta").show();
        }

    })
    $("#pontuacao_total").click(function(){
        $(".container_perguntas").hide();
        $("#pontuacao_total_container").show();
        $("#pontuacao").html(pontuacao);
        if (pontuacao >= 8) {
            $("#mgs_pontuacao").html("Parabéns, você está afiado!");
        } else if (pontuacao >= 1 && pontuacao <= 7) {
            $("#mgs_pontuacao").html("Precisa assistir mais filmes!");
        } else {
            $("#mgs_pontuacao").html("Que pena, você zerou!");
        }
        
        $("#zerar").show();

        $("#zerar").click(function(){
            location.reload(); // Recarrega a página
        });
      

    });
}

get_pergunta(gerar_pergunta);