import { LightningElement, api, track, wire } from "lwc";
import Icon from '@salesforce/resourceUrl/Resources';
import modify_Cancel_PhotoApp_Service from "@salesforce/apex/CMP_Page_Controller.modify_Cancel_PhotoApp_Service";
import { CurrentPageReference } from "lightning/navigation";
import {fireEvent} from 'c/pubsub';
export default class EstimateConfirmationPage extends LightningElement {
  logoImg = Icon + "/images/Estimateicon.PNG";
  //@api label = { Estimateicon };
  @track disablePhotoAppBtn = true;
  @api estimateConfirmationDispFlag;
  @track loading;
  @api formData;
  @api mobileNumber;
  @api claimInfo;
  @api claimDetail;
  @track loaded = true;

  @wire(CurrentPageReference) pageRef;
  @wire(CurrentPageReference)
  connectedCallback() {
    window.scrollTo(0,0);
    window.console.log("page load of photo app..");
    if(this.claimInfo && this.claimInfo.ClaimContactInfo){
      this.claimDetail = this.claimInfo;
      this.formData = {
        PhotoAppExist: "yes",
        mobileNumber: this.mobileNumber,
        claimCRNId: this.claimDetail.ClaimCRNId,
        contactCRNID: this.claimInfo.ClaimContactInfo.ClaimContactCRNId,
        claimNumber :this.claimDetail.ClaimNumber,
        claimSystemName: "GWCC",
        partyAPIoperation: "modify_EFT"
      };
    }
    
  }
  
  @wire(CurrentPageReference)
  wiredPageRef() {
    this.loading = false;
  }

  handleMobileNumber(event) {
    if (event.target.value) {
      this.formData.mobileNumber = event.target.value;
      this.disablePhotoAppBtn = false;
    } else {
      this.disablePhotoAppBtn = true;
    }
  }
 
  handlePhotoAppService() {
      this.loaded = false;
      modify_Cancel_PhotoApp_Service({ partyInput: this.formData })
        .then(result => {
          window.console.log("result" + JSON.stringify(result));
          window.console.log("input Data -->" + JSON.stringify(this.formData));
          if (result.statusCode === 200) {
            this.loaded = !this.loaded;
            this.disablePhotoAppBtn = true;
              fireEvent(this.pageRef, "showDashboardWithPhotoAppCard", null);
          }else if(result.statusCode === 500){
            this.loaded = !this.loaded;
          }
         
        })
        .catch(error => {
          this.loaded = !this.loaded;
          window.console.log("Error" + error);
          // TODO Error handling
        });
    } 
    handleBackBtn() {
      fireEvent(this.pageRef, "showDashboard", null);
    }

}