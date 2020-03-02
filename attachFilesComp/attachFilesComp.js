import { LightningElement, api, track,wire } from 'lwc';
import Icon from '@salesforce/resourceUrl/Resources';
import { loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import releatedFiles from '@salesforce/apex/CMP_AttachFileController.releatedFiles';
import saveFiles from '@salesforce/apex/CMP_AttachFileController.saveFiles';
import createDummyRecord from '@salesforce/apex/CMP_AttachFileController.createDummyRecord';
import getRelatedFileList from '@salesforce/apex/CMP_AttachFileController.getRelatedFileList';
import createEfnolFile from '@salesforce/apex/CMP_AttachFileController.createEfnolFile';

const columns = [
    { label: 'Title', fieldName: 'Title' }
];
export default class AttachFilesComp extends LightningElement {
    @api recordId;
    @api ClaimNumber;
    @track value;
    @track fileLst;
    @track finDocList = [];
    @api selectedOption = {};
    @track selectOptionsFlag = false;
    @track columns = columns;
    @api res;
    @api uniqueArray = [];
    @api tempDocIds = [];
    @api retValues;
    @api docData;
    @track value = 'inProgress';
    @api uploadedFiles;
    @api claimInfo;
    @api caseID;
    @api expClmUnitNumber;
    @api medClmUnitNumber;
    @track count=0;
    @track buttonflag = true;
    @wire(CurrentPageReference) pageRef;
    get options() {
        return [
            { label: 'Medical Document', value: 'Medical Document' },
            { label: 'Invoice', value: 'Invoice' },
            { label: 'Estimate', value: 'Estimate' },
            { label: 'Photo', value: 'Photo' },
            { label: 'Police Report', value: 'Police Report' },
            { label: 'Other', value: 'Other' }
        ];
    }
    // accepted parameters
    get acceptedFormats() {
        return '.pdf, .png, .jpg, .jpeg, .docx, .xlsm, .doc, .txt';
    }
    connectedCallback() {
        if(this.claimInfo && this.claimInfo.ClaimContactInfo){
            this.ClaimContactId = this.claimInfo.ClaimContactInfo.ClaimContactCRNId;
            this.claimNumber = this.claimInfo.ClaimNumber;
            this.createDummyRecord();
        }
    }
    handleUploadFinished(event) {
        //Get the list of uploaded files
        this.uploadedFiles = event.detail.files;
        this.selectOptionsFlag = true;
        window.console.log('Files Uploaded' + JSON.stringify(this.uploadedFiles));
        this.createEfnolFileUpload();
    }
    handleChange(event) {
        this.value = event.detail.value;
        window.console.log('data-->' + this.value);

    }
    // Map attachment Id to efnol file upload 
    createEfnolFileUpload(){
        //window.console.log('Doc Id '+this.uploadedFiles);
        createEfnolFile({ filesUploadlst: this.uploadedFiles, efnolRecordID:this.recordId, relatedCase:this.caseID})   // write apex method to retrive related records to particular ID
        .then(data => {
            this.fileLst = data;
            this.getRelatedFiles();
            window.console.log('Test Data-->' + JSON.stringify(this.fileLst));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }
    // Getting releated files of the current record
    getRelatedFiles() {
        window.console.log(" in the related list"+this.fileLst );
        releatedFiles({ uploadedRecs: this.fileLst })   //write apex method to retrive related records to particular ID
            .then(data => {
                this.docData = data;
                this.res = data;
                window.console.log('data to show user for file type' + JSON.stringify(this.docData));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!!',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }
  // Getting selected rows to perform any action
    selecteOptions(event) {
        const docID = event.target.id;
        const slicedId = docID.slice(0, 18);
        this.count +=1;
        for (let j = 0; j < this.tempDocIds.length; j++) {
            if (this.tempDocIds[j].Id === slicedId) {
                delete this.tempDocIds[j];
                this.count -=1;
                window.console.log('Dup Count' + this.count);
            }
        }
        for (let i = 0; i < this.res.length; i++) {
            window.console.log('Intial Count' + this.count);
            if (slicedId === this.res[i].Id) {
                this.tempDocIds.push({ "Id": this.res[i].Id, "name": this.res[i].Name, "DocType": event.target.value, "claimNo":this.claimNumber, 
                "claimCRN":this.ClaimContactId,"expClmUnit":this.expClmUnitNum,"medClmUnitNum":this.medClmUnitNum});
            }
        }
        this.tempDocIds = this.tempDocIds.filter(function (el) {
            return el !== null || undefined;
        });
        if(this.res.length === this.count){
            this.buttonflag = false;
        }
        this.finDocList = this.tempDocIds;
    } 
    updateSelectedRecords() {
        window.console.log("In Imperative Call");
        saveFiles({listFiles: this.finDocList})
            .then(data => {
                this.retValues = data;
                const event = new ShowToastEvent({
                    "title": "Success!",
                    "message": "Uploaded documents can take up to 24 hours to appear in your document list."
                });
                this.selectOptionsFlag = false;
                this.buttonflag = true;
                this.count=0;
                this.finDocList.length=0;
                this.tempDocIds.length=0;
                this.dispatchEvent(event);
                this.getRelatedRecList();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!!',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }
    createDummyRecord(){
        createDummyRecord({claimNumber: this.claimNumber})
        .then(data =>{
            this.recId = data;
            window.console.log('Record Created'+ JSON.stringify(this.recId));
            this.recordId = this.recId.FileUploadId;
            this.caseID = this.recId.CaseId;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );
        })

    }
    getRelatedRecList(){
        getRelatedFileList({claimId:this.caseID})
        .then(data => {
            this.docData = data;
          if(this.docData &&  this.docData != null){
            const docValues = {"docLists": this.docData};
              fireEvent(this.pageRef, 'uploadedListOfRecs', docValues);
          }
        })
        .catch(error =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );  
        })
    }
    renderedCallback(){
        loadStyle(this,Icon+'/css/attachfile.css')
        .then(()=>{});
      }
}