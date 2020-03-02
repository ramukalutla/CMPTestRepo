import {LightningElement, api, wire, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import {loadStyle} from 'lightning/platformResourceLoader';
import Font from '@salesforce/resourceUrl/Font';
import staticResponce from '@salesforce/apex/ClaimStaticResp.staticResponce';
//import addOrCancelEmailRequest from '@salesforce/apex/CMP_modify_Cancel_PartyAPI_HelperClass.addOrCancelEmailRequest';
/* eslint-disable no-console */
/* eslint-disable no-alert */
export default class ClaimOverviewPage extends LightningElement {
    @api resData;
    @api showClaimRep;
    @api showClaimType;
    @api showSupervisor;
    @api emailCorrespondence;
    @api emailIfYes;
    @api emailIfNull;
    @api textMessaging;
    @api textIfYes;
    @api textIfNull;
    @track emailCheckbox;
    @api emailOpt;
    @api textOpt;
    renderedCallback(){
        loadStyle(this,Font+'/style.css')
        .then(()=>{});
        } 
    savePreferencesClick() {
        /*addOrCancelEmailRequest({
            input: this.formData
        }).then(res => {
            console.log(res);
        }).catch(err => console.log(err));*/
    }
    handleEmailOpt(event) {
        if (event.target.checked) {
            this.emailOpt = 'yes';
        }
    }
    handleTextOpt(event) {
        if (event.target.checked) {
            this.textOpt = 'yes';
        }
    }
    signUpButton() {
        // Navigate to a URL
        this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: 'https://farmers--cmpdev.lightning.force.com/lightning/n/requestPaymentPage'
                }
            },
            true // Replaces the current page in your browser history with the URL
        );
    }
    debugger;
    @wire(staticResponce)
    wireClaims({
        error,
        data
    }) {
        if (data) {
            this.resData = data;
            //window.console.log('data....' + this.data);
            //window.console.log('resData...' + JSON.stringify(this.resData));
            for (let i = 0; i < this.resData.length; i++) {

                //window.console.log('res data is....' + this.resData[i].CRBasedonOMFlagMap.claimRepresentative.fullName);
                if (this.resData[i].CRBasedonOMFlagMap.claimRepresentative.fullName !== '') {
                    this.showClaimRep = true;
                    this.showClaimType = false;
                } else if (this.resData[i].CRBasedonOMFlagMap.claimRepresentative.fullName === '') {
                    this.showClaimType = true;
                    this.showClaimType = false;
                }
                if (this.resData[i].CRBasedonOMFlagMap.claimRepresentative.supFirstName !== '' || this.resData[i].CRBasedonOMFlagMap.claimRepresentative.supLastName !== '') {
                    //window.console.log('res data is....' + this.resData[i].CRBasedonOMFlagMap.claimRepresentative.supFirstName + this.resData[i].CRBasedonOMFlagMap.claimRepresentative.supLastName);
                    this.showSupervisor = true;
                } else {
                    this.showSupervisor = false;
                }
                if (this.resData[i].contactDetailsMap.emailOpt === 'yes' ||
                    this.resData[i].contactDetailsMap.emailOpt === 'YES' ||
                    this.resData[i].contactDetailsMap.emailOpt === '') {
                    //window.console.log("email resp is...>" + this.resData[i].contactDetailsMap.emailConfirmed);
                    this.emailCorrespondence = true;
                }
                if (this.resData[i].contactDetailsMap.emailOpt === 'yes' ||
                    this.resData[i].contactDetailsMap.emailOpt === 'YES') {

                    this.emailIfYes = true;
                }
                if (this.resData[i].contactDetailsMap.emailOpt === '') {
                    this.emailIfNull = true;
                }
                if (this.resData[i].contactDetailsMap.textOpt === 'yes' ||
                    this.resData[i].contactDetailsMap.textOpt === 'YES' ||
                    this.resData[i].contactDetailsMap.textOpt === '') {
                    //window.console.log("text resp is...>" + this.resData[i].contactDetailsMap.textConfirmed);
                    this.textMessaging = true;
                }
                if (this.resData[i].contactDetailsMap.textOpt === 'yes' ||
                    this.resData[i].contactDetailsMap.textOpt === 'YES') {
                    this.textIfYes = true;
                }
                if (this.resData[i].contactDetailsMap.textOpt === '') {
                    this.textIfNull = true;
                }
            }
        } else if (error) {
            this.error = error;
            window.console.log('error..', error);
        }
    }
}