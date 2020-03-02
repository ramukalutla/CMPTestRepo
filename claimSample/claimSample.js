import { LightningElement, api, track, wire } from 'lwc';
import Icon from '@salesforce/resourceUrl/Resources';
import '@salesforce/resourceUrl/farmersstyle';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import listClaimRes from '@salesforce/apex/ListClaimStaticResponse.listClaimRes';


export default class ClaimSample extends NavigationMixin(LightningElement) {
    @api image1 = Icon + '/images/background.PNG';
    @api notification = Icon + '/images/Notification.png';
    @track claims;
    @track error;
    @track value = [];
    @track label = [];
    @track uniqueArray = [];
    @track openClaims = [];
    @track flag = false;
    @track header;
    @track count;
    @track loading;
    get backgroundStyle() {
      return `height:auto; background-image:url(${this.image1})`;
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
          componentName: 'c__contactDetails'
        },
      });
    }
  
    submitClaim() {
      this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
          url: 'https://efnolsit1-farmers.cs19.force.com/eFNOL/claimsstatusportal_login#/login?SO=01'
        }
      },
        true // Replaces the current page in your browser history with the URL
      );
    }
  
    //unique filter
  
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
  
  
    handleClaims(event) {
      window.console.log("event fired");
      this.value = event.target.value;
      window.console.log("value of values are" + this.value);
      this.openClaims = [];
      this.label = [];
      for (let u = 0; u < this.claims.length; u++) {
        if (this.value === "View Auto Claims" && this.claims[u].policyType === "Auto") {
          this.openClaims.push(this.claims[u]);
          this.count = this.openClaims.length;
          this.label = "Auto claims";
          window.console.log("openClaims:: " + this.openClaims);
          window.console.log('open claims are' + JSON.stringify(this.openClaims));
        } else if (this.value === "View Homeowner Claims" && this.claims[u].policyType === "Homeowner") {
          this.openClaims.push(this.claims[u]);
          this.count = this.openClaims.length;
          this.label = "Homeowner Claims"
          window.console.log('policy claims are obj' + this.openClaims);
        }
        else if (this.value === "View all claims") {
          this.count = this.claims.length;
          this.openClaims.push(this.claims[u]);
          this.label = "All claims";
          window.console.log('policy claims are' + JSON.stringify(this.claims));
        }
      }
      window.console.log("LISTS@@@" + JSON.stringify(this.openClaims + '\n' + this.claims));
    }
  
  
    debugger;
    @wire(listClaimRes)
    wireClaims({ error, data }) {
      if (data) {
        this.claims = data;
        window.console.log("claims list is" + JSON.stringify(this.claims));
      /*  for(let i = 0; i < this.claims.length; i++){
           // this.notify=this.claims[i].notification==null?'display:none':'display:block';
           if(this.claims[i].notification==='null'){
             window.console.log("notify valuewrwewe is"+this.claims[i].notification)
             this.notify.push('display:none;');
           }
           else{
            window.console.log("notify value is"+this.claims[i].notification)
             this.notify.push('display:block;');
           }
           window.console.log("notfication"+this.notify)
        }
        */
        this.uniqueArray = this.claims.map(item => item.label).filter((value, index, self) => self.indexOf(value) === index);
        window.console.log("unique values are" + this.uniqueArray);
        this.uniqueArray.push("View all claims");
        this.openClaims = [];
        for (let i = 0; i < this.claims.length; i++) {
          this.label.push(this.claims[i].label);
          window.console.log("lables are" + JSON.stringify(this.label));
          this.value.push(this.claims[i].value);
          window.console.log("values arererer are" + JSON.stringify(this.value));
          if (this.claims[i].status === "Open") {
            this.openClaims.push(this.claims[i])
          }
        }
        this.count = this.openClaims.length;
        this.label = "Open Claims";
        window.console.log('open dataaaaa', JSON.stringify(this.openClaims));
        window.console.log('data', JSON.stringify(this.data));
      }
      else if(error) {
        this.error = error;
        window.console.log('error', error);
      }
    }
}