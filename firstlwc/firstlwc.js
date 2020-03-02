import { LightningElement, wire, track } from "lwc";
import findPolicyLC from "@salesforce/apex/FindPolicy_LC_LWC.findPolicyLC";
export default class HelloWorld extends LightningElement {
  @track dataReturned;
  @wire(findPolicyLC)
  getResp({ data, error }) {
    if (data) {
      this.dataReturned = data && data.houseHoldPolicy ? data.houseHoldPolicy : null;
    } else if (error) {
      this.error = error;
      this.Res1 = undefined;
    }
  }
}