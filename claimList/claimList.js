import { LightningElement, api, track, wire } from 'lwc';
import Icon from '@salesforce/resourceUrl/Resources';
import { loadStyle } from 'lightning/platformResourceLoader';
import { registerListener, unregisterAllListeners,fireEvent } from 'c/pubsub';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
//import listClaimRes from '@salesforce/apex/ListClaimStaticResponse.listClaimRes';

export default class ClaimList extends NavigationMixin(LightningElement) {
  @api image1 = Icon + '/images/background.PNG';
  @api notification = Icon + '/images/Notification.png';
  @track claims;
  @track error;
  @track value = [];
  @track label = [];
  @track uniqueArray = [];
  @track openClaims = [];
  @track flag = false;
  @track flag2=false;
  @track header;
  @track count;
  @track loading;
  @api claimDispFlag;
  @api policyDispFlag;
  @api firstName;
  @api lastName;
  @wire(CurrentPageReference) pageRef;
  get backgroundStyle() {
    return `height:auto; background-image:url(${this.image1})`;
  }

renderedCallback(){
  loadStyle(this,Icon+'/fonts/slate-pro-cufonfonts-webfont/style.css')
  .then(()=>{});
}

  @wire(CurrentPageReference)
  wiredPageRef() {
    this.loading = false;
  }
  claimClick() {
    this.loading = true;
	// Firing the event on click on claim number to get full claim list
    /* call the apex method to get claim long pull service*/
    this.claimDispFlag =false;
    this.dashBoardDispFlag=true;
    const flagValues = {"dashBrdFlag": this.dashBoardDispFlag};
    fireEvent(this.pageRef, 'dashBoardMainEvent',flagValues);  
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

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  handleClaims(event) {
    this.value = event.target.value;
    this.openClaims = [];
    this.label = [];
    for (let u = 0; u < this.claims.length; u++) {
      if (this.value === "View Auto Claims" && this.claims[u].policyType === "Auto") {
        this.openClaims.push(this.claims[u]);
        this.count = this.openClaims.length;
        this.label = "Auto claims";
      } else if (this.value === "View Homeowner Claims" && this.claims[u].policyType === "HomeOwners") {
        this.openClaims.push(this.claims[u]);
        this.count = this.openClaims.length;
        this.label = "Homeowners Claims"
      }
      else if (this.value === "View all claims") {
        this.count = this.claims.length;
        this.openClaims.push(this.claims[u]);
        this.label = "All claims";
      }
    }
  }
  connectedCallback() {
    // subscribe to claimSearch event
    registerListener('ClaimSearchEvent', this.handleChange, this);
  }
  handleChange(inpVal) {
    this.claimList = inpVal.claimDetails;
    this.claimDispFlag=inpVal.dispFlag;
    this.policyDispFlag=inpVal.policyFlag;
    this.firstName=inpVal.fName;
    this.lastName=inpVal.lName;
    this.renderCLaimList();
  }
  renderCLaimList(){
    this.policyDispFlag=true;
    this.claims = this.claimList;
    this.uniqueArray = this.claims.map(item => item.label).filter((value, index, self) => self.indexOf(value) === index);
      this.uniqueArray.push("View all claims");
      this.openClaims = [];
      for (let i = 0; i < this.claims.length; i++) {
        this.label.push(this.claims[i].label);
        this.value.push(this.claims[i].value);
        if (this.claims[i].status === "Open") {
          this.openClaims.push(this.claims[i])
        }
      }
      this.count = this.openClaims.length;
      this.label = "Open Claims";
  }
  disconnectedCallback() {
    // unsubscribe from inputChangeEvent event
    unregisterAllListeners(this);
  }
  
}