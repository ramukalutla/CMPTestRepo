import { LightningElement,api,track,wire } from 'lwc';
import Icon from '@salesforce/resourceUrl/Resources';
import { NavigationMixin,CurrentPageReference } from 'lightning/navigation';
import listClaimRes from '@salesforce/apex/ListClaimStaticResponse.listClaimRes';
export default class ClaimlistTemp extends NavigationMixin(LightningElement) {
    @api image1=Icon+'/images/background.PNG';
    @api notification=Icon+'/images/Notification.PNG';
    @track claims;
    @track error;
    @track value ;
    @track openClaims=[]; 
    @track flag=false;
   @track count;
   @track loading;
   
    get backgroundStyle(){
       return `height:50rem;background-image:url(${this.image1})`;
    }
    get values() {
        return [
           { label: 'Open Claim', value: 'open claim' },
           { label: 'Policy', value: 'policy' },
           {label:'view all claims',value:'all claims'}  
       ];
   }
   
   
   
   @wire(CurrentPageReference)
   wiredPageRef() {
       this.loading = false;
   }
   claimClick() {
   
       this.loading = true;
   
       this[NavigationMixin.Navigate]({
           type: 'standard__component',
           attributes: {
               componentName: 'c__contact-details'
           },
       });
   }
   
   submitClaim(){
     this[NavigationMixin.Navigate]({
   
       type: 'standard__webPage',
   
       attributes: {
   
       url: 'https://efnolsit1-farmers.cs19.force.com/eFNOL/claimsstatusportal_login#/login?SO=01'
   
       }
   
     },
   
     true // Replaces the current page in your browser history with the URL
   
     );
   }
   
   
   handleClaims(event){
     window.console.log("event fired");
      this.value=event.target.value;
      this.openClaims =[];
       for(let u=0;u<this.claims.length;u++){
           if(this.value==="open claim" && this.claims[u].status==="Open"){
           this.openClaims.push(this.claims[u]);
           this.count=this.openClaims.length;
           window.console.log("openClaims:: "+this.openClaims);
          
             window.console.log('open claims are'+JSON.stringify(this.openClaims));
           }else if(this.value==="policy" && this.claims[u].status==="Closed"){  
             this.openClaims.push(this.claims[u]);
             this.count=this.openClaims.length;
          window.console.log('policy claims are obj'+this.openClaims);
          
           }
           else if(this.value==="all claims"){
             this.count=this.claims.length;
             this.openClaims.push(this.claims[u]);
              
               window.console.log('policy claims are'+JSON.stringify(this.claims));
           }
       }
       window.console.log("LISTS@@@" +JSON.stringify(this.openClaims +'\n' +this.claims ));
   }
   
   
   debugger;
    @wire(listClaimRes)
    wireClaims({error,data}){
     if(data){
       this.claims=data;
       this.openClaims=[];
       for(let i=0;i<this.claims.length;i++){
           if(this.claims[i].status==="Open")
           {
               this.openClaims.push(this.claims[i])
           }
       }
       window.console.log('open dataaaaa',JSON.stringify(this.openClaims));
       window.console.log('data',JSON.stringify(this.data));
     }
     else if(error){
       this.error=error;
       window.console.log('error',error);
     }
    }
   }