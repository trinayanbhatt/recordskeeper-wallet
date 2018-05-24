jQuery(document).ready(function(){


	jQuery("#signersend").click(function(){

		sendmultisigvalue = jQuery("#signerprivkey").val();

		
        signMultisigTransaction();

	});
	CONSOLE_DEBUG && console.log("net", net);

	

});

var CONSOLE_DEBUG = true ;
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


function signMultisigTransaction(){

	var multisigtransactionHex = getUrlParameter('multisig');
	CONSOLE_DEBUG && console.log("multisigHex", multisigtransactionHex);

	var redeemScript = getUrlParameter('redeemScript');
	CONSOLE_DEBUG && console.log("redeemScript", redeemScript);

	var decodeMultisigVinTxid = getUrlParameter('txid');
	CONSOLE_DEBUG && console.log("txid", decodeMultisigVinTxid);

	var getRawTransactionResp = getUrlParameter('getRawTransactionResp');
	CONSOLE_DEBUG && console.log("getRawTransactionResp", getRawTransactionResp);

	var decodeMultisigVout = getUrlParameter('vout');
	CONSOLE_DEBUG && console.log("vout", decodeMultisigVout);

    jQuery.ajax({
            type: "POST",
            url: 'signmultitransaction.php',
           
            data: {
                 net: net,   
                 multisigtransactionHex : multisigtransactionHex,
                 redeemScript : redeemScript,
                 decodeMultisigVinTxid : decodeMultisigVinTxid,
                 getRawTransactionResp : getRawTransactionResp,
                 decodeMultisigVout : decodeMultisigVout,
                 sendmultisigvalue : sendmultisigvalue
                
            },

            success: function(Response) {
               
               var signmultiTransactionRes = Response ; 

               signmultiTransactionRes = JSON.parse(signmultiTransactionRes);

                CONSOLE_DEBUG && console.log("signmultiTransactionRes", signmultiTransactionRes);

                if ( signmultiTransactionRes.result == null ){

                	swal({
                	icon: "error",
                    title: 'Incorrect Private Key',
                    html: '<p></p>',
                    type: 'error',
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "OK!",
                    timer: 15000
                });

                }

               else{

               				signmultiTransactionComplete = signmultiTransactionRes.result.complete;
               				CONSOLE_DEBUG && console.log("signmultiTransactionComplete", signmultiTransactionComplete);
               				 multisigsendhex = signmultiTransactionRes.result.hex;
							 sendmultisig();

				               if ( signmultiTransactionComplete == false){

				                   signmultiTransactionHex = signmultiTransactionRes.result.hex;

				                   CONSOLE_DEBUG && console.log("signmultiTransactionRes", signmultiTransactionHex);

				                   

				                    var URLBase = "http://localhost:8888/wallet/recordskeeper-wallet/signer.php?multisig=";
				                    var TrailingFixedData = signmultiTransactionHex;

				                    finalURL = URLBase +  TrailingFixedData;
				                    CONSOLE_DEBUG && console.log("finalURL", finalURL);

				                   jQuery(".signtransUrl").css("display", "block");
				                   jQuery(".signurl").text(finalURL);
				                   jQuery(".asignhref").attr("href", finalURL);

	            				}
				               else {

				                 

							            

							             if(net == "TestNetwork" ){

							             	transactionUrl = "https://test-explorer.recordskeeper.co/RecordsKeeper%20Testnet/tx/" + transactionID ;
							             }
							             else{

							             	transactionUrl = "https://explorer.recordskeeper.co/RecordsKeeper%20Mainnet/tx/" + transactionID ;
							             }

							             
							             swal({
							                title: 'Transaction Successful !',
							                html: '<a href="' + transactionUrl + '" target="_blank"> <b>Check Transaction status here:</b><br> </a>',
							                type: 'success',
							                confirmButtonClass: "btn-success",
							                confirmButtonText: "Close!",
							                timer: 15000
							            });
				               }
               }
            }

     });

}

function sendmultisig(){


    jQuery.ajax({
            type: "POST",
            url: 'sendmultisig.php',
           
            data: {
                net: net,
                async: false,
                multisigsendhex: multisigsendhex
                
            },

            success: function(Response) {
               
               var multiSigResponse = Response ;

               if( multiSigResponse.result == null  ){

               		swal({
	                	icon: "error",
	                    title: 'Transaction already in Blockchain',
	                    html: '<p></p>',
	                    type: 'error',
	                    confirmButtonClass: "btn-danger",
	                    confirmButtonText: "OK!",
	                    timer: 15000
               		 });

               }
               multiSigResponse = JSON.parse(multiSigResponse);
               multiSigResponse = multiSigResponse.result ;
               CONSOLE_DEBUG && console.log("sendmultisig Response : ", multiSigResponse);

                transactionID = multiSigResponse ;

            }

          });


}







var  transactionID ;



