export class GarageStatus {
  currentDoorStatus: string;
  lastHealthCheckDateTime: Date;
  sortOrder: number;
  description: string;
  clientId: string;
  action: string;

  constructor(currentDoorStatus: string, lastHealthCheckDateTime: Date, sortOrder: number, description: string, clientId: string) {
    this.currentDoorStatus = currentDoorStatus;
    this.lastHealthCheckDateTime = lastHealthCheckDateTime;
    this.sortOrder = sortOrder;
    this.description = description;
    this.clientId = clientId;
    this.action = '';
  }

  public hasActionableStatus() : boolean {
    let valuesExist = this.currentDoorStatus !== null && this.currentDoorStatus !== '' && this.lastHealthCheckDateTime !== null;
    if (!valuesExist) {
      return false;
    }
    else {
      let now = new Date();
      let diff = now.getTime() - this.lastHealthCheckDateTime.getTime();

      // 300000 == 5 minutes
      return diff <= 300000;
    }
  }

  public isActionInProgress() : boolean {
    return this.action !== '';
  }

  public isOpen() : boolean {
    return this.currentDoorStatus === 'open';
  }

  public shouldAllowAction(isOpenButton: boolean) : boolean {
    if (isOpenButton) {
      return !this.isActionInProgress() && this.hasActionableStatus() && !this.isOpen();
    }
    else {
      return !this.isActionInProgress() && this.hasActionableStatus() && this.isOpen();
    }
  }
}
