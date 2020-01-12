Stripe.setPublishableKey('pk_test_kpSyP2pKS0Y3URliL2IbxWCF00Cr8LslHE');

var $form=$('#checkout-form');
$form.submit((event)=>{
    console.log("in suu");
    var exp=$("#cc-expiration").val();
    var mon=exp.substring(0,exp.indexOf('/'));
    var yr=exp.substring(exp.indexOf('/'));
    $form.find('button').attr('disabled',true);
    Stripe.card.createToken({
        number:$("#cc-number").val(),
        cvc:$("#cc-cvv").val(),
        exp_month:mon,
        exp_year:yr,
        name:$("#cc-name").val()
    },stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status,response){
    console.log("sdbhsdsd");
    if(response.error){
        $('button').attr('disabled',false);
        $('#checkout-error').text(response.error.message);
        $('#checkout-error').removeClass('d-none');
    }
    else{
        var token=response.id;
        $form.append("<input type='hidden'  name='stripeToken' />").val(token);
        $form.get(0).submit();
    }
}
