//URL json guide
var URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";

//
fetch(URL).then(r => r.text()).then(result => {
    // Result now contains the response text
    console.log(result);
    
})
