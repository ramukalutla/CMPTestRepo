import { LightningElement,track,api, wire } from 'lwc';
import getEstimateQuestionMetaData from '@salesforce/apex/EstimateQuestionMetaData.getEstimateQuestionMetaData';
import {  registerListener, unregisterAllListeners} from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import Icon from '@salesforce/resourceUrl/Resources';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class EstimateQuestionT extends LightningElement {
    @track estimateMetaData;
    @api flag = false;
    @track iconName = 'utility:chevrondown';
    @api questionFlag;
    @wire(CurrentPageReference) pageRef;
    @wire(getEstimateQuestionMetaData)
    wireMetaData({error,data}) 
    {
      this.questionFlag=true;
        if (data) 
        {
            this.estimateMetaData = data;
            for(let i=0;i<this.estimateMetaData.length;i++){
              window.console.log("entered for loop");
              if(this.estimateMetaData[i].Label==="BettermentOrDeprecation"){
                this.answer=this.estimateMetaData[i].Answer__c;
                window.console.log("answer is"+JSON.stringify(this.answer));
              }
            }
        }
        if (error) {
            this.error = error;
            window.console.log('error--->' + this.error);
        }
    }
    redirectDashboard(){
       //TBD
    }
    connectedCallback() {
        // subscribe to inputChangeEvent event
        window.console.log("Questions Page "); 
        registerListener('questionsEvent', this.handleChange, this);
      }
      handleChange(inpVal) {
        this.question = inpVal.questionFlag;
        this.dashBoardComp=inpVal.DashboradFlag;
        window.console.log("this.questio"+this.question); 
        this.getTimeLineData();
      }
      disconnectedCallback() {
        // unsubscribe from inputChangeEvent event
        unregisterAllListeners(this);
      }

      renderedCallback() {
        loadStyle(this, Icon + '/fonts/slate-pro-cufonfonts-webfont/style.css')
            .then(() => { });
      }
}