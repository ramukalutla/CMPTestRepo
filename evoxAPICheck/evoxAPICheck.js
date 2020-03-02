import { LightningElement,api,wire} from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class EvoxAPICheck extends LightningElement {
  //@track apiURL;
  @api showSample;
  @wire(CurrentPageReference) pageRef;
    handleClick(){
        this.showSample = false;
        fireEvent(this.pageRef,'TestEvent',null);
    }

/*    connectedCallback(){     
    
    }
    checkAccountNumber(){
        window.console.log('In on ');
    }
    handlePaste(){
        window.console.log('In on blur function');
    }
    getVehicleImage(){
        //const apiURL = "api.evoximages.com/api/v1/vehicles?api_key=7NzFzyS2e8zz7nsFBF3GwEuTKxdxeA6P&year=2018&make=Audi&model=A8";
        //window.console.log('In the evox -->' + apiURL);

        const xhr = new XMLHttpRequest();
        const url = 'http://api.evoximages.com/api/v1/vehicles?api_key=7NzFzyS2e8zz7nsFBF3GwEuTKxdxeA6P&year=2018&make=Audi&model=A8';
        xhr.open('GET', url, true);

        xhr.onload = function() {
            window.console.log('Status code' + this.status);
            if(this.status === 200) {
                const response = JSON.parse(this.responseText);
                let output = '<ul class=\'slds-list--dotted\'>';
                if(response.type === 'success') {
                    response.value.forEach(function(joke){
                        output += `<li>${joke.joke}</li>`;
                    });
                }
                output += '<ul>';
                window.console.log(output);
            }
        };

        xhr.send();
    }
     /*
        fetch(apiURL, 
        {

            // Request type
            method:"GET",
            headers:{
                // content type
                "Content-Type": "application/json",
            }
        })
        
        .then((response) => {
            window.console.log('callout response --> '+response.json());
            window.console.log('In the evox111 -->' + apiURL);
            return response.json(); // returning the response in the form of JSON
        })
        .then((jsonResponse) => {
            window.console.log('callout response1 --> '+JSON.stringify(jsonResponse));
        })
        .catch(error => {
            window.console.log('In the evox -->' + apiURL);
            window.console.log('callout error ===> '+JSON.stringify(error));
        })
    } */
}